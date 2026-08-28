import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { EMPTY_SETUP_PAYLOAD } from '../src/domain/foundation';
import { IndexedDBAccountingRepository } from '../src/infrastructure/indexeddb/accounting-repository';
import { IndexedDBCommercialRepository } from '../src/infrastructure/indexeddb/commercial-repository';
import { getDatabase } from '../src/infrastructure/indexeddb/database';
import { IndexedDBExecutionRepository } from '../src/infrastructure/indexeddb/execution-repository';
import { IndexedDBFoundationRepository } from '../src/infrastructure/indexeddb/repositories';

async function fixture() {
  const payload = structuredClone(EMPTY_SETUP_PAYLOAD);
  payload.company = { ...payload.company, arabicName: 'شركة التنفيذ', code: 'EXE-01', country: 'مصر', baseCurrency: 'EGP' };
  payload.fiscalYear = { name: '2027', startDate: '2027-01-01', endDate: '2027-12-31' };
  const companyId = await new IndexedDBFoundationRepository().completeSetup(payload);
  const commercial = new IndexedDBCommercialRepository();
  const accounting = new IndexedDBAccountingRepository();
  const execution = new IndexedDBExecutionRepository();
  const accounts = await accounting.createContractingTemplate(companyId, 'EGP');
  const id = (code: string) => accounts.find((account) => account.code === code)!.id;
  await accounting.saveMappings(companyId, { ar: id('1130'), revenue: id('4100'), vat_output: id('2120'), retention: id('2130'), advances: id('2130') });
  const client = await commercial.saveParty({ companyId, type: 'client', code: 'CL-01', arabicName: 'عميل', paymentTermsDays: 30, status: 'active' });
  const subcontractor = await commercial.saveParty({ companyId, type: 'subcontractor', code: 'SUB-01', arabicName: 'مقاول', paymentTermsDays: 30, status: 'active' });
  const project = await commercial.saveProject({ companyId, code: 'P-01', name: 'مشروع', clientId: client.id, contractType: 'industrial_contracting', originalContractValue: 10_000, status: 'active' });
  const contract = await commercial.saveContract({ companyId, projectId: project.id, clientId: client.id, number: 'CTR-01', title: 'عقد', type: 'industrial_contracting', currency: 'EGP', originalValue: 10_000, approvedVariations: 0, retentionRate: 5, advanceRate: 10, startDate: '2027-01-01', status: 'active' });
  const boq = await commercial.saveBOQItem({ companyId, projectId: project.id, contractId: contract.id, code: 'B-01', description: 'بند', unit: 'EA', quantity: 10, sellingRate: 100, budgetCost: 70, status: 'active' });
  return { companyId, accounting, execution, client, subcontractor, project, contract, boq };
}

describe('execution, IPC and handover controls', () => {
  beforeEach(async () => { const db = getDatabase(); await db.delete(); await db.open(); });

  it('calculates revised subcontracts and eligible materials on site', async () => {
    const { companyId, execution, subcontractor, project, contract, boq } = await fixture();
    const subcontract = await execution.saveSubcontract({ companyId, number: 'SC-01', projectId: project.id, subcontractorId: subcontractor.id, title: 'أعمال تركيب', originalValue: 500, variations: 75, retentionRate: 5, advanceAmount: 50, startDate: '2027-01-01', status: 'active' });
    expect(subcontract.revisedValue).toBe(575);
    const mos = await execution.saveMOS({ companyId, number: 'MOS-01', projectId: project.id, contractId: contract.id, boqItemId: boq.id, description: 'خامات بالموقع', quantity: 2, rate: 80, eligibleForIPC: true, status: 'approved' });
    expect(mos.amount).toBe(160);
  });

  it('caps cumulative BOQ quantities and posts IPC into a balanced client invoice', async () => {
    const { companyId, accounting, execution, client, project, contract, boq } = await fixture();
    await expect(execution.saveIPC({ companyId, number: 'IPC-BAD', projectId: project.id, contractId: contract.id, clientId: client.id, date: '2027-02-01', retentionAmount: 0, advanceRecovery: 0, vatAmount: 0, deductions: 0, status: 'draft', lines: [{ boqItemId: boq.id, previousQuantity: 8, currentQuantity: 3 }] })).rejects.toThrow(/BOQ/);
    const mos = await execution.saveMOS({ companyId, number: 'MOS-02', projectId: project.id, contractId: contract.id, boqItemId: boq.id, description: 'خامات معتمدة', quantity: 1, rate: 50, eligibleForIPC: true, status: 'approved' });
    const ipc = await execution.saveIPC({ companyId, number: 'IPC-01', projectId: project.id, contractId: contract.id, clientId: client.id, date: '2027-02-01', retentionAmount: 50, advanceRecovery: 25, vatAmount: 140, deductions: 0, status: 'draft', includeMOSIds: [mos.id], lines: [{ boqItemId: boq.id, previousQuantity: 4, currentQuantity: 6 }] });
    expect(ipc.previousCertified).toBe(400);
    expect(ipc.currentWork).toBe(600);
    expect(ipc.materialsOnSite).toBe(50);
    expect(ipc.netDue).toBe(715);
    await execution.postIPC(ipc.id);
    const posted = (await execution.listIPCs(companyId))[0];
    expect(posted.status).toBe('posted');
    expect(posted.clientInvoiceId).toBeTruthy();
    const trial = await accounting.getTrialBalance(companyId);
    expect(trial.reduce((sum, row) => sum + row.debitBalance, 0)).toBe(trial.reduce((sum, row) => sum + row.creditBalance, 0));
  });

  it('blocks invalid final handover and validates retention releases', async () => {
    const { companyId, execution, client, project, contract } = await fixture();
    await expect(execution.saveHandover({ companyId, number: 'H-01', projectId: project.id, kind: 'final', date: '2027-12-01', scope: 'كامل المشروع', openItems: 'ملاحظة', acceptedByClient: true, status: 'accepted' })).rejects.toThrow(/بنود مفتوحة/);
    await expect(execution.saveRelease({ companyId, number: 'RR-00', partyType: 'client', partyId: client.id, projectId: project.id, sourceType: 'contract', sourceId: contract.id, date: '2027-12-15', amount: 0, status: 'draft' })).rejects.toThrow(/أكبر من صفر/);
    const release = await execution.saveRelease({ companyId, number: 'RR-01', partyType: 'client', partyId: client.id, projectId: project.id, sourceType: 'contract', sourceId: contract.id, date: '2027-12-15', amount: 100, status: 'approved' });
    expect(release.amount).toBe(100);
  });
});

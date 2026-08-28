import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { EMPTY_SETUP_PAYLOAD } from '../src/domain/foundation';
import { getDatabase } from '../src/infrastructure/indexeddb/database';
import { IndexedDBCommercialRepository } from '../src/infrastructure/indexeddb/commercial-repository';
import { IndexedDBFoundationRepository } from '../src/infrastructure/indexeddb/repositories';

async function createCompany(code: string) {
  const payload = structuredClone(EMPTY_SETUP_PAYLOAD);
  payload.company = { ...payload.company, arabicName: `شركة ${code}`, code, country: 'مصر', baseCurrency: 'EGP' };
  payload.fiscalYear = { name: '2027', startDate: '2027-01-01', endDate: '2027-12-31' };
  return new IndexedDBFoundationRepository().completeSetup(payload);
}

async function commercialFixture() {
  const companyId = await createCompany('COM-01');
  const repository = new IndexedDBCommercialRepository();
  const client = await repository.saveParty({ companyId, type: 'client', code: 'C-01', arabicName: 'العميل الأول', paymentTermsDays: 30, status: 'active' });
  const project = await repository.saveProject({ companyId, code: 'P-01', name: 'مشروع المصنع', clientId: client.id, contractType: 'industrial_contracting', originalContractValue: 1000, retentionRate: 5, advanceRate: 10, physicalProgress: 0, lifecycleStatus: 'active', status: 'active' });
  const contract = await repository.saveContract({ companyId, projectId: project.id, clientId: client.id, number: 'CTR-01', title: 'عقد المصنع', type: 'industrial_contracting', currency: 'EGP', originalValue: 1000, approvedVariations: 0, retentionRate: 5, advanceRate: 10, startDate: '2027-01-01', status: 'active' });
  return { companyId, repository, client, project, contract };
}

describe('commercial and project core', () => {
  beforeEach(async () => { const db = getDatabase(); await db.delete(); await db.open(); });

  it('keeps parties isolated per company and prevents duplicate codes by party type', async () => {
    const firstCompany = await createCompany('ISO-01');
    const secondCompany = await createCompany('ISO-02');
    const repository = new IndexedDBCommercialRepository();
    await repository.saveParty({ companyId: firstCompany, type: 'supplier', code: 'SUP-01', arabicName: 'مورد أول', paymentTermsDays: 15, status: 'active' });
    await repository.saveParty({ companyId: secondCompany, type: 'supplier', code: 'SUP-01', arabicName: 'مورد آخر', paymentTermsDays: 20, status: 'active' });
    await expect(repository.saveParty({ companyId: firstCompany, type: 'supplier', code: 'sup-01', arabicName: 'مكرر', paymentTermsDays: 0, status: 'active' })).rejects.toThrow(/مستخدم/);
    expect(await repository.listParties(firstCompany, 'supplier')).toHaveLength(1);
    expect((await repository.listParties(secondCompany, 'supplier'))[0].arabicName).toBe('مورد آخر');
  });

  it('validates BOQ values and allows deleting drafts only', async () => {
    const { companyId, repository, project, contract } = await commercialFixture();
    const item = await repository.saveBOQItem({ companyId, projectId: project.id, contractId: contract.id, code: '1.1', description: 'توريد وتركيب', unit: 'EA', quantity: 2, sellingRate: 250, budgetCost: 175, status: 'draft' });
    expect(item.quantity * item.sellingRate).toBe(500);
    await expect(repository.saveBOQItem({ companyId, projectId: project.id, contractId: contract.id, code: '1.2', description: 'قيمة سالبة', unit: 'EA', quantity: -1, sellingRate: 1, budgetCost: 1, status: 'draft' })).rejects.toThrow(/سالبة/);
    await repository.removeDraftBOQItem(item.id);
    expect(await repository.listBOQ(companyId)).toHaveLength(0);
  });

  it('converts a won tender to one project and one contract atomically and idempotently', async () => {
    const { companyId, repository, client } = await commercialFixture();
    const tender = await repository.saveTender({ companyId, number: 'T-01', title: 'مناقصة خط إنتاج', clientId: client.id, contractType: 'supply_and_installation', estimatedRevenue: 5000, estimatedCost: 4000, status: 'won' });
    const first = await repository.convertWonTender(tender.id);
    const second = await repository.convertWonTender(tender.id);
    expect(second).toEqual(first);
    expect((await repository.listProjects(companyId)).filter(project => project.id === first.projectId)).toHaveLength(1);
    expect((await repository.listContracts(companyId)).filter(contract => contract.id === first.contractId)).toHaveLength(1);
  });

  it('recalculates the revised contract value from approved variations', async () => {
    const { companyId, repository, project, contract } = await commercialFixture();
    await repository.saveVariation({ companyId, projectId: project.id, contractId: contract.id, number: 'VO-01', title: 'أعمال إضافية', revenueImpact: 250, costImpact: 100, budgetImpact: 100, timeImpactDays: 5, status: 'approved' });
    await repository.saveVariation({ companyId, projectId: project.id, contractId: contract.id, number: 'VO-02', title: 'طلب غير معتمد', revenueImpact: 400, costImpact: 200, budgetImpact: 200, timeImpactDays: 2, status: 'submitted' });
    const updated = (await repository.listContracts(companyId)).find(row => row.id === contract.id)!;
    expect(updated.approvedVariations).toBe(250);
    expect(updated.revisedValue).toBe(1250);
  });
});

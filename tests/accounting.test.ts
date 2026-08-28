import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { EMPTY_SETUP_PAYLOAD } from '../src/domain/foundation';
import { getDatabase } from '../src/infrastructure/indexeddb/database';
import { IndexedDBAccountingRepository } from '../src/infrastructure/indexeddb/accounting-repository';
import { IndexedDBFoundationRepository } from '../src/infrastructure/indexeddb/repositories';

async function companyWithAccounts() {
  const foundation = new IndexedDBFoundationRepository();
  const payload = structuredClone(EMPTY_SETUP_PAYLOAD);
  payload.company = { ...payload.company, arabicName: 'شركة المحاسبة', code: 'ACC-01', country: 'مصر', baseCurrency: 'EGP' };
  payload.fiscalYear = { name: '2027', startDate: '2027-01-01', endDate: '2027-12-31' };
  const companyId = await foundation.completeSetup(payload);
  const accounting = new IndexedDBAccountingRepository();
  const accounts = await accounting.createContractingTemplate(companyId, 'EGP');
  return { accounting, companyId, cash: accounts.find(a=>a.code==='1110')!, capital: accounts.find(a=>a.code==='3100')! };
}

describe('accounting core', () => {
  beforeEach(async()=>{const db=getDatabase();await db.delete();await db.open()});

  it('creates the optional contracting template only after an explicit call', async()=>{
    const foundation = new IndexedDBFoundationRepository();
    const payload=structuredClone(EMPTY_SETUP_PAYLOAD);
    payload.company={...payload.company,arabicName:'شركة فارغة',code:'EMPTY-COA',country:'مصر',baseCurrency:'EGP'};
    payload.fiscalYear={name:'2027',startDate:'2027-01-01',endDate:'2027-12-31'};
    const companyId=await foundation.completeSetup(payload);
    const repository=new IndexedDBAccountingRepository();
    expect(await repository.listAccounts(companyId)).toHaveLength(0);
    expect((await repository.createContractingTemplate(companyId,'EGP')).length).toBeGreaterThan(20);
    await expect(repository.createContractingTemplate(companyId,'EGP')).rejects.toThrow(/غير فارغ/);
  });

  it('rejects unbalanced approval and posts a balanced journal atomically', async()=>{
    const {accounting,companyId,cash,capital}=await companyWithAccounts();
    const unbalanced=await accounting.saveJournal({companyId,date:'2027-01-10',description:'قيد غير متوازن',sourceType:'manual',lines:[
      {accountId:cash.id,debit:100,credit:0},{accountId:capital.id,debit:0,credit:90},
    ]});
    await expect(accounting.approveJournal(unbalanced.entry.id)).rejects.toThrow(/غير متوازن/);
    const balanced=await accounting.saveJournal({companyId,date:'2027-01-10',description:'رأس مال افتتاحي',sourceType:'opening_balance',lines:[
      {accountId:cash.id,debit:100,credit:0},{accountId:capital.id,debit:0,credit:100},
    ]});
    await accounting.approveJournal(balanced.entry.id);
    await accounting.postJournal(balanced.entry.id);
    expect((await accounting.getJournal(balanced.entry.id))?.entry.status).toBe('posted');
    const trial=await accounting.getTrialBalance(companyId);
    expect(trial.reduce((sum,row)=>sum+row.debitBalance,0)).toBe(100);
    expect(trial.reduce((sum,row)=>sum+row.creditBalance,0)).toBe(100);
  });

  it('reverses a posted journal with a posted opposite entry', async()=>{
    const {accounting,companyId,cash,capital}=await companyWithAccounts();
    const original=await accounting.saveJournal({companyId,date:'2027-02-01',description:'قيد قابل للعكس',sourceType:'manual',lines:[
      {accountId:cash.id,debit:250,credit:0},{accountId:capital.id,debit:0,credit:250},
    ]});
    await accounting.approveJournal(original.entry.id);
    await accounting.postJournal(original.entry.id);
    const reversalId=await accounting.reverseJournal(original.entry.id,'2027-02-02');
    expect((await accounting.getJournal(original.entry.id))?.entry.status).toBe('reversed');
    expect((await accounting.getJournal(reversalId))?.entry.status).toBe('posted');
    const trial=await accounting.getTrialBalance(companyId);
    expect(trial.reduce((sum,row)=>sum+row.debitBalance,0)).toBe(0);
    expect(trial.reduce((sum,row)=>sum+row.creditBalance,0)).toBe(0);
  });
});

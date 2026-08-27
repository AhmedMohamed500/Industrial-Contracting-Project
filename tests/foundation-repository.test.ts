import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { EMPTY_SETUP_PAYLOAD } from '../src/domain/foundation';
import { getDatabase } from '../src/infrastructure/indexeddb/database';
import { IndexedDBFoundationRepository } from '../src/infrastructure/indexeddb/repositories';

describe('IndexedDBFoundationRepository', () => {
  beforeEach(async () => { const db = getDatabase(); await db.delete(); await db.open(); });

  it('starts without seeded business records', async () => {
    expect(await getDatabase().companies.count()).toBe(0);
    expect(await getDatabase().fiscalYears.count()).toBe(0);
  });

  it('creates the selected foundation atomically and keeps optional data empty', async () => {
    const repository = new IndexedDBFoundationRepository();
    const payload = structuredClone(EMPTY_SETUP_PAYLOAD);
    payload.company = { ...payload.company, arabicName: 'شركة اختبار المستخدم', code: 'USR-01', country: 'مصر', baseCurrency: 'EGP' };
    payload.fiscalYear = { name: '2027', startDate: '2027-01-01', endDate: '2027-12-31' };
    const id = await repository.completeSetup(payload);
    const snapshot = await repository.getSnapshot(id);
    expect(snapshot?.company.code).toBe('USR-01');
    expect(snapshot?.periods).toHaveLength(12);
    expect(snapshot?.taxes).toHaveLength(0);
    expect(snapshot?.warehouses).toHaveLength(0);
    expect(await repository.getActiveCompanyId()).toBe(id);
  });

  it('prevents duplicate company codes', async () => {
    const repository = new IndexedDBFoundationRepository();
    const payload = structuredClone(EMPTY_SETUP_PAYLOAD);
    payload.company = { ...payload.company, arabicName: 'شركة أولى', code: 'DUP-01', country: 'مصر', baseCurrency: 'EGP' };
    payload.fiscalYear = { name: '2027', startDate: '2027-01-01', endDate: '2027-12-31' };
    await repository.completeSetup(payload);
    await expect(repository.completeSetup({ ...payload, company: { ...payload.company, arabicName: 'شركة ثانية' } })).rejects.toThrow(/مستخدم بالفعل/);
  });
});

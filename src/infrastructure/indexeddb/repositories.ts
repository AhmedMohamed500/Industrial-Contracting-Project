import type { BranchRepository, CompanyRepository, FoundationRepository } from '../../domain/repositories';
import type { AuditEvent, Branch, Company, FiscalYear, FoundationSnapshot, SetupDraft, SetupPayload, TaxDefinition, TreasuryAccount, TrialProject, Warehouse } from '../../domain/foundation';
import { generateMonthlyPeriods } from '../../application/periods';
import { getDatabase } from './database';

const isoNow = () => new Date().toISOString();
const scoped = (companyId: string, now: string) => ({ id: crypto.randomUUID(), companyId, createdAt: now, updatedAt: now });

export class IndexedDBCompanyRepository implements CompanyRepository {
  async list() { return getDatabase().companies.orderBy('createdAt').toArray(); }
  async get(id: string) { return getDatabase().companies.get(id); }
  async update(company: Company) { await getDatabase().companies.put({ ...company, updatedAt: isoNow() }); }
  async codeExists(code: string, excludingId?: string) {
    const company = await getDatabase().companies.where('code').equalsIgnoreCase(code.trim()).first();
    return Boolean(company && company.id !== excludingId);
  }
}

export class IndexedDBBranchRepository implements BranchRepository {
  async list(companyId: string) { return getDatabase().branches.where('companyId').equals(companyId).sortBy('name'); }
  async create(input: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = isoNow();
    const branch: Branch = { ...input, ...scoped(input.companyId, now) };
    await getDatabase().branches.add(branch);
    return branch;
  }
}

export class IndexedDBFoundationRepository implements FoundationRepository {
  async completeSetup(payload: SetupPayload): Promise<string> {
    const db = getDatabase();
    if (await db.companies.where('code').equalsIgnoreCase(payload.company.code.trim()).first()) throw new Error('كود الشركة مستخدم بالفعل');
    const now = isoNow();
    const companyId = crypto.randomUUID();
    const company: Company = {
      id: companyId, code: payload.company.code.trim().toUpperCase(), arabicName: payload.company.arabicName.trim(),
      englishName: payload.company.englishName.trim() || undefined, taxRegistrationNumber: payload.company.taxRegistrationNumber.trim() || undefined,
      commercialRegistration: payload.company.commercialRegistration.trim() || undefined, country: payload.company.country,
      baseCurrency: payload.company.baseCurrency, address: payload.company.address.trim() || undefined, phone: payload.company.phone.trim() || undefined,
      email: payload.company.email.trim() || undefined, status: 'active', createdAt: now, updatedAt: now,
    };
    const fiscalYear: FiscalYear = { ...scoped(companyId, now), name: payload.fiscalYear.name.trim(), startDate: payload.fiscalYear.startDate, endDate: payload.fiscalYear.endDate, status: 'open' };
    const periods = generateMonthlyPeriods(companyId, fiscalYear.id, fiscalYear.startDate, fiscalYear.endDate, now);
    const taxes: TaxDefinition[] = payload.tax.enabled ? [{ ...scoped(companyId, now), name: payload.tax.name.trim(), kind: payload.tax.kind, rate: Number(payload.tax.rate), status: 'active' }] : [];
    const treasury: TreasuryAccount[] = payload.treasury.enabled ? [{ ...scoped(companyId, now), name: payload.treasury.name.trim(), type: payload.treasury.type, currency: company.baseCurrency, bankName: payload.treasury.bankName.trim() || undefined, accountNumber: payload.treasury.accountNumber.trim() || undefined, status: 'active' }] : [];
    const warehouses: Warehouse[] = payload.warehouse.enabled ? [{ ...scoped(companyId, now), code: payload.warehouse.code.trim().toUpperCase(), name: payload.warehouse.name.trim(), type: payload.warehouse.type, status: 'active' }] : [];
    const projects: TrialProject[] = payload.project.enabled ? [{ ...scoped(companyId, now), code: payload.project.code.trim().toUpperCase(), name: payload.project.name.trim(), status: 'active' }] : [];
    const audit: AuditEvent = { ...scoped(companyId, now), action: 'setup.completed', entityType: 'company', entityId: companyId, summary: 'اكتملت تهيئة الأساس المحلي للشركة' };

    await db.transaction('rw', [db.companies, db.fiscalYears, db.accountingPeriods, db.taxes, db.treasuryAccounts, db.warehouses, db.projects, db.localProfiles, db.appSettings, db.auditEvents, db.setupDrafts], async () => {
      await db.companies.add(company);
      await db.fiscalYears.add(fiscalYear);
      await db.accountingPeriods.bulkAdd(periods);
      if (taxes.length) await db.taxes.bulkAdd(taxes);
      if (treasury.length) await db.treasuryAccounts.bulkAdd(treasury);
      if (warehouses.length) await db.warehouses.bulkAdd(warehouses);
      if (projects.length) await db.projects.bulkAdd(projects);
      if (payload.profile.enabled && payload.profile.displayName.trim()) await db.localProfiles.add({ id: crypto.randomUUID(), displayName: payload.profile.displayName.trim(), roleLabel: payload.profile.roleLabel.trim() || 'مستخدم محلي تجريبي', createdAt: now, updatedAt: now });
      await db.appSettings.put({ key: 'activeCompanyId', value: companyId });
      await db.auditEvents.add(audit);
      await db.setupDrafts.delete('first-run');
    });
    return companyId;
  }

  async getSnapshot(companyId: string): Promise<FoundationSnapshot | undefined> {
    const db = getDatabase();
    const company = await db.companies.get(companyId);
    if (!company) return undefined;
    const [branches, fiscalYears, periods, taxes, treasuryAccounts, warehouses, projects] = await Promise.all([
      db.branches.where('companyId').equals(companyId).toArray(), db.fiscalYears.where('companyId').equals(companyId).toArray(),
      db.accountingPeriods.where('companyId').equals(companyId).toArray(), db.taxes.where('companyId').equals(companyId).toArray(),
      db.treasuryAccounts.where('companyId').equals(companyId).toArray(), db.warehouses.where('companyId').equals(companyId).toArray(), db.projects.where('companyId').equals(companyId).toArray(),
    ]);
    return { company, branches, fiscalYears, periods, taxes, treasuryAccounts, warehouses, projects };
  }

  async getActiveCompanyId() { return (await getDatabase().appSettings.get('activeCompanyId'))?.value; }
  async setActiveCompanyId(companyId: string) { await getDatabase().appSettings.put({ key: 'activeCompanyId', value: companyId }); }
  async saveDraft(draft: SetupDraft) { await getDatabase().setupDrafts.put(draft); }
  async getDraft() { return getDatabase().setupDrafts.get('first-run'); }
  async clearDraft() { await getDatabase().setupDrafts.delete('first-run'); }
}

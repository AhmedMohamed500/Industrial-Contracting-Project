import Dexie, { type EntityTable } from 'dexie';
import type { AccountingPeriod, AppSetting, AuditEvent, Branch, Company, FiscalYear, LocalProfile, SetupDraft, TaxDefinition, TreasuryAccount, TrialProject, Warehouse } from '../../domain/foundation';

export class ErpLocalDatabase extends Dexie {
  companies!: EntityTable<Company, 'id'>;
  branches!: EntityTable<Branch, 'id'>;
  fiscalYears!: EntityTable<FiscalYear, 'id'>;
  accountingPeriods!: EntityTable<AccountingPeriod, 'id'>;
  taxes!: EntityTable<TaxDefinition, 'id'>;
  treasuryAccounts!: EntityTable<TreasuryAccount, 'id'>;
  warehouses!: EntityTable<Warehouse, 'id'>;
  projects!: EntityTable<TrialProject, 'id'>;
  localProfiles!: EntityTable<LocalProfile, 'id'>;
  setupDrafts!: EntityTable<SetupDraft, 'id'>;
  appSettings!: EntityTable<AppSetting, 'key'>;
  auditEvents!: EntityTable<AuditEvent, 'id'>;

  constructor() {
    super('industrial-contracting-erp');
    this.version(1).stores({
      companies: 'id, &code, status, createdAt',
      branches: 'id, companyId, [companyId+code], status',
      fiscalYears: 'id, companyId, [companyId+startDate], status',
      accountingPeriods: 'id, companyId, fiscalYearId, [companyId+startDate], status',
      taxes: 'id, companyId, kind, status',
      treasuryAccounts: 'id, companyId, type, status',
      warehouses: 'id, companyId, [companyId+code], type, status',
      projects: 'id, companyId, [companyId+code], status',
      localProfiles: 'id, displayName',
      setupDrafts: 'id, updatedAt',
      appSettings: 'key',
      auditEvents: 'id, companyId, entityType, entityId, createdAt',
    });
  }
}

let database: ErpLocalDatabase | undefined;

export function getDatabase(): ErpLocalDatabase {
  if (typeof window === 'undefined' && typeof indexedDB === 'undefined') throw new Error('IndexedDB is available in the browser only.');
  database ??= new ErpLocalDatabase();
  return database;
}

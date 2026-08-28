export const SCHEMA_VERSION = 4;
export const APP_VERSION = '0.4.0';

export type EntityStatus = 'active' | 'inactive';
export type FiscalYearStatus = 'open' | 'soft_closed' | 'closed';
export type PeriodStatus = 'open' | 'closed';
export type TreasuryType = 'cashbox' | 'bank';
export type WarehouseType = 'main' | 'site' | 'project';

export interface BaseEntity {
  id: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  code: string;
  arabicName: string;
  englishName?: string;
  taxRegistrationNumber?: string;
  commercialRegistration?: string;
  country: string;
  baseCurrency: string;
  address?: string;
  phone?: string;
  email?: string;
  logoDataUrl?: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Branch extends BaseEntity {
  code: string;
  name: string;
  address?: string;
  manager?: string;
  status: EntityStatus;
}

export interface FiscalYear extends BaseEntity {
  name: string;
  startDate: string;
  endDate: string;
  status: FiscalYearStatus;
}

export interface AccountingPeriod extends BaseEntity {
  fiscalYearId: string;
  name: string;
  startDate: string;
  endDate: string;
  status: PeriodStatus;
}

export interface TaxDefinition extends BaseEntity {
  name: string;
  kind: 'vat' | 'withholding' | 'other';
  rate: number;
  status: EntityStatus;
}

export interface TreasuryAccount extends BaseEntity {
  name: string;
  type: TreasuryType;
  currency: string;
  bankName?: string;
  accountNumber?: string;
  status: EntityStatus;
}

export interface Warehouse extends BaseEntity {
  code: string;
  name: string;
  type: WarehouseType;
  projectId?: string;
  status: EntityStatus;
}

export interface TrialProject extends BaseEntity {
  code: string;
  name: string;
  status: EntityStatus;
}

export interface LocalProfile {
  id: string;
  displayName: string;
  roleLabel: string;
  createdAt: string;
  updatedAt: string;
}

export interface SetupDraft {
  id: 'first-run';
  currentStep: number;
  payload: SetupPayload;
  updatedAt: string;
}

export interface AppSetting {
  key: string;
  value: string;
}

export interface AuditEvent extends BaseEntity {
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
}

export interface SetupPayload {
  company: {
    arabicName: string;
    englishName: string;
    code: string;
    taxRegistrationNumber: string;
    commercialRegistration: string;
    country: string;
    baseCurrency: string;
    address: string;
    phone: string;
    email: string;
  };
  fiscalYear: { name: string; startDate: string; endDate: string };
  chartMode: 'manual' | 'template';
  chartTemplateConfirmed: boolean;
  mappingAcknowledged: boolean;
  tax: { enabled: boolean; name: string; kind: TaxDefinition['kind']; rate: string };
  treasury: { enabled: boolean; name: string; type: TreasuryType; bankName: string; accountNumber: string };
  warehouse: { enabled: boolean; code: string; name: string; type: WarehouseType };
  project: { enabled: boolean; code: string; name: string };
  profile: { enabled: boolean; displayName: string; roleLabel: string };
}

export interface FoundationSnapshot {
  company: Company;
  branches: Branch[];
  fiscalYears: FiscalYear[];
  periods: AccountingPeriod[];
  taxes: TaxDefinition[];
  treasuryAccounts: TreasuryAccount[];
  warehouses: Warehouse[];
  projects: TrialProject[];
}

export interface BackupEnvelope {
  schemaVersion: number;
  appVersion: string;
  createdAt: string;
  data: Record<string, unknown[]>;
}

export const EMPTY_SETUP_PAYLOAD: SetupPayload = {
  company: { arabicName: '', englishName: '', code: '', taxRegistrationNumber: '', commercialRegistration: '', country: 'مصر', baseCurrency: 'EGP', address: '', phone: '', email: '' },
  fiscalYear: { name: '', startDate: '', endDate: '' },
  chartMode: 'manual',
  chartTemplateConfirmed: false,
  mappingAcknowledged: false,
  tax: { enabled: false, name: '', kind: 'vat', rate: '' },
  treasury: { enabled: false, name: '', type: 'cashbox', bankName: '', accountNumber: '' },
  warehouse: { enabled: false, code: '', name: '', type: 'main' },
  project: { enabled: false, code: '', name: '' },
  profile: { enabled: false, displayName: '', roleLabel: '' },
};

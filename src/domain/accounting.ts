import type { BaseEntity, EntityStatus } from './foundation';

export type AccountCategory = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
export type NormalBalance = 'debit' | 'credit';
export type JournalStatus = 'draft' | 'approved' | 'posted' | 'reversed' | 'cancelled';
export type JournalSourceType = 'manual' | 'opening_balance' | 'adjustment' | 'reversal' | 'system';

export const ACCOUNTING_MAPPING_KEYS = [
  'ar', 'ap', 'inventory', 'site_inventory', 'grni', 'vat_input', 'vat_output',
  'revenue', 'supply_revenue', 'material_cost', 'labor_cost', 'equipment_cost',
  'subcontractor_cost', 'supply_cost', 'cash', 'bank', 'retention', 'advances',
  'accruals', 'prepayments', 'fixed_assets', 'depreciation', 'retained_earnings',
] as const;

export type AccountingMappingKey = typeof ACCOUNTING_MAPPING_KEYS[number];

export const ACCOUNTING_MAPPING_LABELS: Record<AccountingMappingKey, string> = {
  ar: 'العملاء (AR)', ap: 'الموردون (AP)', inventory: 'المخزون', site_inventory: 'مخزون المواقع',
  grni: 'بضاعة مستلمة غير مفوترة (GRNI)', vat_input: 'ضريبة مدخلات', vat_output: 'ضريبة مخرجات',
  revenue: 'الإيرادات', supply_revenue: 'إيرادات التوريدات', material_cost: 'تكلفة الخامات',
  labor_cost: 'تكلفة العمالة', equipment_cost: 'تكلفة المعدات', subcontractor_cost: 'تكلفة مقاولي الباطن',
  supply_cost: 'تكلفة التوريدات', cash: 'النقدية', bank: 'البنوك', retention: 'الاحتجازات',
  advances: 'الدفعات المقدمة', accruals: 'المستحقات', prepayments: 'المصروفات المقدمة',
  fixed_assets: 'الأصول الثابتة', depreciation: 'الإهلاك', retained_earnings: 'الأرباح المحتجزة',
};

export interface Account extends BaseEntity {
  code: string;
  arabicName: string;
  englishName?: string;
  parentId?: string;
  category: AccountCategory;
  normalBalance: NormalBalance;
  isPosting: boolean;
  projectRequired: boolean;
  costCenterRequired: boolean;
  costCodeRequired: boolean;
  currency?: string;
  status: EntityStatus;
}

export interface AccountingMapping extends BaseEntity {
  key: AccountingMappingKey;
  accountId: string;
}

export interface JournalEntry extends BaseEntity {
  number: string;
  date: string;
  periodId: string;
  description: string;
  sourceType: JournalSourceType;
  sourceId?: string;
  status: JournalStatus;
  approvedAt?: string;
  postedAt?: string;
  reversedAt?: string;
  reversalJournalId?: string;
}

export interface JournalLine extends BaseEntity {
  journalEntryId: string;
  lineNumber: number;
  accountId: string;
  description?: string;
  debit: number;
  credit: number;
  projectId?: string;
  costCenterId?: string;
  costCodeId?: string;
  partyType?: 'client' | 'supplier' | 'subcontractor';
  partyId?: string;
}

export interface JournalDraft {
  id?: string;
  companyId: string;
  date: string;
  description: string;
  sourceType: JournalSourceType;
  sourceId?: string;
  lines: Array<Omit<JournalLine, keyof BaseEntity | 'journalEntryId' | 'lineNumber'>>;
}

export interface JournalWithLines {
  entry: JournalEntry;
  lines: JournalLine[];
}

export interface LedgerRow {
  journalId: string;
  journalNumber: string;
  date: string;
  description: string;
  sourceType: JournalSourceType;
  debit: number;
  credit: number;
  runningBalance: number;
}

export interface TrialBalanceRow {
  accountId: string;
  accountCode: string;
  accountName: string;
  category: AccountCategory;
  debitMovement: number;
  creditMovement: number;
  debitBalance: number;
  creditBalance: number;
}

export interface FinancialStatements {
  assets: TrialBalanceRow[];
  liabilities: TrialBalanceRow[];
  equity: TrialBalanceRow[];
  revenue: TrialBalanceRow[];
  expenses: TrialBalanceRow[];
  netIncome: number;
  totalAssets: number;
  totalLiabilitiesAndEquity: number;
}

export interface AccountingRepository {
  listAccounts(companyId: string): Promise<Account[]>;
  getAccount(id: string): Promise<Account | undefined>;
  saveAccount(input: Omit<Account, keyof BaseEntity | 'normalBalance'> & { id?: string; companyId: string }): Promise<Account>;
  setAccountStatus(id: string, status: EntityStatus): Promise<void>;
  codeExists(companyId: string, code: string, excludingId?: string): Promise<boolean>;
  createContractingTemplate(companyId: string, currency: string): Promise<Account[]>;
  listMappings(companyId: string): Promise<AccountingMapping[]>;
  saveMappings(companyId: string, values: Partial<Record<AccountingMappingKey, string>>): Promise<void>;
  saveJournal(draft: JournalDraft): Promise<JournalWithLines>;
  getJournal(id: string): Promise<JournalWithLines | undefined>;
  listJournals(companyId: string): Promise<JournalWithLines[]>;
  approveJournal(id: string): Promise<void>;
  postJournal(id: string): Promise<void>;
  reverseJournal(id: string, date: string, description?: string): Promise<string>;
  cancelJournal(id: string): Promise<void>;
  getLedger(companyId: string, accountId: string, from?: string, to?: string): Promise<LedgerRow[]>;
  getTrialBalance(companyId: string, from?: string, to?: string): Promise<TrialBalanceRow[]>;
}

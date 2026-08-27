import type { Branch, Company, FoundationSnapshot, SetupDraft, SetupPayload } from './foundation';

export interface CompanyRepository {
  list(): Promise<Company[]>;
  get(id: string): Promise<Company | undefined>;
  update(company: Company): Promise<void>;
  codeExists(code: string, excludingId?: string): Promise<boolean>;
}

export interface BranchRepository {
  list(companyId: string): Promise<Branch[]>;
  create(input: Omit<Branch, 'id' | 'createdAt' | 'updatedAt'>): Promise<Branch>;
}

export interface FoundationRepository {
  completeSetup(payload: SetupPayload): Promise<string>;
  getSnapshot(companyId: string): Promise<FoundationSnapshot | undefined>;
  getActiveCompanyId(): Promise<string | undefined>;
  setActiveCompanyId(companyId: string): Promise<void>;
  saveDraft(draft: SetupDraft): Promise<void>;
  getDraft(): Promise<SetupDraft | undefined>;
  clearDraft(): Promise<void>;
}

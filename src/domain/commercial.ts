import type { BaseEntity, EntityStatus, TrialProject } from './foundation';
import type { ContractType, PlannedCostType } from './planned-operations';

export type PartyType = 'client' | 'supplier' | 'subcontractor';
export type CommercialStatus = 'draft' | 'active' | 'on_hold' | 'closed' | 'cancelled';
export type TenderStatus = 'draft' | 'pricing' | 'submitted' | 'won' | 'lost';
export type VariationStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled';

export interface BusinessParty extends BaseEntity {
  type: PartyType;
  code: string;
  arabicName: string;
  englishName?: string;
  taxRegistrationNumber?: string;
  commercialRegistration?: string;
  phone?: string;
  email?: string;
  address?: string;
  paymentTermsDays: number;
  creditLimit?: number;
  status: EntityStatus;
}

export interface ProjectRecord extends TrialProject {
  clientId?: string;
  contractType?: ContractType;
  manager?: string;
  startDate?: string;
  endDate?: string;
  originalContractValue?: number;
  retentionRate?: number;
  advanceRate?: number;
  warehouseId?: string;
  costCenterId?: string;
  physicalProgress?: number;
  lifecycleStatus?: CommercialStatus;
}

export interface Contract extends BaseEntity {
  projectId: string;
  clientId: string;
  number: string;
  title: string;
  type: ContractType;
  currency: string;
  originalValue: number;
  approvedVariations: number;
  revisedValue: number;
  paymentTerms?: string;
  retentionRate: number;
  advanceRate: number;
  startDate: string;
  endDate?: string;
  status: CommercialStatus;
}

export interface BOQItem extends BaseEntity {
  projectId: string;
  contractId: string;
  parentId?: string;
  code: string;
  description: string;
  unit: string;
  quantity: number;
  sellingRate: number;
  budgetCost: number;
  costCodeId?: string;
  workPackage?: string;
  status: 'draft' | 'active';
}

export interface ProjectBudgetLine extends BaseEntity {
  projectId: string;
  boqItemId?: string;
  category: PlannedCostType | 'freight' | 'inspection' | 'testing' | 'engineering' | 'other_direct_cost';
  versionType: 'original' | 'baseline' | 'revision' | 'forecast';
  revisionNumber: number;
  description: string;
  amount: number;
  status: 'draft' | 'approved';
}

export interface CostDimension extends BaseEntity {
  kind: 'cost_center' | 'cost_code';
  code: string;
  name: string;
  parentId?: string;
  status: EntityStatus;
}

export interface Tender extends BaseEntity {
  number: string;
  title: string;
  clientId?: string;
  contractType: ContractType;
  estimatedRevenue: number;
  estimatedCost: number;
  submissionDate?: string;
  status: TenderStatus;
  convertedProjectId?: string;
  convertedContractId?: string;
}

export interface Variation extends BaseEntity {
  projectId: string;
  contractId: string;
  number: string;
  title: string;
  description?: string;
  revenueImpact: number;
  costImpact: number;
  budgetImpact: number;
  timeImpactDays: number;
  status: VariationStatus;
}

export interface CommercialRepository {
  listParties(companyId: string, type?: PartyType): Promise<BusinessParty[]>;
  saveParty(input: Omit<BusinessParty, keyof BaseEntity> & { id?: string; companyId: string }): Promise<BusinessParty>;
  listProjects(companyId: string): Promise<ProjectRecord[]>;
  saveProject(input: Omit<ProjectRecord, keyof BaseEntity> & { id?: string; companyId: string }): Promise<ProjectRecord>;
  listContracts(companyId: string, projectId?: string): Promise<Contract[]>;
  saveContract(input: Omit<Contract, keyof BaseEntity | 'revisedValue'> & { id?: string; companyId: string }): Promise<Contract>;
  listBOQ(companyId: string, projectId?: string): Promise<BOQItem[]>;
  saveBOQItem(input: Omit<BOQItem, keyof BaseEntity> & { id?: string; companyId: string }): Promise<BOQItem>;
  removeDraftBOQItem(id: string): Promise<void>;
  listBudget(companyId: string, projectId?: string): Promise<ProjectBudgetLine[]>;
  saveBudgetLine(input: Omit<ProjectBudgetLine, keyof BaseEntity> & { id?: string; companyId: string }): Promise<ProjectBudgetLine>;
  listDimensions(companyId: string, kind?: CostDimension['kind']): Promise<CostDimension[]>;
  saveDimension(input: Omit<CostDimension, keyof BaseEntity> & { id?: string; companyId: string }): Promise<CostDimension>;
  listTenders(companyId: string): Promise<Tender[]>;
  saveTender(input: Omit<Tender, keyof BaseEntity> & { id?: string; companyId: string }): Promise<Tender>;
  convertWonTender(id: string): Promise<{projectId:string;contractId:string}>;
  listVariations(companyId: string, projectId?: string): Promise<Variation[]>;
  saveVariation(input: Omit<Variation, keyof BaseEntity> & { id?: string; companyId: string }): Promise<Variation>;
}

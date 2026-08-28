import type { BaseEntity } from './foundation';

export type ProcurementStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled' | 'closed';

export interface SupplyPlan extends BaseEntity {
  projectId: string;
  contractId: string;
  number: string;
  revision: number;
  baselineDate: string;
  notes?: string;
  status: ProcurementStatus;
}

export interface MaterialRequirement extends BaseEntity {
  supplyPlanId: string;
  projectId: string;
  boqItemId?: string;
  code: string;
  description: string;
  unit: string;
  requiredQuantity: number;
  requiredBy: string;
  source: 'client_schedule' | 'project_plan' | 'shortage' | 'approved_change';
  status: ProcurementStatus;
}

export interface PurchaseRequisition extends BaseEntity {
  number: string;
  projectId: string;
  requirementId?: string;
  description: string;
  unit: string;
  quantity: number;
  requiredBy: string;
  status: ProcurementStatus;
}

export interface RequestForQuotation extends BaseEntity {
  number: string;
  requisitionId: string;
  supplierIds: string[];
  closingDate: string;
  status: ProcurementStatus;
}

export interface SupplierQuote extends BaseEntity {
  rfqId: string;
  supplierId: string;
  quoteNumber: string;
  quantity: number;
  unitPrice: number;
  freight: number;
  leadTimeDays: number;
  validUntil?: string;
  selected: boolean;
}

export interface PurchaseOrder extends BaseEntity {
  number: string;
  projectId: string;
  requisitionId: string;
  quoteId: string;
  supplierId: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  freight: number;
  orderedValue: number;
  expectedDate: string;
  status: 'draft' | 'approved' | 'cancelled' | 'closed';
}

export interface ProcurementRepository {
  listSupplyPlans(companyId: string): Promise<SupplyPlan[]>;
  saveSupplyPlan(input: Omit<SupplyPlan, keyof BaseEntity> & { id?: string; companyId: string }): Promise<SupplyPlan>;
  listRequirements(companyId: string): Promise<MaterialRequirement[]>;
  saveRequirement(input: Omit<MaterialRequirement, keyof BaseEntity> & { id?: string; companyId: string }): Promise<MaterialRequirement>;
  listRequisitions(companyId: string): Promise<PurchaseRequisition[]>;
  saveRequisition(input: Omit<PurchaseRequisition, keyof BaseEntity> & { id?: string; companyId: string }): Promise<PurchaseRequisition>;
  setRequisitionStatus(id: string, status: PurchaseRequisition['status']): Promise<void>;
  listRFQs(companyId: string): Promise<RequestForQuotation[]>;
  saveRFQ(input: Omit<RequestForQuotation, keyof BaseEntity> & { id?: string; companyId: string }): Promise<RequestForQuotation>;
  listQuotes(companyId: string): Promise<SupplierQuote[]>;
  saveQuote(input: Omit<SupplierQuote, keyof BaseEntity> & { id?: string; companyId: string }): Promise<SupplierQuote>;
  selectQuoteAndCreatePO(quoteId: string, poNumber: string, expectedDate: string): Promise<PurchaseOrder>;
  listPurchaseOrders(companyId: string): Promise<PurchaseOrder[]>;
  setPurchaseOrderStatus(id: string, status: PurchaseOrder['status']): Promise<void>;
}

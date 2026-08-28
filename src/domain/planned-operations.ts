/**
 * Planned operational architecture for post-foundation phases.
 *
 * These contracts are intentionally storage-agnostic. They document the future
 * domain and repository boundaries, but are NOT wired to Dexie schema v1 and do
 * not imply that any operational screen or posting workflow is implemented.
 */

export type PlannedRecordStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled' | 'closed';
export type QuantityStage = 'contracted' | 'scheduled' | 'required' | 'ordered' | 'purchased' | 'in_transit' | 'received' | 'delivered' | 'accepted' | 'invoiced' | 'collected' | 'returned';
export type ContractType = 'industrial_contracting' | 'supply_only' | 'supply_and_installation' | 'maintenance' | 'service_contract';
export type DeliveryScenario = 'via_main_warehouse' | 'via_project_warehouse' | 'direct_to_client';
export type PlannedCostType = 'material' | 'labor' | 'equipment' | 'subcontract' | 'service' | 'transport' | 'mobilization' | 'demobilization' | 'site_overhead' | 'company_overhead' | 'warranty' | 'other';

export interface PlannedEntity {
  id: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContractProfile extends PlannedEntity {
  projectId: string;
  clientId: string;
  contractNumber: string;
  type: ContractType;
  currency: string;
  originalValue: number;
  approvedVariationValue: number;
  startDate: string;
  plannedCompletionDate: string;
  status: PlannedRecordStatus;
}

export interface SupplyContract extends ContractProfile {
  type: 'supply_only' | 'supply_and_installation';
  deliveryTerms?: string;
  acceptanceTerms?: string;
  invoicingBasis: 'delivery' | 'acceptance' | 'milestone';
}

export interface SupplyBOQItem extends PlannedEntity {
  supplyContractId: string;
  boqCode: string;
  itemId?: string;
  description: string;
  unit: string;
  contractedQuantity: number;
  unitPrice: number;
  taxCodeId?: string;
}

export interface SupplySchedule extends PlannedEntity {
  supplyContractId: string;
  revision: number;
  baselineDate: string;
  status: PlannedRecordStatus;
}

export interface SupplyLot extends PlannedEntity {
  supplyScheduleId: string;
  supplyBOQItemId: string;
  lotNumber: string;
  plannedQuantity: number;
  plannedDeliveryDate: string;
  deliveryLocationType: 'main_warehouse' | 'project_warehouse' | 'client_site';
  deliveryLocationId?: string;
  status: PlannedRecordStatus;
}

export interface SupplyRequirement extends PlannedEntity {
  supplyContractId: string;
  supplyLotId?: string;
  supplyBOQItemId: string;
  requiredQuantity: number;
  requiredBy: string;
  source: 'client_schedule' | 'project_plan' | 'shortage' | 'approved_change';
  status: PlannedRecordStatus;
}

export interface SupplyDelivery extends PlannedEntity {
  supplyContractId: string;
  deliveryNumber: string;
  scenario: DeliveryScenario;
  supplierId: string;
  purchaseOrderId?: string;
  originWarehouseId?: string;
  destinationWarehouseId?: string;
  clientSiteId?: string;
  deliveredAt: string;
  status: PlannedRecordStatus;
}

export interface SupplyDeliveryLine extends PlannedEntity {
  supplyDeliveryId: string;
  supplyBOQItemId: string;
  purchaseOrderLineId?: string;
  deliveredQuantity: number;
  unit: string;
  batchNumber?: string;
  serialNumbers?: string[];
}

export interface SupplyInspection extends PlannedEntity {
  supplyDeliveryId: string;
  inspectionNumber: string;
  inspectedAt: string;
  acceptedQuantity: number;
  rejectedQuantity: number;
  result: 'accepted' | 'accepted_with_notes' | 'rejected';
  notes?: string;
  status: PlannedRecordStatus;
}

export interface SupplyReturn extends PlannedEntity {
  supplyDeliveryId: string;
  supplyDeliveryLineId: string;
  returnNumber: string;
  quantity: number;
  reason: string;
  destination: 'supplier' | 'main_warehouse' | 'project_warehouse';
  status: PlannedRecordStatus;
}

export interface SupplyCostAllocation extends PlannedEntity {
  supplyContractId: string;
  supplyBOQItemId?: string;
  sourceDocumentType: string;
  sourceDocumentId: string;
  costType: PlannedCostType;
  amount: number;
  currency: string;
  allocationBasis: 'direct' | 'quantity' | 'value' | 'weight' | 'manual';
}

export interface SupplyQuantityPosition {
  supplyBOQItemId: string;
  contracted: number;
  scheduled: number;
  required: number;
  ordered: number;
  purchased: number;
  inTransit: number;
  received: number;
  delivered: number;
  accepted: number;
  invoiced: number;
  collected: number;
  returned: number;
  remaining: number;
}

export interface ServiceOrder extends PlannedEntity {
  contractId: string;
  orderNumber: string;
  serviceLocationId?: string;
  requestedAt: string;
  scheduledAt?: string;
  completedAt?: string;
  status: PlannedRecordStatus;
}

export interface SiteMaterialRequest extends PlannedEntity { projectId: string; requestNumber: string; requiredBy: string; status: PlannedRecordStatus; }
export interface MaterialReservation extends PlannedEntity { projectId: string; warehouseId: string; itemId: string; quantity: number; sourceRequestId: string; status: PlannedRecordStatus; }
export interface DirectSiteReceiving extends PlannedEntity { projectId: string; supplierId: string; purchaseOrderId: string; receivedAt: string; status: PlannedRecordStatus; }
export interface PurchaseReturn extends PlannedEntity { supplierId: string; receiptId: string; returnNumber: string; reason: string; status: PlannedRecordStatus; }
export interface CommercialAdjustmentNote extends PlannedEntity { partyId: string; kind: 'credit' | 'debit'; sourceDocumentId: string; amount: number; status: PlannedRecordStatus; }
export interface MethodStatement extends PlannedEntity { projectId: string; documentNumber: string; revision: number; approvalStatus: PlannedRecordStatus; }
export interface MobilizationRecord extends PlannedEntity { projectId: string; kind: 'mobilization' | 'demobilization'; date: string; costAmount: number; }
export interface OverheadAllocation extends PlannedEntity { projectId?: string; costType: 'site_overhead' | 'company_overhead'; periodId: string; amount: number; basis: string; }
export interface InterProjectTransfer extends PlannedEntity { fromProjectId: string; toProjectId: string; sourceDocumentId: string; amount: number; status: PlannedRecordStatus; }
export interface IntercompanyTransaction extends PlannedEntity { counterpartyCompanyId: string; sourceDocumentId: string; amount: number; currency: string; status: PlannedRecordStatus; }
export interface ProjectCloseout extends PlannedEntity { projectId: string; practicalCompletionDate?: string; finalHandoverDate?: string; defectsLiabilityEndDate?: string; status: PlannedRecordStatus; }
export interface RetentionRelease extends PlannedEntity { contractId: string; certificateId?: string; releaseDate: string; amount: number; status: PlannedRecordStatus; }
export interface GuaranteeRelease extends PlannedEntity { contractId: string; guaranteeId: string; releaseDate: string; amount: number; status: PlannedRecordStatus; }
export interface SupplierPerformanceReview extends PlannedEntity { supplierId: string; periodStart: string; periodEnd: string; onTimeScore: number; qualityScore: number; commercialScore: number; }
export interface CashForecastEntry extends PlannedEntity { projectId?: string; expectedDate: string; direction: 'inflow' | 'outflow'; sourceDocumentType: string; sourceDocumentId: string; amount: number; confidencePercent: number; }
export interface BudgetRevision extends PlannedEntity { projectId: string; revisionNumber: number; reason: string; effectiveDate: string; status: PlannedRecordStatus; }
export interface ChangeControl extends PlannedEntity { projectId: string; changeNumber: string; impactCost: number; impactDays: number; status: PlannedRecordStatus; }
export interface DocumentRecord extends PlannedEntity { entityType: string; entityId: string; category: string; name: string; version: number; storageReference: string; }

export interface PlannedSupplyRepository {
  getContract(id: string): Promise<SupplyContract | undefined>;
  listBOQ(contractId: string): Promise<SupplyBOQItem[]>;
  listSchedules(contractId: string): Promise<SupplySchedule[]>;
  listLots(scheduleId: string): Promise<SupplyLot[]>;
  listRequirements(contractId: string): Promise<SupplyRequirement[]>;
  listDeliveries(contractId: string): Promise<SupplyDelivery[]>;
  getQuantityPosition(contractId: string): Promise<SupplyQuantityPosition[]>;
}

export interface PlannedForecastRepository {
  listCashForecast(companyId: string, from: string, to: string): Promise<CashForecastEntry[]>;
  listSupplierPerformance(companyId: string): Promise<SupplierPerformanceReview[]>;
}

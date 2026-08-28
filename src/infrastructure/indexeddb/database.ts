import Dexie, { type EntityTable } from 'dexie';
import type { AccountingPeriod, AppSetting, AuditEvent, Branch, Company, FiscalYear, LocalProfile, SetupDraft, TaxDefinition, TreasuryAccount, Warehouse } from '../../domain/foundation';
import type { Account, AccountingMapping, JournalEntry, JournalLine } from '../../domain/accounting';
import type { BOQItem, BusinessParty, Contract, CostDimension, ProjectBudgetLine, ProjectRecord, Tender, Variation } from '../../domain/commercial';
import type { MaterialRequirement, PurchaseOrder, PurchaseRequisition, RequestForQuotation, SupplierQuote, SupplyPlan } from '../../domain/procurement';
import type { ClientDelivery, DeliveryInspection, GoodsReceipt, InventoryItem, PurchaseReturnRecord, StockMovement } from '../../domain/inventory';
import type { CashTransaction, ClientInvoice, SubcontractCertificate, SupplierInvoice } from '../../domain/finance';
import type { CashForecast, ProjectCloseoutRecord, SupplierReview } from '../../domain/reporting';
import type { MaterialIssue, SiteMaterialRequestRecord, StockAdjustment, StockCount, StockReservation, UnitDefinition, WarehouseTransfer } from '../../domain/inventory-operations';
import type { CommercialNote, ServiceOrderRecord, SupplyLotRecord } from '../../domain/supply-control';
import type { ClientIPC, ClientIPCLine, HandoverRecord, MaterialsOnSiteRecord, RetentionReleaseRecord, SubcontractRecord } from '../../domain/execution';
import type { BankGuaranteeRecord, DepreciationRun, EquipmentRecord, EquipmentUsage, ExpenseRecord, FixedAssetRecord, TimesheetRecord } from '../../domain/resources';
import type { BankReconciliation, BankStatementLine, BankTransfer, ChequeRecord, PettyCashFund, PettyCashTransaction } from '../../domain/banking';

export class ErpLocalDatabase extends Dexie {
  companies!: EntityTable<Company, 'id'>;
  branches!: EntityTable<Branch, 'id'>;
  fiscalYears!: EntityTable<FiscalYear, 'id'>;
  accountingPeriods!: EntityTable<AccountingPeriod, 'id'>;
  taxes!: EntityTable<TaxDefinition, 'id'>;
  treasuryAccounts!: EntityTable<TreasuryAccount, 'id'>;
  warehouses!: EntityTable<Warehouse, 'id'>;
  projects!: EntityTable<ProjectRecord, 'id'>;
  localProfiles!: EntityTable<LocalProfile, 'id'>;
  setupDrafts!: EntityTable<SetupDraft, 'id'>;
  appSettings!: EntityTable<AppSetting, 'key'>;
  auditEvents!: EntityTable<AuditEvent, 'id'>;
  accounts!: EntityTable<Account, 'id'>;
  accountingMappings!: EntityTable<AccountingMapping, 'id'>;
  journalEntries!: EntityTable<JournalEntry, 'id'>;
  journalLines!: EntityTable<JournalLine, 'id'>;
  parties!: EntityTable<BusinessParty, 'id'>;
  contracts!: EntityTable<Contract, 'id'>;
  boqItems!: EntityTable<BOQItem, 'id'>;
  projectBudgetLines!: EntityTable<ProjectBudgetLine, 'id'>;
  costDimensions!: EntityTable<CostDimension, 'id'>;
  tenders!: EntityTable<Tender, 'id'>;
  variations!: EntityTable<Variation, 'id'>;
  supplyPlans!: EntityTable<SupplyPlan, 'id'>;
  materialRequirements!: EntityTable<MaterialRequirement, 'id'>;
  purchaseRequisitions!: EntityTable<PurchaseRequisition, 'id'>;
  rfqs!: EntityTable<RequestForQuotation, 'id'>;
  supplierQuotes!: EntityTable<SupplierQuote, 'id'>;
  purchaseOrders!: EntityTable<PurchaseOrder, 'id'>;
  inventoryItems!: EntityTable<InventoryItem, 'id'>;
  goodsReceipts!: EntityTable<GoodsReceipt, 'id'>;
  stockMovements!: EntityTable<StockMovement, 'id'>;
  clientDeliveries!: EntityTable<ClientDelivery, 'id'>;
  deliveryInspections!: EntityTable<DeliveryInspection, 'id'>;
  purchaseReturns!: EntityTable<PurchaseReturnRecord, 'id'>;
  clientInvoices!: EntityTable<ClientInvoice, 'id'>;
  supplierInvoices!: EntityTable<SupplierInvoice, 'id'>;
  subcontractCertificates!: EntityTable<SubcontractCertificate, 'id'>;
  cashTransactions!: EntityTable<CashTransaction, 'id'>;
  cashForecasts!: EntityTable<CashForecast, 'id'>;
  supplierReviews!: EntityTable<SupplierReview, 'id'>;
  projectCloseouts!: EntityTable<ProjectCloseoutRecord, 'id'>;
  units!: EntityTable<UnitDefinition, 'id'>;
  siteMaterialRequests!: EntityTable<SiteMaterialRequestRecord, 'id'>;
  stockReservations!: EntityTable<StockReservation, 'id'>;
  warehouseTransfers!: EntityTable<WarehouseTransfer, 'id'>;
  materialIssues!: EntityTable<MaterialIssue, 'id'>;
  stockAdjustments!: EntityTable<StockAdjustment, 'id'>;
  stockCounts!: EntityTable<StockCount, 'id'>;
  supplyLots!: EntityTable<SupplyLotRecord, 'id'>;
  serviceOrders!: EntityTable<ServiceOrderRecord, 'id'>;
  commercialNotes!: EntityTable<CommercialNote, 'id'>;
  subcontracts!: EntityTable<SubcontractRecord, 'id'>;
  clientIPCs!: EntityTable<ClientIPC, 'id'>;
  clientIPCLines!: EntityTable<ClientIPCLine, 'id'>;
  materialsOnSite!: EntityTable<MaterialsOnSiteRecord, 'id'>;
  handovers!: EntityTable<HandoverRecord, 'id'>;
  retentionReleases!: EntityTable<RetentionReleaseRecord, 'id'>;
  expenses!: EntityTable<ExpenseRecord, 'id'>;
  timesheets!: EntityTable<TimesheetRecord, 'id'>;
  equipment!: EntityTable<EquipmentRecord, 'id'>;
  equipmentUsage!: EntityTable<EquipmentUsage, 'id'>;
  fixedAssets!: EntityTable<FixedAssetRecord, 'id'>;
  depreciationRuns!: EntityTable<DepreciationRun, 'id'>;
  bankGuarantees!: EntityTable<BankGuaranteeRecord, 'id'>;
  bankTransfers!: EntityTable<BankTransfer, 'id'>;
  cheques!: EntityTable<ChequeRecord, 'id'>;
  pettyCashFunds!: EntityTable<PettyCashFund, 'id'>;
  pettyCashTransactions!: EntityTable<PettyCashTransaction, 'id'>;
  bankStatementLines!: EntityTable<BankStatementLine, 'id'>;
  bankReconciliations!: EntityTable<BankReconciliation, 'id'>;

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
    this.version(2).stores({
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
      accounts: 'id, companyId, [companyId+code], parentId, category, status, isPosting',
      accountingMappings: 'id, companyId, [companyId+key], accountId',
      journalEntries: 'id, companyId, [companyId+number], date, periodId, status, sourceType, sourceId',
      journalLines: 'id, companyId, journalEntryId, accountId, projectId, costCenterId, costCodeId',
    });
    this.version(3).stores({
      companies: 'id, &code, status, createdAt',
      branches: 'id, companyId, [companyId+code], status',
      fiscalYears: 'id, companyId, [companyId+startDate], status',
      accountingPeriods: 'id, companyId, fiscalYearId, [companyId+startDate], status',
      taxes: 'id, companyId, kind, status',
      treasuryAccounts: 'id, companyId, type, status',
      warehouses: 'id, companyId, [companyId+code], type, status',
      projects: 'id, companyId, [companyId+code], clientId, contractType, lifecycleStatus, status',
      localProfiles: 'id, displayName',
      setupDrafts: 'id, updatedAt',
      appSettings: 'key',
      auditEvents: 'id, companyId, entityType, entityId, createdAt',
      accounts: 'id, companyId, [companyId+code], parentId, category, status, isPosting',
      accountingMappings: 'id, companyId, [companyId+key], accountId',
      journalEntries: 'id, companyId, [companyId+number], date, periodId, status, sourceType, sourceId',
      journalLines: 'id, companyId, journalEntryId, accountId, projectId, costCenterId, costCodeId',
      parties: 'id, companyId, [companyId+type+code], type, status, arabicName',
      contracts: 'id, companyId, [companyId+number], projectId, clientId, type, status',
      boqItems: 'id, companyId, [companyId+projectId+code], projectId, contractId, parentId, status',
      projectBudgetLines: 'id, companyId, projectId, boqItemId, category, versionType, status',
      costDimensions: 'id, companyId, [companyId+kind+code], kind, parentId, status',
      tenders: 'id, companyId, [companyId+number], clientId, status',
      variations: 'id, companyId, [companyId+contractId+number], projectId, contractId, status',
    });
    this.version(4).stores({
      companies: 'id, &code, status, createdAt', branches: 'id, companyId, [companyId+code], status', fiscalYears: 'id, companyId, [companyId+startDate], status', accountingPeriods: 'id, companyId, fiscalYearId, [companyId+startDate], status', taxes: 'id, companyId, kind, status', treasuryAccounts: 'id, companyId, type, status', warehouses: 'id, companyId, [companyId+code], type, status', projects: 'id, companyId, [companyId+code], clientId, contractType, lifecycleStatus, status', localProfiles: 'id, displayName', setupDrafts: 'id, updatedAt', appSettings: 'key', auditEvents: 'id, companyId, entityType, entityId, createdAt', accounts: 'id, companyId, [companyId+code], parentId, category, status, isPosting', accountingMappings: 'id, companyId, [companyId+key], accountId', journalEntries: 'id, companyId, [companyId+number], date, periodId, status, sourceType, sourceId', journalLines: 'id, companyId, journalEntryId, accountId, projectId, costCenterId, costCodeId', parties: 'id, companyId, [companyId+type+code], type, status, arabicName', contracts: 'id, companyId, [companyId+number], projectId, clientId, type, status', boqItems: 'id, companyId, [companyId+projectId+code], projectId, contractId, parentId, status', projectBudgetLines: 'id, companyId, projectId, boqItemId, category, versionType, status', costDimensions: 'id, companyId, [companyId+kind+code], kind, parentId, status', tenders: 'id, companyId, [companyId+number], clientId, status', variations: 'id, companyId, [companyId+contractId+number], projectId, contractId, status',
      supplyPlans: 'id, companyId, [companyId+number+revision], projectId, contractId, status, createdAt',
      materialRequirements: 'id, companyId, [companyId+code], supplyPlanId, projectId, boqItemId, status, requiredBy',
      purchaseRequisitions: 'id, companyId, [companyId+number], projectId, requirementId, status, createdAt',
      rfqs: 'id, companyId, [companyId+number], requisitionId, status, createdAt',
      supplierQuotes: 'id, companyId, [companyId+rfqId+supplierId], rfqId, supplierId, selected, createdAt',
      purchaseOrders: 'id, companyId, [companyId+number], projectId, requisitionId, quoteId, supplierId, status, createdAt',
    });
    this.version(5).stores({
      companies: 'id, &code, status, createdAt', branches: 'id, companyId, [companyId+code], status', fiscalYears: 'id, companyId, [companyId+startDate], status', accountingPeriods: 'id, companyId, fiscalYearId, [companyId+startDate], status', taxes: 'id, companyId, kind, status', treasuryAccounts: 'id, companyId, type, status', warehouses: 'id, companyId, [companyId+code], type, status', projects: 'id, companyId, [companyId+code], clientId, contractType, lifecycleStatus, status', localProfiles: 'id, displayName', setupDrafts: 'id, updatedAt', appSettings: 'key', auditEvents: 'id, companyId, entityType, entityId, createdAt', accounts: 'id, companyId, [companyId+code], parentId, category, status, isPosting', accountingMappings: 'id, companyId, [companyId+key], accountId', journalEntries: 'id, companyId, [companyId+number], date, periodId, status, sourceType, sourceId', journalLines: 'id, companyId, journalEntryId, accountId, projectId, costCenterId, costCodeId', parties: 'id, companyId, [companyId+type+code], type, status, arabicName', contracts: 'id, companyId, [companyId+number], projectId, clientId, type, status', boqItems: 'id, companyId, [companyId+projectId+code], projectId, contractId, parentId, status', projectBudgetLines: 'id, companyId, projectId, boqItemId, category, versionType, status', costDimensions: 'id, companyId, [companyId+kind+code], kind, parentId, status', tenders: 'id, companyId, [companyId+number], clientId, status', variations: 'id, companyId, [companyId+contractId+number], projectId, contractId, status', supplyPlans: 'id, companyId, [companyId+number+revision], projectId, contractId, status, createdAt', materialRequirements: 'id, companyId, [companyId+code], supplyPlanId, projectId, boqItemId, status, requiredBy', purchaseRequisitions: 'id, companyId, [companyId+number], projectId, requirementId, status, createdAt', rfqs: 'id, companyId, [companyId+number], requisitionId, status, createdAt', supplierQuotes: 'id, companyId, [companyId+rfqId+supplierId], rfqId, supplierId, selected, createdAt', purchaseOrders: 'id, companyId, [companyId+number], projectId, requisitionId, quoteId, supplierId, status, createdAt',
      inventoryItems: 'id, companyId, [companyId+code], status, name', goodsReceipts: 'id, companyId, [companyId+number], purchaseOrderId, projectId, supplierId, itemId, warehouseId, scenario, status, createdAt', stockMovements: 'id, companyId, [companyId+itemId+warehouseId], itemId, warehouseId, projectId, sourceType, sourceId, date', clientDeliveries: 'id, companyId, [companyId+number], receiptId, projectId, itemId, warehouseId, scenario, status, createdAt', deliveryInspections: 'id, companyId, [companyId+number], deliveryId, result, status, createdAt', purchaseReturns: 'id, companyId, [companyId+number], receiptId, itemId, warehouseId, status, createdAt',
    });
    this.version(6).stores({
      companies: 'id, &code, status, createdAt', branches: 'id, companyId, [companyId+code], status', fiscalYears: 'id, companyId, [companyId+startDate], status', accountingPeriods: 'id, companyId, fiscalYearId, [companyId+startDate], status', taxes: 'id, companyId, kind, status', treasuryAccounts: 'id, companyId, type, status', warehouses: 'id, companyId, [companyId+code], type, status', projects: 'id, companyId, [companyId+code], clientId, contractType, lifecycleStatus, status', localProfiles: 'id, displayName', setupDrafts: 'id, updatedAt', appSettings: 'key', auditEvents: 'id, companyId, entityType, entityId, createdAt', accounts: 'id, companyId, [companyId+code], parentId, category, status, isPosting', accountingMappings: 'id, companyId, [companyId+key], accountId', journalEntries: 'id, companyId, [companyId+number], date, periodId, status, sourceType, sourceId', journalLines: 'id, companyId, journalEntryId, accountId, projectId, costCenterId, costCodeId', parties: 'id, companyId, [companyId+type+code], type, status, arabicName', contracts: 'id, companyId, [companyId+number], projectId, clientId, type, status', boqItems: 'id, companyId, [companyId+projectId+code], projectId, contractId, parentId, status', projectBudgetLines: 'id, companyId, projectId, boqItemId, category, versionType, status', costDimensions: 'id, companyId, [companyId+kind+code], kind, parentId, status', tenders: 'id, companyId, [companyId+number], clientId, status', variations: 'id, companyId, [companyId+contractId+number], projectId, contractId, status', supplyPlans: 'id, companyId, [companyId+number+revision], projectId, contractId, status, createdAt', materialRequirements: 'id, companyId, [companyId+code], supplyPlanId, projectId, boqItemId, status, requiredBy', purchaseRequisitions: 'id, companyId, [companyId+number], projectId, requirementId, status, createdAt', rfqs: 'id, companyId, [companyId+number], requisitionId, status, createdAt', supplierQuotes: 'id, companyId, [companyId+rfqId+supplierId], rfqId, supplierId, selected, createdAt', purchaseOrders: 'id, companyId, [companyId+number], projectId, requisitionId, quoteId, supplierId, status, createdAt', inventoryItems: 'id, companyId, [companyId+code], status, name', goodsReceipts: 'id, companyId, [companyId+number], purchaseOrderId, projectId, supplierId, itemId, warehouseId, scenario, status, createdAt', stockMovements: 'id, companyId, [companyId+itemId+warehouseId], itemId, warehouseId, projectId, sourceType, sourceId, date', clientDeliveries: 'id, companyId, [companyId+number], receiptId, projectId, itemId, warehouseId, scenario, status, createdAt', deliveryInspections: 'id, companyId, [companyId+number], deliveryId, result, status, createdAt', purchaseReturns: 'id, companyId, [companyId+number], receiptId, itemId, warehouseId, status, createdAt',
      clientInvoices: 'id, companyId, [companyId+number], projectId, contractId, clientId, date, status', supplierInvoices: 'id, companyId, [companyId+supplierId+number], purchaseOrderId, supplierId, projectId, date, status', subcontractCertificates: 'id, companyId, [companyId+subcontractorId+number], projectId, subcontractorId, date, status', cashTransactions: 'id, companyId, [companyId+number], direction, partyType, partyId, sourceType, sourceId, date, status',
    });
    this.version(7).stores({
      companies: 'id, &code, status, createdAt', branches: 'id, companyId, [companyId+code], status', fiscalYears: 'id, companyId, [companyId+startDate], status', accountingPeriods: 'id, companyId, fiscalYearId, [companyId+startDate], status', taxes: 'id, companyId, kind, status', treasuryAccounts: 'id, companyId, type, status', warehouses: 'id, companyId, [companyId+code], type, status', projects: 'id, companyId, [companyId+code], clientId, contractType, lifecycleStatus, status', localProfiles: 'id, displayName', setupDrafts: 'id, updatedAt', appSettings: 'key', auditEvents: 'id, companyId, entityType, entityId, createdAt', accounts: 'id, companyId, [companyId+code], parentId, category, status, isPosting', accountingMappings: 'id, companyId, [companyId+key], accountId', journalEntries: 'id, companyId, [companyId+number], date, periodId, status, sourceType, sourceId', journalLines: 'id, companyId, journalEntryId, accountId, projectId, costCenterId, costCodeId', parties: 'id, companyId, [companyId+type+code], type, status, arabicName', contracts: 'id, companyId, [companyId+number], projectId, clientId, type, status', boqItems: 'id, companyId, [companyId+projectId+code], projectId, contractId, parentId, status', projectBudgetLines: 'id, companyId, projectId, boqItemId, category, versionType, status', costDimensions: 'id, companyId, [companyId+kind+code], kind, parentId, status', tenders: 'id, companyId, [companyId+number], clientId, status', variations: 'id, companyId, [companyId+contractId+number], projectId, contractId, status', supplyPlans: 'id, companyId, [companyId+number+revision], projectId, contractId, status, createdAt', materialRequirements: 'id, companyId, [companyId+code], supplyPlanId, projectId, boqItemId, status, requiredBy', purchaseRequisitions: 'id, companyId, [companyId+number], projectId, requirementId, status, createdAt', rfqs: 'id, companyId, [companyId+number], requisitionId, status, createdAt', supplierQuotes: 'id, companyId, [companyId+rfqId+supplierId], rfqId, supplierId, selected, createdAt', purchaseOrders: 'id, companyId, [companyId+number], projectId, requisitionId, quoteId, supplierId, status, createdAt', inventoryItems: 'id, companyId, [companyId+code], status, name', goodsReceipts: 'id, companyId, [companyId+number], purchaseOrderId, projectId, supplierId, itemId, warehouseId, scenario, status, createdAt', stockMovements: 'id, companyId, [companyId+itemId+warehouseId], itemId, warehouseId, projectId, sourceType, sourceId, date', clientDeliveries: 'id, companyId, [companyId+number], receiptId, projectId, itemId, warehouseId, scenario, status, createdAt', deliveryInspections: 'id, companyId, [companyId+number], deliveryId, result, status, createdAt', purchaseReturns: 'id, companyId, [companyId+number], receiptId, itemId, warehouseId, status, createdAt', clientInvoices: 'id, companyId, [companyId+number], projectId, contractId, clientId, date, status', supplierInvoices: 'id, companyId, [companyId+supplierId+number], purchaseOrderId, supplierId, projectId, date, status', subcontractCertificates: 'id, companyId, [companyId+subcontractorId+number], projectId, subcontractorId, date, status', cashTransactions: 'id, companyId, [companyId+number], direction, partyType, partyId, sourceType, sourceId, date, status',
      cashForecasts: 'id, companyId, projectId, date, direction, status', supplierReviews: 'id, companyId, supplierId, periodStart, periodEnd', projectCloseouts: 'id, companyId, projectId, status',
    });
    this.version(8).stores({
      units:'id, companyId, [companyId+code], baseUnitId, status',
      siteMaterialRequests:'id, companyId, [companyId+number], projectId, itemId, warehouseId, status, requiredBy',
      stockReservations:'id, companyId, requestId, [itemId+warehouseId], projectId, status',
      warehouseTransfers:'id, companyId, [companyId+number], itemId, fromWarehouseId, toWarehouseId, projectId, date, status',
      materialIssues:'id, companyId, [companyId+number], requestId, projectId, itemId, warehouseId, date, status',
      stockAdjustments:'id, companyId, [companyId+number], itemId, warehouseId, projectId, date, kind, status',
      stockCounts:'id, companyId, [companyId+number], itemId, warehouseId, date, status',
    });
    this.version(9).stores({supplyLots:'id, companyId, [companyId+number], projectId, contractId, boqItemId, plannedDeliveryDate, status',serviceOrders:'id, companyId, [companyId+number], projectId, supplierId, requiredBy, status',commercialNotes:'id, companyId, [companyId+number], partyType, partyId, sourceType, sourceId, date, status'});
    this.version(10).stores({subcontracts:'id, companyId, [companyId+number], projectId, subcontractorId, status',clientIPCs:'id, companyId, [companyId+number], projectId, contractId, clientId, date, status',clientIPCLines:'id, companyId, ipcId, boqItemId',materialsOnSite:'id, companyId, [companyId+number], projectId, contractId, boqItemId, status, ipcId',handovers:'id, companyId, [companyId+number], projectId, kind, date, status',retentionReleases:'id, companyId, [companyId+number], partyType, partyId, projectId, sourceType, sourceId, date, status'});
    this.version(11).stores({expenses:'id, companyId, [companyId+number], projectId, date, category, status',timesheets:'id, companyId, [companyId+number], projectId, employeeCode, date, status',equipment:'id, companyId, [companyId+code], projectId, kind, status',equipmentUsage:'id, companyId, [companyId+number], equipmentId, projectId, date, status',fixedAssets:'id, companyId, [companyId+code], category, purchaseDate, status',depreciationRuns:'id, companyId, [assetId+period], assetId, period, status',bankGuarantees:'id, companyId, [companyId+number], projectId, kind, issueDate, expiryDate, status'});
    this.version(12).stores({bankTransfers:'id, companyId, [companyId+number], fromTreasuryId, toTreasuryId, date, status',cheques:'id, companyId, [companyId+number], direction, treasuryId, partyType, partyId, dueDate, status',pettyCashFunds:'id, companyId, [companyId+code], treasuryId, status',pettyCashTransactions:'id, companyId, [companyId+number], fundId, projectId, date, kind, status',bankStatementLines:'id, companyId, treasuryId, date, reference, matched, matchedSourceId',bankReconciliations:'id, companyId, [companyId+number], treasuryId, periodEnd, status'});
  }
}

let database: ErpLocalDatabase | undefined;

export function getDatabase(): ErpLocalDatabase {
  if (typeof window === 'undefined' && typeof indexedDB === 'undefined') throw new Error('IndexedDB is available in the browser only.');
  database ??= new ErpLocalDatabase();
  return database;
}

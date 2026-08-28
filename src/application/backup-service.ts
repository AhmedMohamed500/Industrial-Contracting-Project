import { APP_VERSION, SCHEMA_VERSION, type BackupEnvelope } from '../domain/foundation';
import { getDatabase } from '../infrastructure/indexeddb/database';

const TABLES = ['companies', 'branches', 'fiscalYears', 'accountingPeriods', 'taxes', 'treasuryAccounts', 'warehouses', 'projects', 'localProfiles', 'appSettings', 'auditEvents', 'accounts', 'accountingMappings', 'journalEntries', 'journalLines', 'parties', 'contracts', 'boqItems', 'projectBudgetLines', 'costDimensions', 'tenders', 'variations', 'supplyPlans', 'materialRequirements', 'purchaseRequisitions', 'rfqs', 'supplierQuotes', 'purchaseOrders', 'inventoryItems', 'goodsReceipts', 'stockMovements', 'clientDeliveries', 'deliveryInspections', 'purchaseReturns', 'clientInvoices', 'supplierInvoices', 'subcontractCertificates', 'cashTransactions', 'cashForecasts', 'supplierReviews', 'projectCloseouts', 'units', 'siteMaterialRequests', 'stockReservations', 'warehouseTransfers', 'materialIssues', 'stockAdjustments', 'stockCounts', 'supplyLots', 'serviceOrders', 'commercialNotes'] as const;

export function assertCompatibleBackup(value: unknown): asserts value is BackupEnvelope {
  if (!value || typeof value !== 'object') throw new Error('ملف النسخة الاحتياطية غير صالح');
  const backup = value as Partial<BackupEnvelope>;
  if (!backup.schemaVersion || backup.schemaVersion < 1 || backup.schemaVersion > SCHEMA_VERSION) throw new Error(`إصدار النسخة غير متوافق. الحد الأقصى المدعوم: ${SCHEMA_VERSION}`);
  if (!backup.data || typeof backup.data !== 'object') throw new Error('بيانات النسخة الاحتياطية مفقودة');
}

export async function exportBackup(): Promise<BackupEnvelope> {
  const db = getDatabase();
  const data: Record<string, unknown[]> = {};
  await db.transaction('r', db.tables, async () => {
    for (const tableName of TABLES) data[tableName] = await db.table(tableName).toArray();
  });
  return { schemaVersion: SCHEMA_VERSION, appVersion: APP_VERSION, createdAt: new Date().toISOString(), data };
}

export async function restoreBackup(backup: BackupEnvelope): Promise<void> {
  assertCompatibleBackup(backup);
  const db = getDatabase();
  await db.transaction('rw', db.tables, async () => {
    for (const tableName of TABLES) await db.table(tableName).clear();
    for (const tableName of TABLES) {
      const rows = backup.data[tableName] ?? [];
      if (rows.length) await db.table(tableName).bulkAdd(rows);
    }
    await db.setupDrafts.clear();
  });
}

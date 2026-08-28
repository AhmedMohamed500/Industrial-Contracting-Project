import { money } from '../../application/accounting';
import type { BaseEntity } from '../../domain/foundation';
import type { MaterialRequirement, ProcurementRepository, PurchaseOrder, PurchaseRequisition, RequestForQuotation, SupplierQuote, SupplyPlan } from '../../domain/procurement';
import { getDatabase } from './database';

const now = () => new Date().toISOString();
const required = (value: string, label: string) => { const result = value.trim(); if (!result) throw new Error(`${label} مطلوب`); return result; };

export class IndexedDBProcurementRepository implements ProcurementRepository {
  async listSupplyPlans(companyId: string) { return getDatabase().supplyPlans.where('companyId').equals(companyId).reverse().sortBy('createdAt'); }
  async saveSupplyPlan(input: Omit<SupplyPlan, keyof BaseEntity> & { id?: string; companyId: string }) {
    const db = getDatabase(); const timestamp = now(); const number = required(input.number, 'رقم الخطة').toUpperCase();
    const duplicate = await db.supplyPlans.where('[companyId+number+revision]').equals([input.companyId, number, input.revision]).first();
    if (duplicate && duplicate.id !== input.id) throw new Error('رقم وإصدار الخطة مستخدمان');
    const project = await db.projects.get(input.projectId); const contract = await db.contracts.get(input.contractId);
    if (!project || !contract || project.companyId !== input.companyId || contract.projectId !== project.id) throw new Error('المشروع أو العقد غير صالح');
    const old = input.id ? await db.supplyPlans.get(input.id) : undefined;
    const row: SupplyPlan = { ...input, id: input.id || crypto.randomUUID(), number, revision: Number(input.revision), createdAt: old?.createdAt || timestamp, updatedAt: timestamp };
    await db.supplyPlans.put(row); return row;
  }

  async listRequirements(companyId: string) { return getDatabase().materialRequirements.where('companyId').equals(companyId).reverse().sortBy('createdAt'); }
  async saveRequirement(input: Omit<MaterialRequirement, keyof BaseEntity> & { id?: string; companyId: string }) {
    if (input.requiredQuantity <= 0) throw new Error('الكمية المطلوبة يجب أن تكون أكبر من صفر');
    const db = getDatabase(); const timestamp = now(); const code = required(input.code, 'كود الاحتياج').toUpperCase();
    const duplicate = await db.materialRequirements.where('[companyId+code]').equals([input.companyId, code]).first(); if (duplicate && duplicate.id !== input.id) throw new Error('كود الاحتياج مستخدم');
    const plan = await db.supplyPlans.get(input.supplyPlanId); if (!plan || plan.companyId !== input.companyId || plan.projectId !== input.projectId) throw new Error('خطة التوريد غير صالحة');
    const old = input.id ? await db.materialRequirements.get(input.id) : undefined;
    const row: MaterialRequirement = { ...input, id: input.id || crypto.randomUUID(), code, description: required(input.description, 'وصف الاحتياج'), requiredQuantity: Number(input.requiredQuantity), createdAt: old?.createdAt || timestamp, updatedAt: timestamp };
    await db.materialRequirements.put(row); return row;
  }

  async listRequisitions(companyId: string) { return getDatabase().purchaseRequisitions.where('companyId').equals(companyId).reverse().sortBy('createdAt'); }
  async saveRequisition(input: Omit<PurchaseRequisition, keyof BaseEntity> & { id?: string; companyId: string }) {
    if (input.quantity <= 0) throw new Error('كمية طلب الشراء يجب أن تكون أكبر من صفر');
    const db = getDatabase(); const timestamp = now(); const number = required(input.number, 'رقم طلب الشراء').toUpperCase();
    const duplicate = await db.purchaseRequisitions.where('[companyId+number]').equals([input.companyId, number]).first(); if (duplicate && duplicate.id !== input.id) throw new Error('رقم طلب الشراء مستخدم');
    const old = input.id ? await db.purchaseRequisitions.get(input.id) : undefined; if (old && old.status !== 'draft') throw new Error('يمكن تعديل المسودة فقط');
    const row: PurchaseRequisition = { ...input, id: input.id || crypto.randomUUID(), number, description: required(input.description, 'الوصف'), quantity: Number(input.quantity), createdAt: old?.createdAt || timestamp, updatedAt: timestamp };
    await db.purchaseRequisitions.put(row); return row;
  }
  async setRequisitionStatus(id: string, status: PurchaseRequisition['status']) {
    const db = getDatabase(); const row = await db.purchaseRequisitions.get(id); if (!row) throw new Error('طلب الشراء غير موجود');
    const allowed: Record<string, string[]> = { draft: ['submitted', 'cancelled'], submitted: ['approved', 'rejected'], approved: ['closed'], rejected: [], cancelled: [], closed: [] };
    if (!allowed[row.status]?.includes(status)) throw new Error('انتقال حالة طلب الشراء غير مسموح'); await db.purchaseRequisitions.update(id, { status, updatedAt: now() });
  }

  async listRFQs(companyId: string) { return getDatabase().rfqs.where('companyId').equals(companyId).reverse().sortBy('createdAt'); }
  async saveRFQ(input: Omit<RequestForQuotation, keyof BaseEntity> & { id?: string; companyId: string }) {
    const db = getDatabase(); const timestamp = now(); const number = required(input.number, 'رقم RFQ').toUpperCase();
    const requisition = await db.purchaseRequisitions.get(input.requisitionId); if (!requisition || requisition.companyId !== input.companyId || requisition.status !== 'approved') throw new Error('RFQ يحتاج طلب شراء معتمد');
    if (!input.supplierIds.length) throw new Error('اختر موردًا واحدًا على الأقل');
    const suppliers = await db.parties.bulkGet(input.supplierIds); if (suppliers.some(item => !item || item.type !== 'supplier' || item.companyId !== input.companyId)) throw new Error('قائمة الموردين غير صالحة');
    const duplicate = await db.rfqs.where('[companyId+number]').equals([input.companyId, number]).first(); if (duplicate && duplicate.id !== input.id) throw new Error('رقم RFQ مستخدم');
    const old = input.id ? await db.rfqs.get(input.id) : undefined; const row: RequestForQuotation = { ...input, id: input.id || crypto.randomUUID(), number, createdAt: old?.createdAt || timestamp, updatedAt: timestamp };
    await db.rfqs.put(row); return row;
  }

  async listQuotes(companyId: string) { return getDatabase().supplierQuotes.where('companyId').equals(companyId).reverse().sortBy('createdAt'); }
  async saveQuote(input: Omit<SupplierQuote, keyof BaseEntity> & { id?: string; companyId: string }) {
    if (input.quantity <= 0 || input.unitPrice < 0 || input.freight < 0) throw new Error('قيم العرض غير صالحة');
    const db = getDatabase(); const timestamp = now(); const rfq = await db.rfqs.get(input.rfqId); if (!rfq || rfq.companyId !== input.companyId || !rfq.supplierIds.includes(input.supplierId)) throw new Error('المورد غير مدعو لهذا RFQ');
    const duplicate = await db.supplierQuotes.where('[companyId+rfqId+supplierId]').equals([input.companyId, input.rfqId, input.supplierId]).first(); if (duplicate && duplicate.id !== input.id) throw new Error('للمورد عرض مسجل بالفعل');
    const old = input.id ? await db.supplierQuotes.get(input.id) : undefined; const row: SupplierQuote = { ...input, id: input.id || crypto.randomUUID(), quoteNumber: required(input.quoteNumber, 'رقم العرض').toUpperCase(), quantity: Number(input.quantity), unitPrice: money(Number(input.unitPrice)), freight: money(Number(input.freight)), leadTimeDays: Number(input.leadTimeDays), selected: old?.selected || false, createdAt: old?.createdAt || timestamp, updatedAt: timestamp };
    await db.supplierQuotes.put(row); return row;
  }

  async selectQuoteAndCreatePO(quoteId: string, poNumber: string, expectedDate: string) {
    const db = getDatabase(); return db.transaction('rw', [db.supplierQuotes, db.rfqs, db.purchaseRequisitions, db.purchaseOrders], async () => {
      const quote = await db.supplierQuotes.get(quoteId); if (!quote) throw new Error('عرض المورد غير موجود');
      const existing = await db.purchaseOrders.where('quoteId').equals(quoteId).first(); if (existing) return existing;
      const rfq = await db.rfqs.get(quote.rfqId); const requisition = rfq ? await db.purchaseRequisitions.get(rfq.requisitionId) : undefined; if (!rfq || !requisition) throw new Error('تسلسل المستندات غير مكتمل');
      const number = required(poNumber, 'رقم أمر الشراء').toUpperCase(); const duplicate = await db.purchaseOrders.where('[companyId+number]').equals([quote.companyId, number]).first(); if (duplicate) throw new Error('رقم أمر الشراء مستخدم');
      const timestamp = now(); const row: PurchaseOrder = { id: crypto.randomUUID(), companyId: quote.companyId, number, projectId: requisition.projectId, requisitionId: requisition.id, quoteId: quote.id, supplierId: quote.supplierId, description: requisition.description, unit: requisition.unit, quantity: quote.quantity, unitPrice: quote.unitPrice, freight: quote.freight, orderedValue: money(quote.quantity * quote.unitPrice + quote.freight), expectedDate, status: 'draft', createdAt: timestamp, updatedAt: timestamp };
      await db.supplierQuotes.where('rfqId').equals(rfq.id).modify({ selected: false, updatedAt: timestamp }); await db.supplierQuotes.update(quote.id, { selected: true, updatedAt: timestamp }); await db.rfqs.update(rfq.id, { status: 'closed', updatedAt: timestamp }); await db.purchaseOrders.add(row); return row;
    });
  }
  async listPurchaseOrders(companyId: string) { return getDatabase().purchaseOrders.where('companyId').equals(companyId).reverse().sortBy('createdAt'); }
  async setPurchaseOrderStatus(id: string, status: PurchaseOrder['status']) { const db = getDatabase(); const row = await db.purchaseOrders.get(id); if (!row) throw new Error('أمر الشراء غير موجود'); const allowed: Record<string, string[]> = { draft: ['approved', 'cancelled'], approved: ['closed', 'cancelled'], cancelled: [], closed: [] }; if (!allowed[row.status]?.includes(status)) throw new Error('انتقال حالة أمر الشراء غير مسموح'); await db.purchaseOrders.update(id, { status, updatedAt: now() }); }
}

import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import { EMPTY_SETUP_PAYLOAD } from '../src/domain/foundation';
import { getDatabase } from '../src/infrastructure/indexeddb/database';
import { IndexedDBCommercialRepository } from '../src/infrastructure/indexeddb/commercial-repository';
import { IndexedDBProcurementRepository } from '../src/infrastructure/indexeddb/procurement-repository';
import { IndexedDBFoundationRepository } from '../src/infrastructure/indexeddb/repositories';

async function fixture() {
  const payload=structuredClone(EMPTY_SETUP_PAYLOAD);payload.company={...payload.company,arabicName:'شركة التوريد',code:'PROC-01',country:'مصر',baseCurrency:'EGP'};payload.fiscalYear={name:'2027',startDate:'2027-01-01',endDate:'2027-12-31'};
  const companyId=await new IndexedDBFoundationRepository().completeSetup(payload);const commercial=new IndexedDBCommercialRepository(),procurement=new IndexedDBProcurementRepository();
  const client=await commercial.saveParty({companyId,type:'client',code:'CL-01',arabicName:'عميل',paymentTermsDays:30,status:'active'});
  const supplier=await commercial.saveParty({companyId,type:'supplier',code:'SUP-01',arabicName:'مورد',paymentTermsDays:30,status:'active'});
  const project=await commercial.saveProject({companyId,code:'PRJ-01',name:'مشروع توريد',clientId:client.id,contractType:'supply_only',originalContractValue:10000,physicalProgress:0,status:'active'});
  const contract=await commercial.saveContract({companyId,projectId:project.id,clientId:client.id,number:'CTR-01',title:'عقد توريد',type:'supply_only',currency:'EGP',originalValue:10000,approvedVariations:0,retentionRate:0,advanceRate:0,startDate:'2027-01-01',status:'active'});
  return {companyId,supplier,project,contract,procurement};
}

describe('supply planning and procurement',()=>{
  beforeEach(async()=>{const db=getDatabase();await db.delete();await db.open()});

  it('runs plan to approved PR with enforced transitions',async()=>{
    const {companyId,project,contract,procurement}=await fixture();
    const plan=await procurement.saveSupplyPlan({companyId,projectId:project.id,contractId:contract.id,number:'SP-01',revision:0,baselineDate:'2027-01-10',status:'approved'});
    const requirement=await procurement.saveRequirement({companyId,supplyPlanId:plan.id,projectId:project.id,code:'MR-01',description:'لوحة تحكم',unit:'EA',requiredQuantity:2,requiredBy:'2027-02-01',source:'project_plan',status:'approved'});
    const requisition=await procurement.saveRequisition({companyId,number:'PR-01',projectId:project.id,requirementId:requirement.id,description:requirement.description,unit:requirement.unit,quantity:requirement.requiredQuantity,requiredBy:requirement.requiredBy,status:'draft'});
    await expect(procurement.setRequisitionStatus(requisition.id,'approved')).rejects.toThrow(/غير مسموح/);
    await procurement.setRequisitionStatus(requisition.id,'submitted');await procurement.setRequisitionStatus(requisition.id,'approved');
    expect((await procurement.listRequisitions(companyId))[0].status).toBe('approved');
  });

  it('requires an approved PR and invited supplier for RFQ quotes',async()=>{
    const {companyId,supplier,project,procurement}=await fixture();
    const pr=await procurement.saveRequisition({companyId,number:'PR-02',projectId:project.id,description:'كابل',unit:'M',quantity:100,requiredBy:'2027-02-01',status:'draft'});
    await expect(procurement.saveRFQ({companyId,number:'RFQ-01',requisitionId:pr.id,supplierIds:[supplier.id],closingDate:'2027-01-20',status:'submitted'})).rejects.toThrow(/معتمد/);
    await procurement.setRequisitionStatus(pr.id,'submitted');await procurement.setRequisitionStatus(pr.id,'approved');
    const rfq=await procurement.saveRFQ({companyId,number:'RFQ-01',requisitionId:pr.id,supplierIds:[supplier.id],closingDate:'2027-01-20',status:'submitted'});
    const quote=await procurement.saveQuote({companyId,rfqId:rfq.id,supplierId:supplier.id,quoteNumber:'Q-01',quantity:100,unitPrice:12.5,freight:50,leadTimeDays:7,selected:false});
    expect(quote.quantity*quote.unitPrice+quote.freight).toBe(1300);
  });

  it('selects a quote and creates one idempotent purchase order atomically',async()=>{
    const {companyId,supplier,project,procurement}=await fixture();const pr=await procurement.saveRequisition({companyId,number:'PR-03',projectId:project.id,description:'محرك',unit:'EA',quantity:2,requiredBy:'2027-03-01',status:'draft'});await procurement.setRequisitionStatus(pr.id,'submitted');await procurement.setRequisitionStatus(pr.id,'approved');
    const rfq=await procurement.saveRFQ({companyId,number:'RFQ-03',requisitionId:pr.id,supplierIds:[supplier.id],closingDate:'2027-02-01',status:'submitted'});const quote=await procurement.saveQuote({companyId,rfqId:rfq.id,supplierId:supplier.id,quoteNumber:'Q-03',quantity:2,unitPrice:1000,freight:100,leadTimeDays:14,selected:false});
    const first=await procurement.selectQuoteAndCreatePO(quote.id,'PO-03','2027-03-01');const second=await procurement.selectQuoteAndCreatePO(quote.id,'IGNORED','2027-04-01');
    expect(second.id).toBe(first.id);expect(first.orderedValue).toBe(2100);expect(await procurement.listPurchaseOrders(companyId)).toHaveLength(1);expect((await procurement.listRFQs(companyId))[0].status).toBe('closed');
  });
});

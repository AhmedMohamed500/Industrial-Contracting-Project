import type { BaseEntity } from './foundation';

export type BillingStatus='draft'|'posted'|'part_paid'|'paid'|'cancelled';
export interface ClientInvoice extends BaseEntity { number:string;projectId:string;contractId:string;clientId:string;certificateReference?:string;date:string;grossAmount:number;retentionAmount:number;advanceRecovery:number;vatAmount:number;netDue:number;paidAmount:number;status:BillingStatus;journalId?:string }
export interface SupplierInvoice extends BaseEntity { number:string;purchaseOrderId:string;supplierId:string;projectId:string;date:string;netAmount:number;vatAmount:number;totalDue:number;paidAmount:number;status:BillingStatus;journalId?:string }
export interface SubcontractCertificate extends BaseEntity { number:string;projectId:string;subcontractorId:string;subcontractId?:string;date:string;previousAmount?:number;currentAmount?:number;cumulativeAmount?:number;grossAmount:number;retentionAmount:number;advanceRecovery:number;taxAmount?:number;deductions?:number;netDue:number;paidAmount:number;status:BillingStatus;journalId?:string }
export interface CashTransaction extends BaseEntity { number:string;direction:'receipt'|'payment';partyType:'client'|'supplier'|'subcontractor';partyId:string;sourceType:'client_invoice'|'supplier_invoice'|'subcontract_certificate';sourceId:string;treasuryType:'cash'|'bank';date:string;amount:number;status:'draft'|'posted'|'cancelled';journalId?:string }
export interface FinanceRepository {
 listClientInvoices(companyId:string):Promise<ClientInvoice[]>;saveClientInvoice(input:Omit<ClientInvoice,keyof BaseEntity|'netDue'|'paidAmount'|'journalId'>&{id?:string;companyId:string}):Promise<ClientInvoice>;postClientInvoice(id:string):Promise<void>;
 listSupplierInvoices(companyId:string):Promise<SupplierInvoice[]>;saveSupplierInvoice(input:Omit<SupplierInvoice,keyof BaseEntity|'totalDue'|'paidAmount'|'journalId'>&{id?:string;companyId:string}):Promise<SupplierInvoice>;postSupplierInvoice(id:string):Promise<void>;
 listSubcontractCertificates(companyId:string):Promise<SubcontractCertificate[]>;saveSubcontractCertificate(input:Omit<SubcontractCertificate,keyof BaseEntity|'netDue'|'paidAmount'|'journalId'>&{id?:string;companyId:string}):Promise<SubcontractCertificate>;postSubcontractCertificate(id:string):Promise<void>;
 listCashTransactions(companyId:string):Promise<CashTransaction[]>;saveCashTransaction(input:Omit<CashTransaction,keyof BaseEntity|'journalId'>&{id?:string;companyId:string}):Promise<CashTransaction>;postCashTransaction(id:string):Promise<void>;
}

import type{BaseEntity}from'./foundation';
export interface BankTransfer extends BaseEntity{number:string;fromTreasuryId:string;toTreasuryId:string;date:string;amount:number;fees:number;description:string;status:'draft'|'approved'|'posted'|'cancelled';journalId?:string}
export interface ChequeRecord extends BaseEntity{number:string;direction:'received'|'issued';treasuryId:string;partyType?:'client'|'supplier'|'subcontractor';partyId?:string;issueDate:string;dueDate:string;amount:number;payee:string;status:'draft'|'issued'|'received'|'deposited'|'cleared'|'bounced'|'cancelled';journalId?:string}
export interface PettyCashFund extends BaseEntity{code:string;name:string;treasuryId:string;custodian:string;limit:number;balance:number;status:'active'|'closed'}
export interface PettyCashTransaction extends BaseEntity{number:string;fundId:string;projectId?:string;date:string;description:string;amount:number;kind:'expense'|'replenishment';status:'draft'|'approved'|'posted';journalId?:string}
export interface BankStatementLine extends BaseEntity{treasuryId:string;date:string;reference:string;description:string;direction:'deposit'|'withdrawal';amount:number;matched:boolean;matchedSourceId?:string}
export interface BankReconciliation extends BaseEntity{number:string;treasuryId:string;periodEnd:string;statementBalance:number;bookBalance:number;difference:number;status:'draft'|'completed'}

import type { BaseEntity } from './foundation';
export interface CashForecast extends BaseEntity { projectId?:string;date:string;direction:'inflow'|'outflow';description:string;sourceType:string;sourceId?:string;amount:number;confidencePercent:number;status:'open'|'realized'|'cancelled' }
export interface SupplierReview extends BaseEntity { supplierId:string;periodStart:string;periodEnd:string;onTimeScore:number;qualityScore:number;commercialScore:number;notes?:string }
export interface ProjectCloseoutRecord extends BaseEntity { projectId:string;practicalCompletionDate?:string;finalHandoverDate?:string;defectsLiabilityEndDate?:string;finalAccountAgreed:boolean;retentionReleased:boolean;guaranteesReleased:boolean;openItems:string;status:'draft'|'in_progress'|'closed' }
export interface ProjectPerformance { projectId:string;contractValue:number;invoicedRevenue:number;collected:number;committedCost:number;actualCost:number;paidCost:number;forecastMargin:number;cashPosition:number }

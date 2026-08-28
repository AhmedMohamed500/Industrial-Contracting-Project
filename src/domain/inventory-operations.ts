import type { BaseEntity } from './foundation';
export interface UnitDefinition extends BaseEntity{code:string;name:string;baseUnitId?:string;conversionFactor:number;status:'active'|'inactive'}
export interface SiteMaterialRequestRecord extends BaseEntity{number:string;projectId:string;itemId:string;warehouseId:string;quantity:number;requiredBy:string;status:'draft'|'submitted'|'approved'|'fulfilled'|'cancelled'}
export interface StockReservation extends BaseEntity{number:string;requestId:string;projectId:string;itemId:string;warehouseId:string;quantity:number;status:'active'|'released'|'consumed'}
export interface WarehouseTransfer extends BaseEntity{number:string;itemId:string;fromWarehouseId:string;toWarehouseId:string;projectId?:string;quantity:number;date:string;unitCost:number;status:'draft'|'posted'|'cancelled'}
export interface MaterialIssue extends BaseEntity{number:string;requestId?:string;projectId:string;itemId:string;warehouseId:string;quantity:number;date:string;unitCost:number;status:'draft'|'posted'|'cancelled';journalId?:string}
export interface StockAdjustment extends BaseEntity{number:string;itemId:string;warehouseId:string;projectId?:string;date:string;quantityDelta:number;unitCost:number;reason:string;kind:'adjustment'|'count_variance'|'waste';status:'draft'|'posted'|'cancelled';journalId?:string}
export interface StockCount extends BaseEntity{number:string;itemId:string;warehouseId:string;date:string;systemQuantity:number;countedQuantity:number;variance:number;status:'draft'|'approved'|'posted';adjustmentId?:string}

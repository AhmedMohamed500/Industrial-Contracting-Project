import type { BaseEntity } from './foundation';
import type { DeliveryScenario } from './planned-operations';

export interface InventoryItem extends BaseEntity { code:string; name:string; unit:string; reorderLevel:number; status:'active'|'inactive' }
export interface GoodsReceipt extends BaseEntity { number:string; purchaseOrderId:string; projectId:string; supplierId:string; itemId:string; warehouseId?:string; scenario:DeliveryScenario; quantity:number; unitCost:number; receivedAt:string; status:'draft'|'posted'|'cancelled' }
export interface StockMovement extends BaseEntity { itemId:string; warehouseId:string; projectId?:string; sourceType:'receipt'|'delivery'|'return'|'adjustment'; sourceId:string; date:string; quantityIn:number; quantityOut:number; unitCost:number }
export interface ClientDelivery extends BaseEntity { number:string; receiptId:string; projectId:string; itemId:string; warehouseId?:string; scenario:DeliveryScenario; quantity:number; deliveredAt:string; status:'draft'|'posted'|'cancelled' }
export interface DeliveryInspection extends BaseEntity { number:string; deliveryId:string; inspectedAt:string; acceptedQuantity:number; rejectedQuantity:number; result:'accepted'|'accepted_with_notes'|'rejected'; notes?:string; status:'draft'|'approved' }
export interface PurchaseReturnRecord extends BaseEntity { number:string; receiptId:string; itemId:string; warehouseId?:string; quantity:number; reason:string; returnedAt:string; status:'draft'|'posted'|'cancelled' }

export interface InventoryRepository {
  listItems(companyId:string):Promise<InventoryItem[]>; saveItem(input:Omit<InventoryItem,keyof BaseEntity>&{id?:string;companyId:string}):Promise<InventoryItem>;
  listReceipts(companyId:string):Promise<GoodsReceipt[]>; saveReceipt(input:Omit<GoodsReceipt,keyof BaseEntity>&{id?:string;companyId:string}):Promise<GoodsReceipt>; postReceipt(id:string):Promise<void>;
  listMovements(companyId:string):Promise<StockMovement[]>; getOnHand(companyId:string,itemId:string,warehouseId:string):Promise<number>;
  listDeliveries(companyId:string):Promise<ClientDelivery[]>; saveDelivery(input:Omit<ClientDelivery,keyof BaseEntity>&{id?:string;companyId:string}):Promise<ClientDelivery>; postDelivery(id:string):Promise<void>;
  listInspections(companyId:string):Promise<DeliveryInspection[]>; saveInspection(input:Omit<DeliveryInspection,keyof BaseEntity>&{id?:string;companyId:string}):Promise<DeliveryInspection>;
  listReturns(companyId:string):Promise<PurchaseReturnRecord[]>; saveReturn(input:Omit<PurchaseReturnRecord,keyof BaseEntity>&{id?:string;companyId:string}):Promise<PurchaseReturnRecord>; postReturn(id:string):Promise<void>;
}

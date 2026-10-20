import type {
  IInventory,
  IInventoryTransaction,
  InventoryRecord,
  InventoryTransactionRecord,
} from '../types/inventory.types';

export function toInventory(inventory: InventoryRecord): IInventory {
  return {
    id: inventory.id,
    productId: inventory.productId,
    product: inventory.product,
    qtyOnHand: inventory.qtyOnHand,
    lowStockThreshold: inventory.lowStockThreshold,
    stockStatus: inventory.stockStatus,
    createdAt: inventory.createdAt,
    updatedAt: inventory.updatedAt,
  };
}

export function toInventoryTransaction(
  transaction: InventoryTransactionRecord,
): IInventoryTransaction {
  return {
    id: transaction.id,
    inventoryId: transaction.inventoryId,
    type: transaction.type,
    quantity: transaction.quantity,
    reason: transaction.reason,
    note: transaction.note,
    performedBy: transaction.performedBy,
    orderItemId: transaction.orderItemId,
    orderNumber: transaction.orderItem?.order.orderNumber ?? null,
    createdAt: transaction.createdAt,
  };
}

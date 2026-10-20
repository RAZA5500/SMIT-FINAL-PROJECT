import {
  AdjustmentReason,
  Prisma,
  StockStatus,
  TransactionType,
} from '@prisma/client';

/** Yeh reasons sirf stock kam karte hain (FLOW-MD 01 §11) */
export const NEGATIVE_ONLY_REASONS: AdjustmentReason[] = [
  AdjustmentReason.DAMAGE,
  AdjustmentReason.RETURN_TO_SUPPLIER,
];

export const DEFAULT_LOW_STOCK_THRESHOLD = 10;

export const inventoryInclude = {
  product: { select: { id: true, name: true, sku: true, isActive: true } },
} satisfies Prisma.InventoryInclude;

export type InventoryRecord = Prisma.InventoryGetPayload<{
  include: typeof inventoryInclude;
}>;

export const inventoryTransactionInclude = {
  orderItem: { select: { order: { select: { orderNumber: true } } } },
} satisfies Prisma.InventoryTransactionInclude;

export type InventoryTransactionRecord = Prisma.InventoryTransactionGetPayload<{
  include: typeof inventoryTransactionInclude;
}>;

/** `SELECT ... FOR UPDATE` se lock ki hui row */
export interface ILockedInventoryRow {
  id: string;
  productId: string;
  qtyOnHand: number;
  lowStockThreshold: number;
}

export interface IInventory {
  id: string;
  productId: string;
  product: { id: string; name: string; sku: string; isActive: boolean };
  qtyOnHand: number;
  lowStockThreshold: number;
  stockStatus: StockStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInventoryTransaction {
  id: string;
  inventoryId: string;
  type: TransactionType;
  /** Hamesha positive — direction `type` se */
  quantity: number;
  reason: AdjustmentReason | null;
  note: string | null;
  performedBy: string | null;
  orderItemId: string | null;
  orderNumber: string | null;
  createdAt: Date;
}

export interface IAdjustmentResult {
  inventory: IInventory;
  transaction: IInventoryTransaction;
}

export interface IListInventoryFilter {
  page: number;
  limit: number;
  search?: string;
  stockStatus?: StockStatus;
}

export interface ICreateTransactionData {
  inventoryId: string;
  type: TransactionType;
  quantity: number;
  reason?: AdjustmentReason | null;
  note?: string | null;
  performedBy?: string | null;
  orderItemId?: string | null;
}

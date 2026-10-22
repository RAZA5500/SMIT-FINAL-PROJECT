import type { AdjustmentReason, StockStatus, TransactionType } from "@/constants/enums";
import type { IPaginationPayload } from "@/services/types";

export interface IInventory {
  id: string;
  productId: string;
  product: { id: string; name: string; sku: string; isActive: boolean };
  qtyOnHand: number;
  lowStockThreshold: number;
  stockStatus: StockStatus;
  createdAt: string;
  updatedAt: string;
}

/** Ledger row — `quantity` hamesha positive, direction `type` se */
export interface IInventoryTransaction {
  id: string;
  inventoryId: string;
  type: TransactionType;
  quantity: number;
  reason: AdjustmentReason | null;
  note: string | null;
  performedBy: string | null;
  orderItemId: string | null;
  orderNumber: string | null;
  createdAt: string;
}

export interface IAdjustmentResult {
  inventory: IInventory;
  transaction: IInventoryTransaction;
}

export interface IFetchInventoryPayload extends IPaginationPayload {
  /** Product name ya SKU */
  search?: string;
  stockStatus?: StockStatus;
}

export type IFetchInventoryTransactionsPayload = IPaginationPayload;

export interface ICreateInventoryPayload {
  productId: string;
  qtyOnHand: number;
  lowStockThreshold?: number;
}

export interface IAdjustInventoryPayload {
  inventoryId: string;
  /** Negative = stock kam, positive = stock zyada (0 nahi) */
  quantity: number;
  reason: AdjustmentReason;
  note?: string;
}

/** Backend enums (UPPER_SNAKE) — student-api/prisma/schema.prisma ke mutabiq */

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "READY_FOR_PICKUP",
  "READY_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "REFUND_PENDING",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = ["UNPAID", "PAID", "FAILED", "CANCELED", "REFUNDED"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const STOCK_STATUSES = ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"] as const;
export type StockStatus = (typeof STOCK_STATUSES)[number];

export const DELIVERY_TYPES = ["DELIVERY", "PICKUP"] as const;
export type DeliveryType = (typeof DELIVERY_TYPES)[number];

export const CUSTOMER_CANCEL_REASONS = [
  "CHANGED_MIND",
  "ORDERED_BY_MISTAKE",
  "FOUND_BETTER_PRICE",
  "DELIVERY_TOO_LONG",
  "OTHER",
] as const;
export type CustomerCancelReason = (typeof CUSTOMER_CANCEL_REASONS)[number];

export const ADMIN_CANCEL_REASONS = [
  "CUSTOMER_REQUEST",
  "OUT_OF_STOCK",
  "PAYMENT_ISSUE",
  "OTHER",
] as const;
export type AdminCancelReason = (typeof ADMIN_CANCEL_REASONS)[number];

export const ADJUSTMENT_REASONS = [
  "DAMAGE",
  "RECOUNT",
  "RETURN_TO_SUPPLIER",
  "MANUAL_CORRECTION",
  "RESTOCK",
] as const;
export type AdjustmentReason = (typeof ADJUSTMENT_REASONS)[number];

/** Yeh reasons sirf stock kam karte hain (backend bhi check karta hai) */
export const NEGATIVE_ONLY_ADJUSTMENT_REASONS: readonly AdjustmentReason[] = [
  "DAMAGE",
  "RETURN_TO_SUPPLIER",
];

export const TRANSACTION_TYPES = [
  "RECEIVED",
  "ADJUSTMENT_INCREASE",
  "ADJUSTMENT_DECREASE",
  "CONSUMED",
  "RELEASED",
] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

/** Admin status transitions (FLOW-MD 01 §19) — UI sirf allowed buttons dikhata hai, backend phir bhi check karta hai */
export const ADMIN_NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [],
  CONFIRMED: ["PROCESSING"],
  PROCESSING: ["READY_FOR_PICKUP", "READY_FOR_DELIVERY"],
  READY_FOR_PICKUP: ["DELIVERED"],
  READY_FOR_DELIVERY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
  REFUND_PENDING: [],
};

export const CUSTOMER_CANCELLABLE_STATUSES: readonly OrderStatus[] = ["PENDING", "CONFIRMED"];

export const ADMIN_CANCELLABLE_STATUSES: readonly OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "READY_FOR_PICKUP",
  "READY_FOR_DELIVERY",
];

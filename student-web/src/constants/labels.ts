import type {
  AdjustmentReason,
  AdminCancelReason,
  CustomerCancelReason,
  DeliveryType,
  OrderStatus,
  PaymentStatus,
  StockStatus,
  TransactionType,
} from "./enums";

/** Enum → human label maps (backend UPPER_SNAKE values) */

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  READY_FOR_PICKUP: "Ready for Pickup",
  READY_FOR_DELIVERY: "Ready for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUND_PENDING: "Refund Pending",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  UNPAID: "Unpaid",
  PAID: "Paid",
  FAILED: "Failed",
  CANCELED: "Canceled",
  REFUNDED: "Refunded",
};

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  IN_STOCK: "In Stock",
  LOW_STOCK: "Low Stock",
  OUT_OF_STOCK: "Out of Stock",
};

export const DELIVERY_TYPE_LABELS: Record<DeliveryType, string> = {
  DELIVERY: "Delivery",
  PICKUP: "Pickup",
};

export const CUSTOMER_CANCEL_REASON_LABELS: Record<CustomerCancelReason, string> = {
  CHANGED_MIND: "Changed my mind",
  ORDERED_BY_MISTAKE: "Ordered by mistake",
  FOUND_BETTER_PRICE: "Found a better price",
  DELIVERY_TOO_LONG: "Delivery takes too long",
  OTHER: "Other",
};

export const ADMIN_CANCEL_REASON_LABELS: Record<AdminCancelReason, string> = {
  CUSTOMER_REQUEST: "Customer request",
  OUT_OF_STOCK: "Out of stock",
  PAYMENT_ISSUE: "Payment issue",
  OTHER: "Other",
};

export const CANCELLATION_REASON_LABELS: Record<string, string> = {
  ...CUSTOMER_CANCEL_REASON_LABELS,
  ...ADMIN_CANCEL_REASON_LABELS,
  PAYMENT_TIMEOUT: "Payment timed out",
};

export const ADJUSTMENT_REASON_LABELS: Record<AdjustmentReason, string> = {
  DAMAGE: "Damage",
  RECOUNT: "Recount",
  RETURN_TO_SUPPLIER: "Return to supplier",
  MANUAL_CORRECTION: "Manual correction",
  RESTOCK: "Restock",
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  RECEIVED: "Received",
  ADJUSTMENT_INCREASE: "Adjustment +",
  ADJUSTMENT_DECREASE: "Adjustment −",
  CONSUMED: "Consumed (order)",
  RELEASED: "Released (cancel)",
};

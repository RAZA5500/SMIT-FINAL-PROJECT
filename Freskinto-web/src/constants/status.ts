import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, STOCK_STATUS_LABELS } from "./labels";

export type StatusTone = "success" | "warning" | "danger" | "info" | "brand" | "neutral";

/** Har status ka tone ek jagah — orders, payments, stock, active/inactive */
export const STATUS_TONES: Record<string, StatusTone> = {
  PENDING: "warning",
  CONFIRMED: "info",
  PROCESSING: "brand",
  READY_FOR_PICKUP: "brand",
  READY_FOR_DELIVERY: "brand",
  DELIVERED: "success",
  CANCELLED: "danger",
  REFUND_PENDING: "warning",
  UNPAID: "warning",
  PAID: "success",
  FAILED: "danger",
  CANCELED: "neutral",
  REFUNDED: "neutral",
  IN_STOCK: "success",
  LOW_STOCK: "warning",
  OUT_OF_STOCK: "danger",
  ACTIVE: "success",
  INACTIVE: "neutral",
};

export const STATUS_LABELS: Record<string, string> = {
  ...ORDER_STATUS_LABELS,
  ...PAYMENT_STATUS_LABELS,
  ...STOCK_STATUS_LABELS,
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

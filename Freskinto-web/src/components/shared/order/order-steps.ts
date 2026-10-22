import { CheckCircle2, CreditCard, PackageCheck, ReceiptText, Store, Truck, type LucideIcon } from "lucide-react";
import type { IOrder } from "@/services/orders/types";

export interface OrderStep {
  key: string;
  label: string;
  icon: LucideIcon;
  /** Backend timestamp — null = abhi nahi hua */
  at: string | null;
}

type StepSource = Pick<
  IOrder,
  "deliveryType" | "createdAt" | "confirmedAt" | "processedAt" | "readyAt" | "deliveredAt"
>;

/** Har status change ka timestamp backend rakhta hai (FLOW-MD 01 §19) */
export function orderSteps(order: StepSource): OrderStep[] {
  const pickup = order.deliveryType === "PICKUP";
  return [
    { key: "placed", label: "Order placed", icon: ReceiptText, at: order.createdAt },
    { key: "confirmed", label: "Paid & confirmed", icon: CreditCard, at: order.confirmedAt },
    { key: "processing", label: "Being prepared", icon: PackageCheck, at: order.processedAt },
    {
      key: "ready",
      label: pickup ? "Ready to collect" : "Out for delivery",
      icon: pickup ? Store : Truck,
      at: order.readyAt,
    },
    { key: "delivered", label: pickup ? "Collected" : "Delivered", icon: CheckCircle2, at: order.deliveredAt },
  ];
}

import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  STOCK_STATUS_LABELS,
} from "@/constants/labels";
import { cn } from "@/lib/utils";

type Tone = "green" | "amber" | "red" | "blue" | "violet" | "orange" | "gray";

const TONE_CLASSES: Record<Tone, string> = {
  green: "bg-green-50 text-green-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  blue: "bg-blue-50 text-blue-700",
  violet: "bg-violet-50 text-violet-700",
  orange: "bg-orange-50 text-orange-700",
  gray: "bg-gray-100 text-gray-600",
};

/** Har status ka color ek jagah — orders, payments, stock, active/inactive */
const STATUS_TONES: Record<string, Tone> = {
  PENDING: "amber",
  CONFIRMED: "blue",
  PROCESSING: "violet",
  READY_FOR_PICKUP: "violet",
  READY_FOR_DELIVERY: "violet",
  DELIVERED: "green",
  CANCELLED: "red",
  REFUND_PENDING: "orange",
  UNPAID: "amber",
  PAID: "green",
  FAILED: "red",
  CANCELED: "gray",
  REFUNDED: "gray",
  IN_STOCK: "green",
  LOW_STOCK: "amber",
  OUT_OF_STOCK: "red",
  ACTIVE: "green",
  INACTIVE: "gray",
};

const STATUS_LABELS: Record<string, string> = {
  ...ORDER_STATUS_LABELS,
  ...PAYMENT_STATUS_LABELS,
  ...STOCK_STATUS_LABELS,
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        TONE_CLASSES[STATUS_TONES[status] ?? "gray"],
        className,
      )}
    >
      {label ?? STATUS_LABELS[status] ?? status}
    </span>
  );
}

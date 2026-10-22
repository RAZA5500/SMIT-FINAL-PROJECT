import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, STOCK_STATUS_LABELS } from "@/constants/labels";
import { cn } from "@/lib/utils";

export type StatusTone = "success" | "warning" | "danger" | "info" | "progress" | "refund" | "neutral";

const TONE_CLASSES: Record<StatusTone, { badge: string; dot: string }> = {
  success: { badge: "bg-emerald-50 text-emerald-800 ring-emerald-600/15", dot: "bg-emerald-500" },
  warning: { badge: "bg-amber-50 text-amber-800 ring-amber-600/20", dot: "bg-amber-500" },
  danger: { badge: "bg-red-50 text-red-700 ring-red-600/15", dot: "bg-red-500" },
  info: { badge: "bg-sky-50 text-sky-800 ring-sky-600/15", dot: "bg-sky-500" },
  progress: { badge: "bg-violet-50 text-violet-800 ring-violet-600/15", dot: "bg-violet-500" },
  refund: { badge: "bg-orange-50 text-orange-800 ring-orange-600/20", dot: "bg-orange-500" },
  neutral: { badge: "bg-stone-100 text-stone-700 ring-stone-500/15", dot: "bg-stone-400" },
};

/** Har status ka tone ek jagah — orders, payments, stock, active/inactive */
const STATUS_TONES: Record<string, StatusTone> = {
  PENDING: "warning",
  CONFIRMED: "info",
  PROCESSING: "progress",
  READY_FOR_PICKUP: "progress",
  READY_FOR_DELIVERY: "progress",
  DELIVERED: "success",
  CANCELLED: "danger",
  REFUND_PENDING: "refund",
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
  /** Jo status upar ki list mein nahi (e.g. sample screens) — tone khud batao */
  tone?: StatusTone;
  className?: string;
}

export function StatusBadge({ status, label, tone: toneOverride, className }: StatusBadgeProps) {
  const tone = TONE_CLASSES[toneOverride ?? STATUS_TONES[status] ?? "neutral"];
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        tone.badge,
        className,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", tone.dot)} aria-hidden="true" />
      {label ?? STATUS_LABELS[status] ?? status}
    </span>
  );
}

import type { VariantProps } from "class-variance-authority";
import { Badge, type badgeVariants } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, STOCK_STATUS_LABELS } from "@/constants/labels";
import { cn } from "@/lib/utils";

export type StatusTone = "success" | "warning" | "danger" | "info" | "brand" | "neutral";

const TONES: Record<StatusTone, { variant: VariantProps<typeof badgeVariants>["variant"]; dot: string }> = {
  success: { variant: "success", dot: "bg-success" },
  warning: { variant: "warning", dot: "bg-warning" },
  danger: { variant: "destructive", dot: "bg-destructive" },
  info: { variant: "info", dot: "bg-info" },
  brand: { variant: "outline", dot: "bg-primary" },
  neutral: { variant: "outline", dot: "bg-muted-foreground/50" },
};

/** Har status ka tone ek jagah — orders, payments, stock, active/inactive */
const STATUS_TONES: Record<string, StatusTone> = {
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

/** Receipt-style status pill: coloured dot + mono uppercase label */
export function StatusBadge({ status, label, tone: toneOverride, className }: StatusBadgeProps) {
  const tone = TONES[toneOverride ?? STATUS_TONES[status] ?? "neutral"];
  return (
    <Badge
      variant={tone.variant}
      className={cn("font-mono text-xs tracking-wide uppercase", className)}
    >
      <Box as="span" aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", tone.dot)} />
      {label ?? STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

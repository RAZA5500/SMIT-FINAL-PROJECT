import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { STATUS_LABELS, STATUS_TONES, type StatusTone } from "@/constants/status";
import { cn } from "@/lib/utils";

export type { StatusTone };

const TONES: Record<StatusTone, { variant: "success" | "warning" | "destructive" | "info" | "brand" | "neutral"; dot: string }> = {
  success: { variant: "success", dot: "bg-success" },
  warning: { variant: "warning", dot: "bg-warning" },
  danger: { variant: "destructive", dot: "bg-destructive" },
  info: { variant: "info", dot: "bg-info" },
  brand: { variant: "brand", dot: "bg-primary" },
  neutral: { variant: "neutral", dot: "bg-muted-foreground/60" },
};

interface StatusBadgeProps {
  /** Order, payment, stock ya ACTIVE/INACTIVE — tone `constants/status.ts` se */
  status: string;
  label?: string;
  /** Jo status map mein nahi — tone khud batao */
  tone?: StatusTone;
  className?: string;
}

/** Scannable status pill: coloured dot + label (orders, payments, inventory) */
export function StatusBadge({ status, label, tone: toneOverride, className }: StatusBadgeProps) {
  const tone = TONES[toneOverride ?? STATUS_TONES[status] ?? "neutral"];
  return (
    <Badge variant={tone.variant} className={cn("gap-1.5 pr-3 pl-2.5", className)}>
      <Box as="span" aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", tone.dot)} />
      {label ?? STATUS_LABELS[status] ?? status}
    </Badge>
  );
}

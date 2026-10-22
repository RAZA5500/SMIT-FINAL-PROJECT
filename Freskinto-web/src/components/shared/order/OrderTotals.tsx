import { cn, formatMoney } from "@/lib/utils";

interface OrderTotalsProps {
  subtotal: string;
  shippingCost: string;
  total: string;
  /** "Delivery" ya "Collection" */
  shippingLabel?: string;
  /** Subtotal ka label (e.g. "Subtotal (3 items)") */
  subtotalLabel?: string;
  /** Sirf jab API discount de — warna row nahi dikhti */
  discount?: string | null;
  className?: string;
}

/** Server ke totals (client kuch calculate nahi karta) — Free shipping highlight */
export function OrderTotals({
  subtotal,
  shippingCost,
  total,
  shippingLabel = "Delivery",
  subtotalLabel = "Subtotal",
  discount,
  className,
}: OrderTotalsProps) {
  const free = Number(shippingCost) === 0;
  const hasDiscount = discount !== undefined && discount !== null && Number(discount) > 0;

  return (
    <dl className={cn("flex flex-col gap-2 text-sm", className)}>
      <div className="flex items-center justify-between gap-4">
        <dt className="text-muted-foreground">{subtotalLabel}</dt>
        <dd className="numeric font-medium text-foreground">{formatMoney(subtotal)}</dd>
      </div>
      {hasDiscount && (
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Discount</dt>
          <dd className="numeric font-medium text-brand-green">−{formatMoney(discount ?? 0)}</dd>
        </div>
      )}
      <div className="flex items-center justify-between gap-4">
        <dt className="text-muted-foreground">{shippingLabel}</dt>
        <dd className={cn("numeric font-medium", free ? "text-brand-green" : "text-foreground")}>
          {free ? "Free" : formatMoney(shippingCost)}
        </dd>
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-dashed border-input pt-3">
        <dt className="font-semibold text-foreground">Total</dt>
        <dd className="numeric font-heading text-fs-24 font-semibold text-foreground">{formatMoney(total)}</dd>
      </div>
    </dl>
  );
}

import { Flex, Stack } from "@/components/ui/flex";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/typography";
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

function TotalRow({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <Flex align="center" justify="between" gap="4">
      <Text as="dt" tone="muted">
        {label}
      </Text>
      <Text as="dd" weight="medium" numeric className={cn(valueClassName)}>
        {value}
      </Text>
    </Flex>
  );
}

/** Server ke totals (client kuch calculate nahi karta) — free delivery green mein */
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
    <Stack as="dl" gap="2" className={cn("text-sm", className)}>
      <TotalRow label={subtotalLabel} value={formatMoney(subtotal)} />
      {hasDiscount && (
        <TotalRow label="Discount" value={`−${formatMoney(discount ?? 0)}`} valueClassName="text-success-ink" />
      )}
      <TotalRow
        label={shippingLabel}
        value={free ? "Free" : formatMoney(shippingCost)}
        valueClassName={cn(free && "text-success-ink")}
      />
      <Separator className="my-1.5" />
      <Flex align="baseline" justify="between" gap="4">
        <Text as="dt" weight="semibold">
          Total
        </Text>
        <Text as="dd" weight="semibold" numeric className="font-display text-2xl tracking-[-0.04em]">
          {formatMoney(total)}
        </Text>
      </Flex>
    </Stack>
  );
}

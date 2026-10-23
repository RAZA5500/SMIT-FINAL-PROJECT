import { Text } from "@/components/ui/typography";
import { cn, formatMoney } from "@/lib/utils";

const PRICE_SIZES = {
  sm: "text-sm font-bold",
  md: "text-base font-bold",
  lg: "font-display text-lg font-semibold tracking-[-0.03em]",
  xl: "font-display text-4xl font-semibold tracking-[-0.045em]",
} as const;

interface PriceProps {
  /** API money string ("12.50") — UI sirf format karti hai, hisaab nahi */
  amount: string | number;
  size?: keyof typeof PRICE_SIZES;
  tone?: "brand" | "default";
  className?: string;
}

/** Inline price — Unbounded figures at the bigger sizes, tabular so updating totals don't jiggle */
export function Price({ amount, size = "md", tone = "default", className }: PriceProps) {
  return (
    <Text
      as="span"
      numeric
      tone={tone === "brand" ? "primary" : "default"}
      className={cn("leading-none", PRICE_SIZES[size], className)}
    >
      {formatMoney(amount)}
    </Text>
  );
}

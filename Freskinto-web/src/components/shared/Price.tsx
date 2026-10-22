import { Text } from "@/components/ui/typography";
import { cn, formatMoney } from "@/lib/utils";

const PRICE_SIZES = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-3xl",
} as const;

interface PriceProps {
  /** API money string ("12.50") — UI sirf format karti hai, hisaab nahi */
  amount: string | number;
  size?: keyof typeof PRICE_SIZES;
  tone?: "brand" | "default";
  className?: string;
}

/** Inline price — semibold, tabular so updating totals don't jiggle */
export function Price({ amount, size = "md", tone = "default", className }: PriceProps) {
  return (
    <Text
      as="span"
      weight="semibold"
      numeric
      tone={tone === "brand" ? "primary" : "default"}
      className={cn("leading-none tracking-tight", PRICE_SIZES[size], className)}
    >
      {formatMoney(amount)}
    </Text>
  );
}

import { Text } from "@/components/ui/typography";
import { cn, formatMoney } from "@/lib/utils";

const PRICE_SIZES = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
  xl: "text-4xl",
} as const;

interface PriceProps {
  /** API money string ("12.50") — UI sirf format karti hai, hisaab nahi */
  amount: string | number;
  size?: keyof typeof PRICE_SIZES;
  tone?: "brand" | "default";
  className?: string;
}

/** Inline price — chunky display figures, tabular so updating totals don't jiggle */
export function Price({ amount, size = "md", tone = "default", className }: PriceProps) {
  return (
    <Text
      as="span"
      family="heading"
      weight="extrabold"
      numeric
      tone={tone === "brand" ? "primary" : "default"}
      className={cn("leading-none tracking-tight", PRICE_SIZES[size], className)}
    >
      {formatMoney(amount)}
    </Text>
  );
}

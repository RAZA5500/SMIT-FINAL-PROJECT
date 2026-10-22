import { cn, formatMoney } from "@/lib/utils";

const PRICE_SIZES = {
  sm: "text-fs-14",
  md: "text-fs-18",
  lg: "text-fs-24",
  xl: "text-fs-32",
} as const;

interface PriceProps {
  /** API money string ("12.50") — UI sirf format karti hai, hisaab nahi */
  amount: string | number;
  size?: keyof typeof PRICE_SIZES;
  tone?: "brand" | "default";
  className?: string;
}

/** Inline price — tabular figures so updating totals don't jiggle */
export function Price({ amount, size = "md", tone = "default", className }: PriceProps) {
  return (
    <span
      className={cn(
        "numeric leading-none font-semibold tracking-tight",
        tone === "brand" ? "text-brand-green" : "text-foreground",
        PRICE_SIZES[size],
        className,
      )}
    >
      {formatMoney(amount)}
    </span>
  );
}

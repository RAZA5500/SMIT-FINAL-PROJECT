import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

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

/** Inline price — tabular figures so updating totals don't jiggle */
export function Price({ amount, size = "md", tone = "brand", className }: PriceProps) {
  return (
    <Text
      as="span"
      numeric
      weight="semibold"
      tone={tone === "brand" ? "brand" : "default"}
      className={cn("leading-none tracking-tight", PRICE_SIZES[size], className)}
    >
      {formatMoney(amount)}
    </Text>
  );
}

interface ShelfLabelProps {
  amount: string | number;
  /** Small mono line under the price, e.g. "each" or "min. 2" */
  caption?: string;
  size?: "md" | "lg";
  className?: string;
}

/** Shelf-edge price label — emerald edge, big price, mono caption */
export function ShelfLabel({ amount, caption = "each", size = "md", className }: ShelfLabelProps) {
  return (
    <Flex
      align="stretch"
      className={cn("w-fit overflow-hidden rounded-lg border border-border/80 bg-background shadow-xs", className)}
    >
      <Box aria-hidden="true" className={cn("w-1.5 shrink-0 bg-brand-green")} />
      <Stack gap="1" className={cn(size === "lg" ? "px-4 py-2.5" : "px-3 py-1.5")}>
        <Price amount={amount} size={size === "lg" ? "xl" : "lg"} tone="brand" className={cn("font-bold text-brand-green")} />
        <Text as="span" variant="small" tone="muted" className={cn("text-xs font-medium leading-none")}>
          {caption}
        </Text>
      </Stack>
    </Flex>
  );
}

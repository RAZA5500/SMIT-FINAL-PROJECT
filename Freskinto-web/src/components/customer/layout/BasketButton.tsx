"use client";

import { ShoppingBasket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";
import { formatMoney, pluralize } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useGetCart } from "@/services/cart/queries";
import { useUiStore } from "@/stores/ui-store";

/** Header basket pill — count + subtotal; basket drawer kholta hai */
export function BasketButton({ className }: { className?: string }) {
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const { data: cart } = useGetCart();
  const count = cart?.itemCount ?? 0;

  return (
    <Button
      variant="default"
      onClick={() => setCartOpen(true)}
      aria-label={`Open basket, ${pluralize(count, "item")}`}
      className={cn("h-10 gap-2.5 pr-4 pl-3.5 shadow-sm font-semibold", className)}
    >
      <Box as="span" className={cn("relative inline-flex")}>
        <ShoppingBasket aria-hidden="true" className={cn("size-5")} />
        {count > 0 && (
          // key — count badalne par bump animation dobara chale
          <Badge
            key={count}
            className={cn(
              "absolute -top-2.5 -right-3 h-5 min-w-5 animate-bump px-1 text-xs font-bold tabular-nums ring-2 ring-white bg-brand-orange text-white",
            )}
          >
            {count}
          </Badge>
        )}
      </Box>
      <Text as="span" weight="semibold" numeric className={cn("hidden sm:inline")}>
        {cart ? formatMoney(cart.subtotal) : "Basket"}
      </Text>
    </Button>
  );
}

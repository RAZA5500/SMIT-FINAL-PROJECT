"use client";

import { ShoppingBasket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { cn, formatMoney, pluralize } from "@/lib/utils";
import { useGetCart } from "@/services/cart/queries";
import { useShopStore } from "@/stores/shop-store";

/** Header basket pill — count bubble + subtotal; slide-over CartPanel kholta hai */
export function BasketButton({ className }: { className?: string }) {
  const setCartOpen = useShopStore((state) => state.setCartOpen);
  const { data: cart } = useGetCart();
  const count = cart?.itemCount ?? 0;

  return (
    <Button
      variant="cta"
      onClick={() => setCartOpen(true)}
      aria-label={`Open basket, ${pluralize(count, "item")}`}
      className={cn("h-11 gap-2.5 pr-4 pl-3.5", className)}
    >
      <Flex as="span" className="relative">
        <ShoppingBasket aria-hidden="true" className="size-5" />
        {count > 0 && (
          // key — count badalne par bump animation dobara chale
          <Badge
            key={count}
            variant="night"
            className="absolute -top-2.5 -right-3 h-5 min-w-5 animate-bump px-1 text-xs font-bold tabular-nums ring-2 ring-tangerine"
          >
            {count}
          </Badge>
        )}
      </Flex>
      <Text as="span" tone="inherit" weight="bold" numeric className="hidden sm:inline">
        {cart ? formatMoney(cart.subtotal) : "Basket"}
      </Text>
    </Button>
  );
}

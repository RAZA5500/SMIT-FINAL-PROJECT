"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { cn, formatMoney, pluralize } from "@/lib/utils";
import { useGetCart } from "@/services/cart/queries";
import { useShopStore } from "@/stores/shop-store";

/**
 * Header basket — gradient pill: bag, subtotal, count bubble. `data-basket-target`: "add to
 * basket" par product ki photo yahin udd kar aati hai (lib/fly-to-basket).
 */
export function BasketButton({ className }: { className?: string }) {
  const setCartOpen = useShopStore((state) => state.setCartOpen);
  const { data: cart } = useGetCart();
  const count = cart?.itemCount ?? 0;

  return (
    <Button
      variant="fresh"
      data-basket-target=""
      onClick={() => setCartOpen(true)}
      aria-label={`Open basket, ${pluralize(count, "item")}`}
      className={cn("h-11 gap-2 pr-1.5 pl-3.5 sm:pl-4", count === 0 && "pr-3.5 sm:pr-4", className)}
    >
      <ShoppingBag aria-hidden="true" className="size-[1.15rem]" />
      <Text as="span" tone="inherit" weight="bold" numeric className="hidden sm:inline">
        {cart ? formatMoney(cart.subtotal) : "Basket"}
      </Text>
      {count > 0 && (
        // key — count badalne par bump animation dobara chale
        <Flex
          as="span"
          key={count}
          align="center"
          justify="center"
          className="size-8 animate-bump rounded-full bg-[#06100b] text-xs font-bold text-white tabular-nums"
        >
          {count}
        </Flex>
      )}
    </Button>
  );
}

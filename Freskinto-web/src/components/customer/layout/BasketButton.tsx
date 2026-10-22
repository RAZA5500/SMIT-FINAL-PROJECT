"use client";

import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";
import { cn, formatMoney, pluralize } from "@/lib/utils";
import { useGetCart } from "@/services/cart/queries";
import { useShopStore } from "@/stores/shop-store";

/** Header basket button — bag icon, item count and subtotal; slide-over CartPanel kholta hai */
export function BasketButton({ className }: { className?: string }) {
  const setCartOpen = useShopStore((state) => state.setCartOpen);
  const { data: cart } = useGetCart();
  const count = cart?.itemCount ?? 0;

  return (
    <Button
      variant="outline"
      onClick={() => setCartOpen(true)}
      aria-label={`Open basket, ${pluralize(count, "item")}`}
      className={cn("gap-2 px-3", className)}
    >
      <ShoppingBag aria-hidden="true" />
      <Text as="span" tone="inherit" weight="medium" numeric className="hidden sm:inline">
        {cart ? formatMoney(cart.subtotal) : "Basket"}
      </Text>
      {count > 0 && (
        // key — count badalne par bump animation dobara chale
        <Badge key={count} className="h-5 min-w-5 animate-bump rounded-full px-1.5 tabular-nums">
          {count}
        </Badge>
      )}
    </Button>
  );
}

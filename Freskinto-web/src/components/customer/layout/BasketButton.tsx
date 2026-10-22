"use client";

import { ShoppingBasket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatMoney, pluralize } from "@/lib/utils";
import { useGetCart } from "@/services/cart/queries";
import { useShopStore } from "@/stores/shop-store";

/** Header basket pill — count + subtotal; slide-over CartPanel kholta hai */
export function BasketButton({ className }: { className?: string }) {
  const setCartOpen = useShopStore((state) => state.setCartOpen);
  const { data: cart } = useGetCart();
  const count = cart?.itemCount ?? 0;

  return (
    <Button
      variant="cta"
      onClick={() => setCartOpen(true)}
      aria-label={`Open basket, ${pluralize(count, "item")}`}
      className={cn("h-10 gap-2.5 pr-4 pl-3.5", className)}
    >
      <span className="relative inline-flex">
        <ShoppingBasket aria-hidden="true" className="size-5" />
        {count > 0 && (
          // key — count badalne par bump animation dobara chale
          <Badge
            key={count}
            variant="sale"
            className="absolute -top-2.5 -right-3 h-5 min-w-5 animate-bump px-1 text-xs font-bold tabular-nums ring-2 ring-background"
          >
            {count}
          </Badge>
        )}
      </span>
      <span className="numeric hidden font-semibold sm:inline">{cart ? formatMoney(cart.subtotal) : "Basket"}</span>
    </Button>
  );
}

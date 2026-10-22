"use client";

import { ShoppingBasket } from "lucide-react";
import { formatMoney, pluralize } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useGetCart } from "@/services/cart/queries";
import { useUiStore } from "@/stores/ui-store";

/** Header basket pill — count + subtotal; khulta hai drawer */
export function CartButton({ className }: { className?: string }) {
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const { data: cart } = useGetCart();
  const count = cart?.itemCount ?? 0;

  return (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      aria-label={`Open basket, ${pluralize(count, "item")}`}
      className={cn(
        "group/cart relative inline-flex h-11 items-center gap-2.5 rounded-full bg-primary pr-4 pl-3 text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none",
        className,
      )}
    >
      <span className="relative">
        <ShoppingBasket className="size-5" aria-hidden="true" />
        {count > 0 && (
          // key — count badalne par bump animation dobara chale
          <span
            key={count}
            className="numeric absolute -top-2 -right-2.5 flex h-4.5 min-w-4.5 animate-bump items-center justify-center rounded-full bg-white px-1 text-xs leading-none font-bold text-brand ring-2 ring-primary"
          >
            {count}
          </span>
        )}
      </span>
      <span className="numeric hidden text-sm font-semibold sm:inline">
        {cart ? formatMoney(cart.subtotal) : "Basket"}
      </span>
    </button>
  );
}

import { Lock, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { ProductImage } from "@/components/shared/ProductImage";
import { formatMoney, pluralize } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ICart } from "@/services/cart/types";

interface CartSummaryProps {
  cart: ICart;
  title?: string;
  /** Checkout/payment par items ki read-only list bhi */
  showItems?: boolean;
  /** Action buttons (checkout, pay) */
  children?: ReactNode;
  className?: string;
}

/**
 * Totals hamesha backend ke — UI hisaab nahi lagati. Delivery backend par 0 hai
 * (shipping = 0), is liye "Free" likhna sach hai. Final total order banne par server tay karta hai.
 */
export function CartSummary({ cart, title = "Order summary", showItems = false, children, className }: CartSummaryProps) {
  return (
    <section
      aria-label={title}
      className={cn("flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border sm:p-6", className)}
    >
      <h2 className="text-lg font-bold">{title}</h2>

      {showItems && (
        <ul className="flex max-h-72 flex-col gap-3 overflow-y-auto scrollbar-thin pr-1">
          {cart.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 text-sm">
              <div className="relative shrink-0">
                <ProductImage name={item.name} sizes="48px" className="size-12 rounded-lg" imageClassName="p-1" />
                <span className="numeric absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
                  {item.quantity}
                </span>
              </div>
              <span className="min-w-0 flex-1 truncate text-foreground">{item.name}</span>
              <span className="numeric shrink-0 font-medium">{formatMoney(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
      )}

      <dl className={cn("flex flex-col gap-2.5 text-sm", showItems && "border-t border-dashed pt-4")}>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">
            Subtotal ({pluralize(cart.itemCount, "item")})
          </dt>
          <dd className="numeric font-medium">{formatMoney(cart.subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Truck className="size-4" aria-hidden="true" />
            Delivery
          </dt>
          <dd className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">Free</dd>
        </div>
        <div className="mt-1 flex items-center justify-between border-t pt-3.5">
          <dt className="font-semibold">Total</dt>
          <dd className="numeric font-heading text-2xl font-bold">{formatMoney(cart.grandTotal)}</dd>
        </div>
      </dl>

      {children && <div className="flex flex-col gap-2.5">{children}</div>}

      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3.5" aria-hidden="true" />
        No delivery charges or hidden fees
      </p>
    </section>
  );
}

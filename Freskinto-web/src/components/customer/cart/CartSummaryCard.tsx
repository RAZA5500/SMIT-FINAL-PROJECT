import { PackageCheck, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/shared/Logo";
import { OrderTotals } from "@/components/shared/order/OrderTotals";
import { STORE } from "@/constants/store";
import { cn, formatMoney, pluralize } from "@/lib/utils";
import type { ICart } from "@/services/cart/types";

interface CartSummaryCardProps {
  cart: ICart;
  title?: string;
  /** Checkout/payment par items ki read-only list bhi */
  showItems?: boolean;
  /** Sirf jab API discount de (abhi nahi) — row tab hi dikhti hai */
  discount?: string | null;
  /** Action buttons (checkout, pay) — card ke andar */
  children?: ReactNode;
  className?: string;
}

/**
 * Basket totals as a till receipt. Totals hamesha backend ke — UI hisaab nahi lagati.
 * Delivery backend par 0 hai (shipping = 0), is liye "Free"; final total order banne par
 * server tay karta hai.
 */
export function CartSummaryCard({
  cart,
  title = "Order summary",
  showItems = false,
  discount,
  children,
  className,
}: CartSummaryCardProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        "flex flex-col gap-5 rounded-15 border border-border bg-card p-5 shadow-soft sm:p-6",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <LogoMark size="sm" />
        <div className="flex flex-col">
          <h2 className="font-heading text-fs-18 font-semibold">{title}</h2>
          <p className="text-fs-12 text-muted-foreground">
            {STORE.name} · {pluralize(cart.itemCount, "item")}
          </p>
        </div>
      </div>

      {showItems && (
        <ul className="scrollbar-thin flex max-h-64 flex-col gap-2.5 overflow-y-auto border-y border-dashed border-input py-4 pr-1 text-sm">
          {cart.items.map((item) => (
            <li key={item.id} className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 text-foreground">
                <span className="font-mono text-fs-12 text-muted-foreground">{item.quantity}×</span> {item.name}
              </span>
              <span className="numeric shrink-0 font-medium">{formatMoney(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
      )}

      <OrderTotals
        subtotalLabel={`Subtotal (${pluralize(cart.itemCount, "item")})`}
        subtotal={cart.subtotal}
        shippingCost="0"
        discount={discount}
        total={cart.grandTotal}
      />

      {children && <div className="flex flex-col gap-2.5">{children}</div>}

      <ul className="flex flex-col gap-2 rounded-xl bg-brand-soft p-3.5 text-fs-13 text-brand-green-dark">
        <li className="flex items-center gap-2">
          <Truck aria-hidden="true" className="size-4 shrink-0" />
          Free delivery on every order — no minimum spend
        </li>
        <li className="flex items-center gap-2">
          <PackageCheck aria-hidden="true" className="size-4 shrink-0" />
          Cancel any time before we start packing
        </li>
      </ul>
    </section>
  );
}

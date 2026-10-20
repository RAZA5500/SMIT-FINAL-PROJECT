import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatMoney } from "@/lib/format";
import type { ICart } from "@/services/cart/types";

interface CartSummaryProps {
  cart: ICart;
  title?: string;
  /** Checkout/payment par items ki read-only list bhi */
  showItems?: boolean;
  /** Action buttons (checkout, pay) */
  children?: ReactNode;
}

/** Totals hamesha backend ke — UI hisaab nahi lagati. Final total order banne par server tay karta hai. */
export function CartSummary({ cart, title = "Order Summary", showItems = false, children }: CartSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {showItems && (
          <>
            <ul className="flex flex-col gap-2">
              {cart.items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                  <span className="min-w-0 text-gray-700">
                    <span className="block truncate">{item.name}</span>
                    <span className="text-xs text-gray-500">
                      {item.quantity} × {formatMoney(item.price)}
                    </span>
                  </span>
                  <span className="shrink-0 font-medium text-price-text">{formatMoney(item.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <Separator />
          </>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-summary-label">
            Subtotal ({cart.itemCount} {cart.itemCount === 1 ? "item" : "items"})
          </span>
          <span className="font-medium text-price-text">{formatMoney(cart.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-summary-divider pt-3">
          <span className="text-sm font-semibold text-summary-label">Total</span>
          <span className="text-lg font-bold text-brand-green">{formatMoney(cart.grandTotal)}</span>
        </div>
        {children && <div className="flex flex-col gap-2 pt-1">{children}</div>}
      </CardContent>
    </Card>
  );
}

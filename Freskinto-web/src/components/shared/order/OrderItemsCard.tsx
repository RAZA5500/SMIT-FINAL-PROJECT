import { formatMoney } from "@/lib/format";
import type { IOrder } from "@/services/orders/types";
import { ProductImage } from "../ProductImage";

/** Order ke items (order ke waqt ka name/price snapshot) + server ke totals */
export function OrderItemsCard({ order }: { order: IOrder }) {
  const freeShipping = Number(order.shippingCost) === 0;

  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border sm:p-6">
      <h2 className="text-lg font-bold">
        Items <span className="font-sans text-sm font-medium text-muted-foreground">({order.items.length})</span>
      </h2>

      <ul className="flex flex-col divide-y">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0">
            <ProductImage name={item.productName} sizes="56px" className="size-14 shrink-0 rounded-xl" imageClassName="p-1" />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold">{item.productName}</span>
              <span className="text-xs text-muted-foreground">
                <span className="numeric">
                  {item.quantity} × {formatMoney(item.price)}
                </span>{" "}
                · {item.sku}
              </span>
            </div>
            <span className="numeric text-sm font-semibold">{formatMoney(item.subtotal)}</span>
          </li>
        ))}
      </ul>

      <dl className="ml-auto flex w-full max-w-xs flex-col gap-2 border-t pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="numeric font-medium">{formatMoney(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{order.deliveryType === "PICKUP" ? "Collection" : "Delivery"}</dt>
          <dd className={freeShipping ? "font-semibold text-brand" : "numeric font-medium"}>
            {freeShipping ? "Free" : formatMoney(order.shippingCost)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t pt-2.5">
          <dt className="font-semibold">Total</dt>
          <dd className="numeric font-heading text-xl font-bold">{formatMoney(order.total)}</dd>
        </div>
      </dl>
    </section>
  );
}

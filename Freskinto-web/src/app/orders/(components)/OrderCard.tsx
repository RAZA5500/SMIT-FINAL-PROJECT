import { ArrowRight, Clock, Store, Truck } from "lucide-react";
import { OrderProgress } from "@/components/shared/order/OrderProgress";
import { Price } from "@/components/shared/Price";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TextLink } from "@/components/shared/TextLink";
import { DELIVERY_TYPE_LABELS } from "@/constants/labels";
import { customerRoutes } from "@/lib/routes/routes";
import { formatDateTime, pluralize } from "@/lib/utils";
import type { IOrderSummary } from "@/services/orders/types";

/** Order history ka "ticket" — poora card order detail ka link (stretched link) */
export function OrderCard({ order }: { order: IOrderSummary }) {
  const awaitingPayment =
    order.status === "PENDING" && (order.paymentStatus === "UNPAID" || order.paymentStatus === "FAILED");
  const DeliveryIcon = order.deliveryType === "PICKUP" ? Store : Truck;

  return (
    <article className="group/order relative overflow-hidden rounded-15 border border-border bg-card shadow-soft transition duration-300 hover:-translate-y-0.5 hover:border-brand-green/30 hover:shadow-lift">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h3 className="font-heading text-fs-18 font-semibold tracking-tight">
            <TextLink
              href={customerRoutes.orderDetail(order.id)}
              tone="default"
              className="after:absolute after:inset-0 hover:no-underline"
            >
              {order.orderNumber}
            </TextLink>
          </h3>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-fs-13 text-muted-foreground">
            <span className="numeric">{formatDateTime(order.createdAt)}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <DeliveryIcon aria-hidden="true" className="size-3.5" />
              {DELIVERY_TYPE_LABELS[order.deliveryType]}
            </span>
            <span aria-hidden="true">·</span>
            <span>{pluralize(order.itemCount, "item")}</span>
          </p>
        </div>
        <Price amount={order.total} size="lg" className="font-heading" />
      </div>

      <div className="px-5 py-5">
        <OrderProgress status={order.status} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-input bg-modal-footer px-5 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={order.status} />
          <StatusBadge status={order.paymentStatus} />
        </div>
        {awaitingPayment ? (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-warning-ink">
            <Clock aria-hidden="true" className="size-4" />
            Awaiting payment — open to pay
          </span>
        ) : (
          <span className="flex items-center gap-1 text-sm font-semibold text-brand-green">
            View details
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover/order:translate-x-0.5" />
          </span>
        )}
      </div>
    </article>
  );
}

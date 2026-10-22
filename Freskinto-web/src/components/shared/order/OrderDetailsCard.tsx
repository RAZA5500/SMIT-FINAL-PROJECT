import { CalendarClock, MapPin, NotebookPen, Store, Truck, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { CANCELLATION_REASON_LABELS, DELIVERY_TYPE_LABELS } from "@/constants/labels";
import { formatDateTime } from "@/lib/format";
import type { IOrder } from "@/services/orders/types";

function DetailRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground [&_svg]:size-4">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-sm text-foreground">{children}</span>
      </div>
    </div>
  );
}

/** Delivery/pickup, customer, notes aur cancellation ki wajah */
export function OrderDetailsCard({ order, showCustomer = false }: { order: IOrder; showCustomer?: boolean }) {
  const pickup = order.deliveryType === "PICKUP";

  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border sm:p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        {pickup ? <Store className="size-5 text-brand" aria-hidden="true" /> : <Truck className="size-5 text-brand" aria-hidden="true" />}
        {DELIVERY_TYPE_LABELS[order.deliveryType]}
      </h2>
      <div className="flex flex-col gap-4">
        {showCustomer && (
          <DetailRow icon={<UserRound aria-hidden="true" />} label="Customer">
            {order.customer.name}
            <span className="block truncate text-xs text-muted-foreground">{order.customer.email}</span>
          </DetailRow>
        )}
        {pickup ? (
          <DetailRow icon={<CalendarClock aria-hidden="true" />} label="Collection time">
            {formatDateTime(order.pickupScheduledAt)}
          </DetailRow>
        ) : (
          order.address && (
            <DetailRow icon={<MapPin aria-hidden="true" />} label="Delivery address">
              {order.address.addressLine}, {order.address.city}, {order.address.county}, {order.address.postcode}
            </DetailRow>
          )
        )}
        {order.customerNotes && (
          <DetailRow icon={<NotebookPen aria-hidden="true" />} label="Notes">
            {order.customerNotes}
          </DetailRow>
        )}
        {order.cancellationReason && (
          <div className="rounded-xl bg-tomato-soft px-4 py-3 text-sm text-destructive">
            <p className="font-semibold">
              Cancelled: {CANCELLATION_REASON_LABELS[order.cancellationReason] ?? order.cancellationReason}
            </p>
            {order.cancellationNote && <p className="mt-0.5 text-destructive/80">{order.cancellationNote}</p>}
          </div>
        )}
      </div>
    </section>
  );
}

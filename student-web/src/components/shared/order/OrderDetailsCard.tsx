import { CalendarClock, MapPin, NotebookPen, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CANCELLATION_REASON_LABELS, DELIVERY_TYPE_LABELS } from "@/constants/labels";
import { formatDateTime } from "@/lib/format";
import type { IOrder } from "@/services/orders/types";

/** Delivery/pickup, customer, notes aur cancellation ki wajah */
export function OrderDetailsCard({ order, showCustomer = false }: { order: IOrder; showCustomer?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-900">
          {DELIVERY_TYPE_LABELS[order.deliveryType]}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm text-gray-700">
        {showCustomer && (
          <p className="flex items-start gap-2">
            <User className="mt-0.5 size-4 shrink-0 text-brand-green" aria-hidden="true" />
            <span>
              {order.customer.name}
              <span className="block text-xs text-gray-500">{order.customer.email}</span>
            </span>
          </p>
        )}
        {order.deliveryType === "PICKUP" ? (
          <p className="flex items-center gap-2">
            <CalendarClock className="size-4 shrink-0 text-brand-green" aria-hidden="true" />
            Pickup at {formatDateTime(order.pickupScheduledAt)}
          </p>
        ) : (
          order.address && (
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-green" aria-hidden="true" />
              <span>
                {order.address.addressLine}, {order.address.city}, {order.address.county},{" "}
                {order.address.postcode}
              </span>
            </p>
          )
        )}
        {order.customerNotes && (
          <p className="flex items-start gap-2">
            <NotebookPen className="mt-0.5 size-4 shrink-0 text-brand-green" aria-hidden="true" />
            {order.customerNotes}
          </p>
        )}
        {order.cancellationReason && (
          <div className="rounded-10 bg-red-50 px-3 py-2 text-xs text-red-700">
            <p className="font-medium">
              Cancelled: {CANCELLATION_REASON_LABELS[order.cancellationReason] ?? order.cancellationReason}
            </p>
            {order.cancellationNote && <p className="mt-0.5">{order.cancellationNote}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { CalendarClock, MapPin, NotebookPen, Store, Truck } from "lucide-react";
import Link from "next/link";
import { DELIVERY_TYPE_LABELS } from "@/constants/labels";
import { formatDateTime } from "@/lib/format";
import { customerRoutes } from "@/lib/routes/routes";
import { useGetAddresses } from "@/services/addresses/queries";
import type { ICreateOrderPayload } from "@/services/orders/types";

const ADDRESS_LIST_LIMIT = 100;

/** Checkout intent ka khulasa — saved address ka text address book se */
export function DeliveryDetails({ intent }: { intent: ICreateOrderPayload }) {
  const { data: addresses } = useGetAddresses({ limit: ADDRESS_LIST_LIMIT });
  const saved = addresses?.data.find((address) => address.id === intent.addressId);
  const address = intent.shippingAddress ?? saved;
  const pickup = intent.deliveryType === "PICKUP";

  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 text-lg font-bold">
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
            {pickup ? <Store className="size-5" aria-hidden="true" /> : <Truck className="size-5" aria-hidden="true" />}
          </span>
          {DELIVERY_TYPE_LABELS[intent.deliveryType]}
        </h2>
        <Link href={customerRoutes.checkout} className="text-sm font-semibold text-brand hover:underline">
          Change
        </Link>
      </div>
      <div className="flex flex-col gap-3 text-sm">
        {pickup ? (
          <p className="flex items-center gap-2.5">
            <CalendarClock className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            Collect on <span className="font-semibold">{formatDateTime(intent.pickupScheduledAt)}</span>
          </p>
        ) : (
          <p className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            {address ? (
              <span>
                {address.addressLine}, {address.city}, {address.county}, {address.postcode}
              </span>
            ) : (
              <span className="text-muted-foreground">Saved address</span>
            )}
          </p>
        )}
        {intent.customerNotes && (
          <p className="flex items-start gap-2.5 text-muted-foreground">
            <NotebookPen className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {intent.customerNotes}
          </p>
        )}
      </div>
    </section>
  );
}

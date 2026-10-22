"use client";

import { CalendarClock, MapPin, NotebookPen, Store, Truck } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { InfoRow } from "@/components/shared/InfoRow";
import { LOOKUP_LIMIT } from "@/constants/filters";
import { DELIVERY_TYPE_LABELS } from "@/constants/labels";
import { customerRoutes } from "@/lib/routes/routes";
import { formatDateTime } from "@/lib/utils";
import { useGetAddresses } from "@/services/addresses/queries";
import type { ICreateOrderPayload } from "@/services/orders/types";

/** Checkout intent ka khulasa — saved address ka text address book se */
export function DeliveryDetails({ intent }: { intent: ICreateOrderPayload }) {
  const { data: addresses } = useGetAddresses({ limit: LOOKUP_LIMIT });
  const saved = addresses?.data.find((address) => address.id === intent.addressId);
  const address = intent.shippingAddress ?? saved;
  const pickup = intent.deliveryType === "PICKUP";
  const TypeIcon = pickup ? Store : Truck;

  return (
    <Card render={<Box as="section" aria-label="Delivery details" />} size="lg" className="rounded-3xl border-2">
      <CardHeader>
        <CardTitle render={<Box as="span" />} className="flex items-center gap-2 text-xl font-bold">
          <TypeIcon aria-hidden="true" className="size-5 text-primary" />
          {DELIVERY_TYPE_LABELS[intent.deliveryType]}
        </CardTitle>
        <CardAction>
          <ButtonLink href={customerRoutes.checkout} variant="ghost" size="sm" className="rounded-full text-primary">
            Change
          </ButtonLink>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {pickup ? (
          <InfoRow icon={<CalendarClock aria-hidden="true" />} label="Collect on">
            {formatDateTime(intent.pickupScheduledAt)}
          </InfoRow>
        ) : (
          <InfoRow icon={<MapPin aria-hidden="true" />} label="Deliver to">
            {address ? `${address.addressLine}, ${address.city}, ${address.county}, ${address.postcode}` : "Saved address"}
          </InfoRow>
        )}
        {intent.customerNotes && (
          <InfoRow icon={<NotebookPen aria-hidden="true" />} label="Notes">
            {intent.customerNotes}
          </InfoRow>
        )}
      </CardContent>
    </Card>
  );
}

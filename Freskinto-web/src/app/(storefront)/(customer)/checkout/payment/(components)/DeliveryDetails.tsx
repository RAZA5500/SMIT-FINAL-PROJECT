"use client";

import { CalendarClock, MapPin, NotebookPen, Store, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flex } from "@/components/ui/flex";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { DELIVERY_TYPE_LABELS } from "@/constants/labels";
import { formatDateTime } from "@/lib/format";
import { customerRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetAddresses } from "@/services/addresses/queries";
import type { ICreateOrderPayload } from "@/services/orders/types";

const ADDRESS_LIST_LIMIT = 100;

function DetailItem({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <Item size="sm" className={cn("items-start px-0")}>
      <ItemMedia className={cn("size-9 rounded-xl border bg-background text-brand [&_svg]:size-4")}>{icon}</ItemMedia>
      <ItemContent className={cn("gap-0.5")}>
        <ItemDescription className={cn("text-xs")}>{label}</ItemDescription>
        <ItemTitle className={cn("line-clamp-none font-medium")}>{children}</ItemTitle>
      </ItemContent>
    </Item>
  );
}

/** Checkout intent ka khulasa — saved address ka text address book se */
export function DeliveryDetails({ intent }: { intent: ICreateOrderPayload }) {
  const { data: addresses } = useGetAddresses({ limit: ADDRESS_LIST_LIMIT });
  const saved = addresses?.data.find((address) => address.id === intent.addressId);
  const address = intent.shippingAddress ?? saved;
  const pickup = intent.deliveryType === "PICKUP";
  const TypeIcon = pickup ? Store : Truck;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Flex as="span" align="center" gap="2">
            <TypeIcon aria-hidden="true" className={cn("size-5 text-brand")} />
            {DELIVERY_TYPE_LABELS[intent.deliveryType]}
          </Flex>
        </CardTitle>
        <CardAction>
          <ButtonLink href={customerRoutes.checkout} variant="ghost" size="sm" className={cn("text-brand")}>
            Change
          </ButtonLink>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup className={cn("gap-1")}>
          {pickup ? (
            <DetailItem icon={<CalendarClock aria-hidden="true" />} label="Collect on">
              {formatDateTime(intent.pickupScheduledAt)}
            </DetailItem>
          ) : (
            <DetailItem icon={<MapPin aria-hidden="true" />} label="Deliver to">
              {address
                ? `${address.addressLine}, ${address.city}, ${address.county}, ${address.postcode}`
                : "Saved address"}
            </DetailItem>
          )}
          {intent.customerNotes && (
            <DetailItem icon={<NotebookPen aria-hidden="true" />} label="Notes">
              {intent.customerNotes}
            </DetailItem>
          )}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}

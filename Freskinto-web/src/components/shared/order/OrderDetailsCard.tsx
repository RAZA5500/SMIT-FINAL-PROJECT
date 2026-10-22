import { CalendarClock, CircleX, MapPin, NotebookPen, Store, Truck, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flex } from "@/components/ui/flex";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { CANCELLATION_REASON_LABELS, DELIVERY_TYPE_LABELS } from "@/constants/labels";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { IOrder } from "@/services/orders/types";

function DetailRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <Item size="sm" className={cn("items-start px-0")}>
      <ItemMedia
        variant="icon"
        className={cn("size-9 rounded-xl bg-muted text-muted-foreground")}
      >
        {icon}
      </ItemMedia>
      <ItemContent className={cn("min-w-0 gap-0.5")}>
        <ItemDescription className={cn("text-xs")}>{label}</ItemDescription>
        <ItemTitle className={cn("line-clamp-none font-normal")}>{children}</ItemTitle>
      </ItemContent>
    </Item>
  );
}

/** Delivery/pickup, customer, notes aur cancellation ki wajah */
export function OrderDetailsCard({ order, showCustomer = false }: { order: IOrder; showCustomer?: boolean }) {
  const pickup = order.deliveryType === "PICKUP";
  const TypeIcon = pickup ? Store : Truck;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Flex as="span" align="center" gap="2">
            <TypeIcon aria-hidden="true" className={cn("size-5 text-brand")} />
            {DELIVERY_TYPE_LABELS[order.deliveryType]}
          </Flex>
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("flex flex-col gap-3")}>
        <ItemGroup className={cn("gap-1")}>
          {showCustomer && (
            <DetailRow icon={<UserRound aria-hidden="true" />} label="Customer">
              {order.customer.name} · {order.customer.email}
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
        </ItemGroup>
        {order.cancellationReason && (
          <Alert variant="destructive">
            <CircleX aria-hidden="true" />
            <AlertTitle>
              Cancelled: {CANCELLATION_REASON_LABELS[order.cancellationReason] ?? order.cancellationReason}
            </AlertTitle>
            {order.cancellationNote && <AlertDescription>{order.cancellationNote}</AlertDescription>}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

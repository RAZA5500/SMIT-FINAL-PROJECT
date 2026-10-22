import { ArrowRight, Clock, Store, Truck } from "lucide-react";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { OrderProgress } from "@/components/shared/order/OrderProgress";
import { Price } from "@/components/shared/Price";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TextLink } from "@/components/shared/TextLink";
import { DELIVERY_TYPE_LABELS } from "@/constants/labels";
import { formatDateTime, pluralize } from "@/lib/format";
import { customerRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import type { IOrderSummary } from "@/services/orders/types";

/** Order history ka "ticket" — poora card order detail ka link (stretched link) */
export function OrderCard({ order }: { order: IOrderSummary }) {
  const awaitingPayment =
    order.status === "PENDING" && (order.paymentStatus === "UNPAID" || order.paymentStatus === "FAILED");
  const DeliveryIcon = order.deliveryType === "PICKUP" ? Store : Truck;

  return (
    <Card className={cn("relative transition hover:shadow-lift hover:ring-foreground/20")}>
      <CardHeader>
        <CardTitle>
          <TextLink
            href={customerRoutes.orderDetail(order.id)}
            tone="default"
            className={cn("font-semibold text-base tracking-tight hover:no-underline after:absolute after:inset-0 after:rounded-2xl")}
          >
            {order.orderNumber}
          </TextLink>
        </CardTitle>
        <Flex wrap align="center" gap="2" className={cn("text-sm text-muted-foreground")}>
          <Text as="span" tone="muted" numeric>
            {formatDateTime(order.createdAt)}
          </Text>
          <Text as="span" aria-hidden="true" tone="muted">
            ·
          </Text>
          <Flex as="span" align="center" gap="1">
            <DeliveryIcon aria-hidden="true" className={cn("size-3.5")} />
            {DELIVERY_TYPE_LABELS[order.deliveryType]}
          </Flex>
          <Text as="span" aria-hidden="true" tone="muted">
            ·
          </Text>
          <Text as="span" tone="muted">
            {pluralize(order.itemCount, "item")}
          </Text>
        </Flex>
        <CardAction>
          <Price amount={order.total} size="lg" tone="default" className={cn("font-heading")} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <OrderProgress status={order.status} />
      </CardContent>
      <CardFooter className={cn("flex-wrap justify-between gap-3 border-t border-border/60 bg-muted/20")}>
        <Flex wrap align="center" gap="2">
          <StatusBadge status={order.status} />
          <StatusBadge status={order.paymentStatus} />
        </Flex>
        {awaitingPayment ? (
          <Text as="span" weight="semibold" tone="warning" className={cn("flex items-center gap-1.5")}>
            <Clock aria-hidden="true" className={cn("size-4")} />
            Awaiting payment — open to pay
          </Text>
        ) : (
          <Text as="span" weight="semibold" tone="brand" className={cn("flex items-center gap-1")}>
            View details
            <ArrowRight aria-hidden="true" className={cn("size-4")} />
          </Text>
        )}
      </CardFooter>
    </Card>
  );
}

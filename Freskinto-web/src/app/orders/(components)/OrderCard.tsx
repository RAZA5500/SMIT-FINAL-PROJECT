import { ArrowRight, Clock, Store, Truck } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Heading, Text } from "@/components/ui/typography";
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
    <Card
      render={<Box as="article" />}
      className="group/order relative gap-0 py-0 transition-colors hover:border-foreground/15 has-data-[slot=card-footer]:pb-0"
    >
      <CardContent className="flex flex-col gap-5 pt-5">
        <Flex wrap align="start" justify="between" gap="3">
          <Stack gap="1.5" className="min-w-0">
            <Heading as="h3" size="4" className="font-mono tracking-tight">
              <TextLink
                href={customerRoutes.orderDetail(order.id)}
                tone="default"
                className="after:absolute after:inset-0 after:rounded-xl hover:no-underline"
              >
                {order.orderNumber}
              </TextLink>
            </Heading>
            <Flex wrap align="center" gap="2" className="text-fs-13 text-muted-foreground">
              <Text as="span" tone="inherit" numeric className="text-fs-13">
                {formatDateTime(order.createdAt)}
              </Text>
              <Text as="span" tone="inherit" aria-hidden="true">
                ·
              </Text>
              <Flex as="span" inline align="center" gap="1">
                <DeliveryIcon aria-hidden="true" className="size-3.5" />
                {DELIVERY_TYPE_LABELS[order.deliveryType]}
              </Flex>
              <Text as="span" tone="inherit" aria-hidden="true">
                ·
              </Text>
              <Text as="span" tone="inherit" className="text-fs-13">
                {pluralize(order.itemCount, "item")}
              </Text>
            </Flex>
          </Stack>
          <Price amount={order.total} size="md" />
        </Flex>
        <OrderProgress status={order.status} className="pb-5" />
      </CardContent>

      <CardFooter className="flex-wrap justify-between gap-3 border-t py-3">
        <Flex wrap align="center" gap="2">
          <StatusBadge status={order.status} />
          <StatusBadge status={order.paymentStatus} />
        </Flex>
        {awaitingPayment ? (
          <Flex align="center" gap="1.5" className="text-sm font-medium text-warning-ink">
            <Clock aria-hidden="true" className="size-4 animate-pulse" />
            Awaiting payment — open to pay
          </Flex>
        ) : (
          <Flex align="center" gap="1" className="text-sm font-medium text-primary">
            View details
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover/order:translate-x-1" />
          </Flex>
        )}
      </CardFooter>
    </Card>
  );
}

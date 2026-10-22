"use client";

import { ArrowRight, ExternalLink, Store, Truck, XCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card, CardContent } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Heading, Text } from "@/components/ui/typography";
import { AdminPage } from "@/components/admin/AdminPage";
import { demoAction } from "@/components/admin/demo";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { ChipGroup, type ChipOption } from "@/components/shared/ChipGroup";
import { SearchInput } from "@/components/shared/SearchInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ADMIN_CANCELLABLE_STATUSES, ADMIN_NEXT_STATUSES, type DeliveryType, type OrderStatus } from "@/constants/enums";
import { DELIVERY_TYPE_LABELS } from "@/constants/labels";
import { BOARD_ORDERS, type BoardOrder } from "@/data/admin";
import { formatMoney } from "@/lib/format";
import { adminRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

/** Board ke columns — order ke stage ke hisaab se (FLOW-MD order state machine) */
const COLUMNS: { id: string; label: string; statuses: OrderStatus[] }[] = [
  { id: "pending", label: "Awaiting payment", statuses: ["PENDING"] },
  { id: "confirmed", label: "Confirmed", statuses: ["CONFIRMED"] },
  { id: "processing", label: "Processing", statuses: ["PROCESSING"] },
  { id: "ready", label: "Ready", statuses: ["READY_FOR_PICKUP", "READY_FOR_DELIVERY"] },
  { id: "delivered", label: "Delivered", statuses: ["DELIVERED"] },
  { id: "cancelled", label: "Cancelled", statuses: ["CANCELLED", "REFUND_PENDING"] },
];

const VISIBLE_ITEMS = 2;

const DELIVERY_OPTIONS: ChipOption<DeliveryType | null>[] = [
  { value: null, label: "All orders" },
  { value: "DELIVERY", label: DELIVERY_TYPE_LABELS.DELIVERY },
  { value: "PICKUP", label: DELIVERY_TYPE_LABELS.PICKUP },
];

function BoardCard({ order }: { order: BoardOrder }) {
  const DeliveryIcon = order.deliveryType === "PICKUP" ? Store : Truck;
  const extra = order.items.length - VISIBLE_ITEMS;

  return (
    <Card size="sm" className={cn("gap-3 shadow-soft")}>
      <CardContent className={cn("flex flex-col gap-3")}>
        <Flex align="start" justify="between" gap="2">
          <Stack gap="0.5" className={cn("min-w-0")}>
            <Text variant="code" tone="muted">
              {order.orderNumber}
            </Text>
            <Text weight="semibold" className={cn("truncate")}>
              {order.customer}
            </Text>
          </Stack>
          <RowActionsMenu
            label={order.orderNumber}
            actions={[
              { label: "Open order", icon: ExternalLink, onSelect: () => demoAction("Opening sample orders") },
              {
                label: "Move to next stage",
                icon: ArrowRight,
                disabled: ADMIN_NEXT_STATUSES[order.status].length === 0,
                onSelect: () => demoAction("Moving orders on the board"),
              },
              {
                label: "Cancel order",
                icon: XCircle,
                destructive: true,
                disabled: !ADMIN_CANCELLABLE_STATUSES.includes(order.status),
                onSelect: () => demoAction("Cancelling orders from the board"),
              },
            ]}
          />
        </Flex>

        <Stack as="ul" gap="1" aria-label="Items" className={cn("texture-ruled rounded-lg border bg-paper px-3 py-2")}>
          {order.items.slice(0, VISIBLE_ITEMS).map((item) => (
            <Flex as="li" key={item.product} justify="between" gap="2" className={cn("text-sm")}>
              <Text as="span" className={cn("truncate")}>
                {item.product}
              </Text>
              <Text as="span" variant="code" tone="muted" className={cn("shrink-0")}>
                ×{item.quantity}
              </Text>
            </Flex>
          ))}
          {extra > 0 && (
            <Text as="li" variant="small" tone="muted">
              +{extra} more
            </Text>
          )}
        </Stack>

        <Flex align="center" justify="between" gap="2">
          <Flex align="center" gap="1.5" className={cn("text-muted-foreground [&_svg]:size-4")}>
            <DeliveryIcon aria-hidden="true" />
            <Text as="span" variant="small">
              {DELIVERY_TYPE_LABELS[order.deliveryType]}
            </Text>
          </Flex>
          <Text as="span" weight="semibold" numeric>
            {formatMoney(order.total)}
          </Text>
        </Flex>

        <Flex align="center" justify="between" gap="2" className={cn("border-t pt-3")}>
          <StatusBadge status={order.paymentStatus} />
          <Text as="span" variant="small" tone="muted">
            {order.placed}
          </Text>
        </Flex>
      </CardContent>
    </Card>
  );
}

export function OrderBoardView() {
  const [search, setSearch] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType | null>(null);

  const term = search.trim().toLowerCase();
  const orders = BOARD_ORDERS.filter(
    (order) =>
      (!deliveryType || order.deliveryType === deliveryType) &&
      (!term || order.orderNumber.toLowerCase().includes(term) || order.customer.toLowerCase().includes(term)),
  );

  return (
    <AdminPage
      demo
      eyebrow="Sales"
      title="Order board"
      description="Today's orders by stage, at a glance. This preview uses sample orders — process real orders on the Orders screen."
      actions={
        <ButtonLink href={adminRoutes.orders} variant="outline">
          Go to Orders
          <ArrowRight data-icon="inline-end" aria-hidden="true" />
        </ButtonLink>
      }
    >
      <Flex wrap align="center" gap="3">
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Order number or customer…"
          aria-label="Search the board"
          className={cn("md:max-w-xs")}
        />
        <ChipGroup
          aria-label="Filter by fulfilment"
          options={DELIVERY_OPTIONS}
          value={deliveryType}
          onValueChange={setDeliveryType}
          className={cn("md:ml-auto")}
        />
      </Flex>

      {/* Columns sideways scroll — har column ek aisle jaisa stone panel */}
      <Flex gap="4" className={cn("scrollbar-thin -mx-4 snap-x overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8")}>
        {COLUMNS.map((column) => {
          const cards = orders.filter((order) => column.statuses.includes(order.status));
          const headingId = `board-${column.id}`;
          return (
            <Stack
              key={column.id}
              as="section"
              aria-labelledby={headingId}
              gap="3"
              className={cn("w-72 shrink-0 snap-start rounded-2xl bg-muted p-3")}
            >
              <Flex align="center" justify="between" gap="2" className={cn("px-1")}>
                <Heading id={headingId} size="5" family="sans" className={cn("text-sm")}>
                  {column.label}
                </Heading>
                <Badge variant="outline" className={cn("bg-background tabular-nums")}>
                  {cards.length}
                  <Text as="span" className={cn("sr-only")}>
                    {cards.length === 1 ? " order" : " orders"}
                  </Text>
                </Badge>
              </Flex>
              {cards.length === 0 ? (
                <Box className={cn("rounded-xl border border-dashed border-input px-3 py-8 text-center")}>
                  <Text variant="small" tone="muted">
                    No orders
                  </Text>
                </Box>
              ) : (
                cards.map((order) => <BoardCard key={order.orderNumber} order={order} />)
              )}
            </Stack>
          );
        })}
      </Flex>
    </AdminPage>
  );
}

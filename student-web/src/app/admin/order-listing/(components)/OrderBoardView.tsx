"use client";

import { ArrowRight, Ban, Clock, ExternalLink, MoveRight, Store, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { demoAction } from "@/components/admin/demo";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { FilterChips, type FilterChipOption } from "@/components/shared/FilterChips";
import { SearchInput } from "@/components/shared/SearchInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import {
  ADMIN_CANCELLABLE_STATUSES,
  ADMIN_NEXT_STATUSES,
  type DeliveryType,
  type OrderStatus,
} from "@/constants/enums";
import { DELIVERY_TYPE_LABELS } from "@/constants/labels";
import { BOARD_ORDERS, type BoardOrder } from "@/data/admin";
import { formatMoney } from "@/lib/format";
import { adminRoutes } from "@/lib/routes/routes";

/** Board ke columns — "Ready" pickup aur delivery dono, "Cancelled" refund wale bhi */
const COLUMNS: { id: string; label: string; statuses: OrderStatus[] }[] = [
  { id: "pending", label: "Awaiting payment", statuses: ["PENDING"] },
  { id: "confirmed", label: "Confirmed", statuses: ["CONFIRMED"] },
  { id: "processing", label: "Processing", statuses: ["PROCESSING"] },
  { id: "ready", label: "Ready", statuses: ["READY_FOR_PICKUP", "READY_FOR_DELIVERY"] },
  { id: "delivered", label: "Delivered", statuses: ["DELIVERED"] },
  { id: "cancelled", label: "Cancelled", statuses: ["CANCELLED", "REFUND_PENDING"] },
];

/** Card par zyada se zyada itni lines, baqi "+N more" */
const VISIBLE_ITEMS = 2;

const DELIVERY_OPTIONS: FilterChipOption<DeliveryType | null>[] = [
  { value: null, label: "All orders" },
  { value: "DELIVERY", label: DELIVERY_TYPE_LABELS.DELIVERY },
  { value: "PICKUP", label: DELIVERY_TYPE_LABELS.PICKUP },
];

function BoardCard({ order }: { order: BoardOrder }) {
  const DeliveryIcon = order.deliveryType === "PICKUP" ? Store : Truck;
  const extra = order.items.length - VISIBLE_ITEMS;
  const canAdvance = ADMIN_NEXT_STATUSES[order.status].length > 0;

  return (
    <li className="flex flex-col gap-3 rounded-xl bg-card p-3.5 shadow-soft ring-1 ring-border">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col">
          <p className="truncate text-sm font-semibold">{order.orderNumber}</p>
          <p className="truncate text-xs text-muted-foreground">{order.customer}</p>
        </div>
        <RowActionsMenu
          label={order.orderNumber}
          actions={[
            { label: "Open order", icon: ExternalLink, onSelect: () => demoAction("Opening sample orders") },
            {
              label: "Move to next stage",
              icon: MoveRight,
              disabled: !canAdvance,
              onSelect: () => demoAction("Moving orders on the board"),
            },
            {
              label: "Cancel order",
              icon: Ban,
              destructive: true,
              disabled: !ADMIN_CANCELLABLE_STATUSES.includes(order.status),
              onSelect: () => demoAction("Cancelling orders from the board"),
            },
          ]}
        />
      </div>

      <ul className="flex flex-col gap-1 text-xs">
        {order.items.slice(0, VISIBLE_ITEMS).map((item) => (
          <li key={item.product} className="flex gap-1.5">
            <span className="numeric shrink-0 font-semibold">{item.quantity}×</span>
            <span className="truncate">{item.product}</span>
          </li>
        ))}
        {extra > 0 && <li className="text-muted-foreground">+{extra} more</li>}
      </ul>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <DeliveryIcon className="size-3.5" aria-hidden="true" />
          {DELIVERY_TYPE_LABELS[order.deliveryType]}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" aria-hidden="true" />
          {order.placed}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 border-t pt-3">
        <span className="numeric font-semibold">{formatMoney(order.total)}</span>
        <StatusBadge status={order.paymentStatus} />
      </div>
    </li>
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
      title="Order board"
      description="Today's orders by stage, at a glance. This preview uses sample orders — process real orders on the Orders screen."
      actions={
        <Link href={adminRoutes.orders} className={buttonVariants({ variant: "outline" })}>
          Orders
          <ArrowRight aria-hidden="true" />
        </Link>
      }
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <SearchInput
          value={search}
          onValueChange={setSearch}
          placeholder="Order number or customer…"
          className="w-full md:max-w-xs"
        />
        <FilterChips
          aria-label="Filter by fulfilment"
          options={DELIVERY_OPTIONS}
          value={deliveryType}
          onChange={setDeliveryType}
          className="md:ml-auto"
        />
      </div>

      {/* relative: sr-only text ka containing block yahi rahe — warna woh scroll clip se bahar page ko chaura kar deta hai */}
      <div className="scrollbar-thin relative -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {COLUMNS.map((column) => {
          const cards = orders.filter((order) => column.statuses.includes(order.status));
          const headingId = `board-${column.id}`;
          return (
            <section
              key={column.id}
              aria-labelledby={headingId}
              className="flex w-72 shrink-0 snap-start flex-col gap-3 rounded-2xl bg-muted/60 p-3"
            >
              <div className="flex items-center justify-between gap-2 px-1">
                <h2 id={headingId} className="flex items-center gap-2 font-sans text-sm font-semibold">
                  <StatusBadge status={column.statuses[0]} label={column.label} />
                </h2>
                <span className="numeric text-xs font-semibold text-muted-foreground">
                  {cards.length}
                  <span className="sr-only"> orders</span>
                </span>
              </div>
              {cards.length === 0 ? (
                <p className="rounded-xl border border-dashed border-input px-3 py-6 text-center text-xs text-muted-foreground">
                  No orders here
                </p>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {cards.map((order) => (
                    <BoardCard key={order.orderNumber} order={order} />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </AdminPage>
  );
}

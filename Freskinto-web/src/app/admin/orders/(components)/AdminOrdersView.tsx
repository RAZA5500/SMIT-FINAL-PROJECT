"use client";

import { ArrowRight, CircleCheck, Clock, PackageCheck, ReceiptText, Store, Truck, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/typography";
import { AdminDataTable, AdminEmptyState, type AdminColumn } from "@/components/admin/AdminDataTable";
import { AdminFilterDropdown } from "@/components/admin/AdminFilterDropdown";
import { AdminPage } from "@/components/admin/AdminPage";
import { StatTile } from "@/components/admin/StatTile";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TextLink } from "@/components/shared/TextLink";
import type { OrderStatus, PaymentStatus } from "@/constants/enums";
import { ADMIN_PAGE_SIZE, ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "@/constants/filters";
import { DELIVERY_TYPE_LABELS } from "@/constants/labels";
import { adminRoutes } from "@/lib/routes/routes";
import { formatDateTime, formatMoney, initials } from "@/lib/utils";
import { useGetAdminOrders } from "@/services/orders/queries";
import type { IOrderSummary } from "@/services/orders/types";
import { OrderTableSkeleton } from "./OrderTableSkeleton";

/** Date input (local din) → poore din ki range ISO mein; backend `gte/lte createdAt` */
function dayBoundary(date: string, end: boolean): string | undefined {
  if (!date) return undefined;
  return new Date(`${date}T${end ? "23:59:59.999" : "00:00:00"}`).toISOString();
}

const COLUMNS: AdminColumn<IOrderSummary>[] = [
  {
    key: "order",
    header: "Order",
    cell: (order) => (
      <Stack gap="0.5">
        <TextLink
          href={adminRoutes.orderDetail(order.id)}
          tone="default"
          className="numeric font-mono font-semibold tracking-tight hover:text-primary"
        >
          {order.orderNumber}
        </TextLink>
        <Text as="span" tone="muted" numeric className="text-fs-12">
          {formatDateTime(order.createdAt)}
        </Text>
      </Stack>
    ),
  },
  {
    key: "customer",
    header: "Customer",
    hideBelow: "md",
    className: "max-w-56",
    cell: (order) => (
      <Flex align="center" gap="2.5">
        <Avatar size="sm" className="size-8">
          <AvatarFallback className="text-xs">{initials(order.customer.name)}</AvatarFallback>
        </Avatar>
        <Stack gap="0.5" className="min-w-0">
          <Text weight="medium" className="truncate">
            {order.customer.name}
          </Text>
          <Text tone="muted" className="truncate text-fs-12">
            {order.customer.email}
          </Text>
        </Stack>
      </Flex>
    ),
  },
  {
    key: "fulfilment",
    header: "Fulfilment",
    hideBelow: "lg",
    cell: (order) => {
      const DeliveryIcon = order.deliveryType === "PICKUP" ? Store : Truck;
      return (
        <Flex as="span" align="center" gap="1.5" className="text-muted-foreground">
          <DeliveryIcon aria-hidden="true" className="size-4" />
          {DELIVERY_TYPE_LABELS[order.deliveryType]}
        </Flex>
      );
    },
  },
  { key: "items", header: "Items", align: "right", hideBelow: "lg", className: "numeric", cell: (order) => order.itemCount },
  {
    key: "total",
    header: "Total",
    align: "right",
    className: "numeric font-semibold",
    cell: (order) => formatMoney(order.total),
  },
  { key: "payment", header: "Payment", hideBelow: "sm", cell: (order) => <StatusBadge status={order.paymentStatus} /> },
  { key: "status", header: "Status", cell: (order) => <StatusBadge status={order.status} /> },
  {
    key: "actions",
    header: "Actions",
    srOnlyHeader: true,
    align: "right",
    cell: (order) => (
      <ButtonLink
        href={adminRoutes.orderDetail(order.id)}
        variant="ghost"
        size="sm"
        aria-label={`View order ${order.orderNumber}`}
        className="text-primary"
      >
        View
        <ArrowRight aria-hidden="true" />
      </ButtonLink>
    ),
  },
];

/** Kaam ki queue — har tile ka count `meta.total` (limit 1) se; click = status filter */
const QUEUE: { status: OrderStatus; label: string; hint: string; icon: LucideIcon; tone: string }[] = [
  { status: "PENDING", label: "Awaiting payment", hint: "Released if unpaid", icon: Clock, tone: "bg-warning-soft text-warning-ink" },
  { status: "CONFIRMED", label: "To prepare", hint: "Paid & confirmed", icon: CircleCheck, tone: "bg-muted text-muted-foreground" },
  { status: "PROCESSING", label: "Being packed", hint: "Picking in progress", icon: PackageCheck, tone: "bg-muted text-muted-foreground" },
];

function QueueTile({ tile, active, onSelect }: { tile: (typeof QUEUE)[number]; active: boolean; onSelect: () => void }) {
  const { data, isLoading } = useGetAdminOrders({ limit: 1, status: tile.status });
  return (
    <StatTile
      label={tile.label}
      value={data?.meta.total}
      hint={tile.hint}
      icon={tile.icon}
      tone={tile.tone}
      isLoading={isLoading}
      active={active}
      onSelect={onSelect}
    />
  );
}

export function AdminOrdersView() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data, isLoading, isFetching, isError, error, refetch } = useGetAdminOrders({
    page,
    limit: ADMIN_PAGE_SIZE,
    search: search.trim() || undefined,
    status: status ?? undefined,
    paymentStatus: paymentStatus ?? undefined,
    dateFrom: dayBoundary(dateFrom, false),
    dateTo: dayBoundary(dateTo, true),
  });

  // Har filter badalne par page 1
  const onFilter =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(1);
    };
  const hasFilters = Boolean(search.trim() || status || paymentStatus || dateFrom || dateTo);

  return (
    <AdminPage eyebrow="Operations" title="Orders" description="Move paid orders through preparation to delivery or collection.">
      <Grid gap="4" className="sm:grid-cols-3">
        {QUEUE.map((tile) => (
          <QueueTile
            key={tile.status}
            tile={tile}
            active={status === tile.status}
            onSelect={() => onFilter(setStatus)(status === tile.status ? null : tile.status)}
          />
        ))}
      </Grid>
      <AdminDataTable
        caption="Orders"
        columns={COLUMNS}
        rows={data?.data}
        getRowId={(order) => order.id}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorTitle="Couldn't load orders"
        errorMessage={error?.message}
        onRetry={() => void refetch()}
        skeleton={<OrderTableSkeleton />}
        emptyState={
          <AdminEmptyState
            icon={<ReceiptText aria-hidden="true" />}
            title={hasFilters ? "No orders match" : "No orders yet"}
            message={hasFilters ? "Try different filters." : "Orders appear here as soon as customers check out."}
          />
        }
        toolbar={
          <>
            <SearchInput
              value={search}
              onValueChange={onFilter(setSearch)}
              placeholder="Order number or customer…"
              className="w-full md:max-w-xs"
            />
            <Flex wrap align="center" gap="2">
              <AdminFilterDropdown
                id="admin-order-status-filter"
                label="Filter by order status"
                allLabel="All statuses"
                options={ORDER_STATUS_OPTIONS as { value: OrderStatus; label: string }[]}
                value={status}
                onValueChange={onFilter(setStatus)}
              />
              <AdminFilterDropdown
                id="admin-order-payment-filter"
                label="Filter by payment status"
                allLabel="All payments"
                options={PAYMENT_STATUS_OPTIONS as { value: PaymentStatus; label: string }[]}
                value={paymentStatus}
                onValueChange={onFilter(setPaymentStatus)}
              />
              <Flex align="center" gap="1.5">
                <Input
                  type="date"
                  aria-label="Placed from"
                  value={dateFrom}
                  max={dateTo || undefined}
                  onChange={(event) => onFilter(setDateFrom)(event.target.value)}
                  className="h-9 w-40 rounded-lg text-sm"
                />
                <Text as="span" tone="muted" className="text-fs-13">
                  to
                </Text>
                <Input
                  type="date"
                  aria-label="Placed to"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(event) => onFilter(setDateTo)(event.target.value)}
                  className="h-9 w-40 rounded-lg text-sm"
                />
              </Flex>
            </Flex>
          </>
        }
        footer={
          data && data.meta.total > 0 ? (
            <Pagination
              currentPage={data.meta.currentPage}
              totalPages={data.meta.pages}
              total={data.meta.total}
              limit={data.meta.limit}
              onPageChange={setPage}
              itemLabel="orders"
            />
          ) : undefined
        }
      />
    </AdminPage>
  );
}

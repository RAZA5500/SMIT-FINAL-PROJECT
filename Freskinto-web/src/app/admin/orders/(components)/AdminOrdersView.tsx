"use client";

import { ArrowRight, ReceiptText, Store, Truck } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { AdminDataTable, AdminEmptyState, type AdminColumn } from "@/components/admin/AdminDataTable";
import { AdminFilterDropdown } from "@/components/admin/AdminFilterDropdown";
import { AdminPage } from "@/components/admin/AdminPage";
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
      <div className="flex flex-col gap-0.5">
        <TextLink
          href={adminRoutes.orderDetail(order.id)}
          tone="default"
          className="numeric font-semibold tracking-tight hover:text-brand-green"
        >
          {order.orderNumber}
        </TextLink>
        <span className="numeric text-fs-12 text-muted-foreground">{formatDateTime(order.createdAt)}</span>
      </div>
    ),
  },
  {
    key: "customer",
    header: "Customer",
    hideBelow: "md",
    className: "max-w-56",
    cell: (order) => (
      <div className="flex items-center gap-2.5">
        <Avatar size="sm" className="size-8">
          <AvatarFallback>{initials(order.customer.name)}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate font-medium">{order.customer.name}</p>
          <p className="truncate text-fs-12 text-muted-foreground">{order.customer.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "fulfilment",
    header: "Fulfilment",
    hideBelow: "lg",
    cell: (order) => {
      const DeliveryIcon = order.deliveryType === "PICKUP" ? Store : Truck;
      return (
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <DeliveryIcon aria-hidden="true" className="size-4" />
          {DELIVERY_TYPE_LABELS[order.deliveryType]}
        </span>
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
        className="text-brand-green hover:text-brand-green-dark"
      >
        View
        <ArrowRight aria-hidden="true" />
      </ButtonLink>
    ),
  },
];

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
            <div className="flex flex-wrap items-center gap-2">
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
              <div className="flex items-center gap-1.5">
                <Input
                  type="date"
                  aria-label="Placed from"
                  value={dateFrom}
                  max={dateTo || undefined}
                  onChange={(event) => onFilter(setDateFrom)(event.target.value)}
                  className="h-9 w-40 rounded-lg text-sm"
                />
                <span className="text-fs-13 text-muted-foreground">to</span>
                <Input
                  type="date"
                  aria-label="Placed to"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(event) => onFilter(setDateTo)(event.target.value)}
                  className="h-9 w-40 rounded-lg text-sm"
                />
              </div>
            </div>
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

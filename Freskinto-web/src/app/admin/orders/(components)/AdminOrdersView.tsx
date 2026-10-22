"use client";

import { ArrowRight, ReceiptText, Store, Truck } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Flex, Stack } from "@/components/ui/flex";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Text } from "@/components/ui/typography";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTableCard, ToolbarFilters } from "@/components/admin/DataTableCard";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { TextLink } from "@/components/shared/TextLink";
import { ORDER_STATUSES, PAYMENT_STATUSES, type OrderStatus, type PaymentStatus } from "@/constants/enums";
import { DELIVERY_TYPE_LABELS, ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/constants/labels";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDateTime, formatMoney, initials } from "@/lib/format";
import { adminRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetAdminOrders } from "@/services/orders/queries";

const PAGE_SIZE = 10;
const ALL = "ALL";

const STATUS_OPTIONS = [
  { value: ALL, label: "All statuses" },
  ...ORDER_STATUSES.map((status) => ({ value: status, label: ORDER_STATUS_LABELS[status] })),
];
const PAYMENT_OPTIONS = [
  { value: ALL, label: "All payments" },
  ...PAYMENT_STATUSES.map((status) => ({ value: status, label: PAYMENT_STATUS_LABELS[status] })),
];

/** Date input (local din) → poore din ki range ISO mein; backend `gte/lte createdAt` */
function dayBoundary(date: string, end: boolean): string | undefined {
  if (!date) return undefined;
  return new Date(`${date}T${end ? "23:59:59.999" : "00:00:00"}`).toISOString();
}

export function AdminOrdersView() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const debouncedSearch = useDebounce(search.trim());
  const { data, isLoading, isFetching, isError, error, refetch } = useGetAdminOrders({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: status ?? undefined,
    paymentStatus: paymentStatus ?? undefined,
    dateFrom: dayBoundary(dateFrom, false),
    dateTo: dayBoundary(dateTo, true),
  });

  const onFilter =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(1);
    };
  const hasFilters = Boolean(debouncedSearch || status || paymentStatus || dateFrom || dateTo);

  let content: ReactNode;
  if (isLoading) {
    content = <TableSkeleton columns={7} />;
  } else if (isError) {
    content = <ErrorState title="Couldn't load orders" message={error.message} onRetry={() => void refetch()} />;
  } else if (!data?.data.length) {
    content = (
      <EmptyState
        icon={<ReceiptText aria-hidden="true" />}
        title={hasFilters ? "No orders match" : "No orders yet"}
        message={hasFilters ? "Try different filters." : "Orders appear here as soon as customers check out."}
      />
    );
  } else {
    content = (
      <Table className={cn("min-w-240")}>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Fulfilment</TableHead>
            <TableHead className={cn("text-right")}>Items</TableHead>
            <TableHead className={cn("text-right")}>Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className={cn("w-24")}>
              <Text as="span" className={cn("sr-only")}>
                Actions
              </Text>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((order) => {
            const DeliveryIcon = order.deliveryType === "PICKUP" ? Store : Truck;
            return (
              <TableRow key={order.id}>
                <TableCell>
                  <Stack gap="0.5">
                    <TextLink
                      href={adminRoutes.orderDetail(order.id)}
                      tone="default"
                      className={cn("font-semibold tracking-tight hover:text-brand-green")}
                    >
                      {order.orderNumber}
                    </TextLink>
                    <Text variant="small" tone="muted" numeric>
                      {formatDateTime(order.createdAt)}
                    </Text>
                  </Stack>
                </TableCell>
                <TableCell className={cn("max-w-56")}>
                  <Flex align="center" gap="2.5">
                    <Avatar size="sm" className={cn("size-8")}>
                      <AvatarFallback className={cn("bg-icon-green text-xs font-semibold text-brand-green")}>
                        {initials(order.customer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <Stack gap="0.5" className={cn("min-w-0")}>
                      <Text weight="medium" className={cn("truncate")}>
                        {order.customer.name}
                      </Text>
                      <Text variant="small" tone="muted" className={cn("truncate")}>
                        {order.customer.email}
                      </Text>
                    </Stack>
                  </Flex>
                </TableCell>
                <TableCell>
                  <Flex align="center" gap="1.5" className={cn("text-muted-foreground")}>
                    <DeliveryIcon aria-hidden="true" className={cn("size-4")} />
                    {DELIVERY_TYPE_LABELS[order.deliveryType]}
                  </Flex>
                </TableCell>
                <TableCell className={cn("text-right tabular-nums")}>{order.itemCount}</TableCell>
                <TableCell className={cn("text-right font-semibold tabular-nums")}>{formatMoney(order.total)}</TableCell>
                <TableCell>
                  <StatusBadge status={order.paymentStatus} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className={cn("text-right")}>
                  <ButtonLink
                    href={adminRoutes.orderDetail(order.id)}
                    variant="ghost"
                    size="sm"
                    aria-label={`View order ${order.orderNumber}`}
                    className={cn("text-brand-green hover:text-brand-green-dark")}
                  >
                    View
                    <ArrowRight data-icon="inline-end" aria-hidden="true" />
                  </ButtonLink>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }

  return (
    <AdminPage eyebrow="Sales" title="Orders" description="Move paid orders through preparation to delivery or collection.">
      <DataTableCard
        busy={isFetching && !isLoading}
        toolbar={
          <>
            <SearchInput
              value={search}
              onValueChange={onFilter(setSearch)}
              placeholder="Order number or customer…"
              className={cn("w-full md:max-w-xs")}
            />
            <ToolbarFilters>
              <SelectField
                id="admin-order-status-filter"
                aria-label="Filter by order status"
                size="sm"
                options={STATUS_OPTIONS}
                value={status ?? ALL}
                onValueChange={(value) => onFilter(setStatus)(!value || value === ALL ? null : (value as OrderStatus))}
                containerClassName={cn("w-44")}
              />
              <SelectField
                id="admin-order-payment-filter"
                aria-label="Filter by payment status"
                size="sm"
                options={PAYMENT_OPTIONS}
                value={paymentStatus ?? ALL}
                onValueChange={(value) => onFilter(setPaymentStatus)(!value || value === ALL ? null : (value as PaymentStatus))}
                containerClassName={cn("w-40")}
              />
              <Flex align="center" gap="1.5">
                <Input
                  type="date"
                  aria-label="Placed from"
                  value={dateFrom}
                  max={dateTo || undefined}
                  onChange={(event) => onFilter(setDateFrom)(event.target.value)}
                  className={cn("h-8 w-38 rounded-lg text-sm")}
                />
                <Text as="span" variant="small" tone="muted">
                  to
                </Text>
                <Input
                  type="date"
                  aria-label="Placed to"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(event) => onFilter(setDateTo)(event.target.value)}
                  className={cn("h-8 w-38 rounded-lg text-sm")}
                />
              </Flex>
            </ToolbarFilters>
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
      >
        {content}
      </DataTableCard>
    </AdminPage>
  );
}

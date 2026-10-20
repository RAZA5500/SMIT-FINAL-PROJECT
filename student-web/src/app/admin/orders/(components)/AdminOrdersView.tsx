"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import AdminListPage, {
  ADMIN_FILTER_FIELD_CLASS,
  ADMIN_SEARCH_FIELD_CLASS,
  FilterIcon,
  TD_CLASS,
  TH_CENTER_CLASS,
  TH_CLASS,
  TR_STATIC_CLASS,
} from "@/components/admin/AdminListPage";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { InputField } from "@/components/shared/InputField";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ORDER_STATUSES, PAYMENT_STATUSES, type OrderStatus, type PaymentStatus } from "@/constants/enums";
import { DELIVERY_TYPE_LABELS, ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/constants/labels";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDateTime, formatMoney } from "@/lib/format";
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

/** `<input type="date">` (local din) → poore din ki range ISO mein; backend `gte/lte createdAt` */
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

  const onFilter = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };
  const hasFilters = Boolean(debouncedSearch || status || paymentStatus || dateFrom || dateTo);

  const toolbar = (
    <>
      <SearchInput
        value={search}
        onValueChange={onFilter(setSearch)}
        placeholder="Search by order # or customer..."
        className="max-w-search"
        inputClassName={ADMIN_SEARCH_FIELD_CLASS}
      />
      <div className="ml-auto flex shrink-0 flex-wrap items-center gap-3">
        <FilterIcon />
        <SelectField
          id="admin-order-status-filter"
          options={STATUS_OPTIONS}
          value={status ?? ALL}
          onValueChange={(value) => onFilter(setStatus)(!value || value === ALL ? null : (value as OrderStatus))}
          className={ADMIN_FILTER_FIELD_CLASS}
        />
        <SelectField
          id="admin-order-payment-filter"
          options={PAYMENT_OPTIONS}
          value={paymentStatus ?? ALL}
          onValueChange={(value) =>
            onFilter(setPaymentStatus)(!value || value === ALL ? null : (value as PaymentStatus))
          }
          className={ADMIN_FILTER_FIELD_CLASS}
        />
        <InputField
          id="admin-order-date-from"
          type="date"
          aria-label="Placed from"
          value={dateFrom}
          max={dateTo || undefined}
          onChange={(event) => onFilter(setDateFrom)(event.target.value)}
          className="h-12 border-gray-300 shadow-btn"
        />
        <InputField
          id="admin-order-date-to"
          type="date"
          aria-label="Placed to"
          value={dateTo}
          min={dateFrom || undefined}
          onChange={(event) => onFilter(setDateTo)(event.target.value)}
          className="h-12 border-gray-300 shadow-btn"
        />
      </div>
    </>
  );

  let content: ReactNode;
  if (isLoading) {
    content = <TableSkeleton columns={8} />;
  } else if (isError) {
    content = <ErrorState title="Couldn't load orders" message={error.message} onRetry={() => void refetch()} />;
  } else if (!data?.data.length) {
    content = (
      <EmptyState
        title="No orders found"
        message={hasFilters ? "Try different filters." : "Orders will appear here once customers check out."}
      />
    );
  } else {
    content = (
      <Table className={cn("min-w-215", isFetching && "opacity-60 transition-opacity")}>
        <TableHeader>
          <TableRow className="border-gray-200">
            <TableHead className={TH_CLASS}>Order #</TableHead>
            <TableHead className={TH_CLASS}>Customer</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Delivery type</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Items</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Total</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Payment</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Order status</TableHead>
            <TableHead className={TH_CLASS}>Date &amp; time</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((order) => (
            <TableRow key={order.id} className={TR_STATIC_CLASS}>
              <TableCell className={cn(TD_CLASS, "font-semibold text-body-text")}>
                <Link href={adminRoutes.orderDetail(order.id)} className="hover:text-brand-green hover:underline">
                  {order.orderNumber}
                </Link>
              </TableCell>
              <TableCell className={cn(TD_CLASS, "max-w-48")}>
                <p className="truncate text-gray-900">{order.customer.name}</p>
                <p className="truncate text-xs text-gray-500">{order.customer.email}</p>
              </TableCell>
              <TableCell className={cn(TD_CLASS, "text-center text-gray-500")}>
                {DELIVERY_TYPE_LABELS[order.deliveryType]}
              </TableCell>
              <TableCell className={cn(TD_CLASS, "text-center")}>{order.itemCount}</TableCell>
              <TableCell className={cn(TD_CLASS, "text-center font-semibold text-body-text")}>
                {formatMoney(order.total)}
              </TableCell>
              <TableCell className={cn(TD_CLASS, "text-center")}>
                <StatusBadge status={order.paymentStatus} />
              </TableCell>
              <TableCell className={cn(TD_CLASS, "text-center")}>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className={cn(TD_CLASS, "text-gray-500")}>{formatDateTime(order.createdAt)}</TableCell>
              <TableCell className={cn(TD_CLASS, "text-center")}>
                <Link
                  href={adminRoutes.orderDetail(order.id)}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                  aria-label={`View order ${order.orderNumber}`}
                >
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <AdminListPage
      toolbar={toolbar}
      responsiveToolbar
      total={data?.meta.total ?? 0}
      page={data?.meta.currentPage ?? page}
      pageSize={data?.meta.limit ?? PAGE_SIZE}
      onPageChange={setPage}
      noun="orders"
    >
      {content}
    </AdminListPage>
  );
}

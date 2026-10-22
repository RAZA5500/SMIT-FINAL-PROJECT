"use client";

import { ArrowRight, Clock, Package, Store, Truck } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { FilterChips, type FilterChipOption } from "@/components/shared/FilterChips";
import { OrderProgress } from "@/components/shared/order/OrderProgress";
import { Pagination } from "@/components/shared/Pagination";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ORDER_STATUSES, type OrderStatus } from "@/constants/enums";
import { DELIVERY_TYPE_LABELS, ORDER_STATUS_LABELS } from "@/constants/labels";
import { formatDateTime, formatMoney, pluralize } from "@/lib/format";
import { customerRoutes, shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetCustomerOrders } from "@/services/orders/queries";
import type { IOrderSummary } from "@/services/orders/types";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: FilterChipOption<OrderStatus | null>[] = [
  { value: null, label: "All orders" },
  ...ORDER_STATUSES.map((status) => ({ value: status, label: ORDER_STATUS_LABELS[status] })),
];

function OrderCard({ order }: { order: IOrderSummary }) {
  const awaitingPayment =
    order.status === "PENDING" && (order.paymentStatus === "UNPAID" || order.paymentStatus === "FAILED");
  const DeliveryIcon = order.deliveryType === "PICKUP" ? Store : Truck;

  return (
    <li className="relative flex flex-col gap-4 rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border transition hover:shadow-lift sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Link
            href={customerRoutes.orderDetail(order.id)}
            className="font-heading text-lg font-bold after:absolute after:inset-0 after:rounded-3xl hover:text-brand"
          >
            {order.orderNumber}
          </Link>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>{formatDateTime(order.createdAt)}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <DeliveryIcon className="size-3.5" aria-hidden="true" />
              {DELIVERY_TYPE_LABELS[order.deliveryType]}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {pluralize(order.itemCount, "item")}
            </span>
          </p>
        </div>
        <p className="numeric font-heading text-xl font-bold">{formatMoney(order.total)}</p>
      </div>

      <OrderProgress status={order.status} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={order.status} />
          <StatusBadge status={order.paymentStatus} />
        </div>
        {awaitingPayment ? (
          <span className="relative z-10 inline-flex items-center gap-1.5 text-sm font-semibold text-warning">
            <Clock className="size-4" aria-hidden="true" />
            Awaiting payment — open to pay
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand">
            View details
            <ArrowRight className="size-4" aria-hidden="true" />
          </span>
        )}
      </div>
    </li>
  );
}

export function OrdersView() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const { data, isLoading, isFetching, isError, error, refetch } = useGetCustomerOrders({
    page,
    limit: PAGE_SIZE,
    status: status ?? undefined,
  });

  let content: ReactNode;
  if (isLoading) {
    content = (
      <ul className="flex flex-col gap-4" aria-label="Loading" aria-busy="true">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-3xl" />
        ))}
      </ul>
    );
  } else if (isError) {
    content = <ErrorState title="Couldn't load your orders" message={error.message} onRetry={() => void refetch()} />;
  } else if (!data?.data.length) {
    content = status ? (
      <EmptyState
        title={`No ${ORDER_STATUS_LABELS[status].toLowerCase()} orders`}
        message="Try another status to see more of your orders."
      />
    ) : (
      <EmptyState
        icon={<Package aria-hidden="true" />}
        title="No orders yet"
        message="When you place an order, you can track it here from basket to doorstep."
        action={
          <Link href={shopUrl()} className={buttonVariants({ size: "lg" })}>
            Start shopping
          </Link>
        }
      />
    );
  } else {
    content = (
      <div className="flex flex-col gap-6">
        <ul className={cn("flex flex-col gap-4", isFetching && "opacity-60 transition-opacity")}>
          {data.data.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ul>
        <Pagination
          currentPage={data.meta.currentPage}
          totalPages={data.meta.pages}
          total={data.meta.total}
          limit={data.meta.limit}
          onPageChange={setPage}
          itemLabel="orders"
        />
      </div>
    );
  }

  return (
    <CustomerPage
      eyebrow="My account"
      title="My orders"
      description="Track, pay for or cancel your orders."
      breadcrumbs={[{ label: "My orders" }]}
    >
      <FilterChips
        aria-label="Filter by status"
        options={STATUS_OPTIONS}
        value={status}
        onChange={(next) => {
          setStatus(next);
          setPage(1);
        }}
      />
      {content}
    </CustomerPage>
  );
}

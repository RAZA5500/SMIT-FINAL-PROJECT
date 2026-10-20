"use client";

import { Package } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ORDER_STATUSES, type OrderStatus } from "@/constants/enums";
import { DELIVERY_TYPE_LABELS, ORDER_STATUS_LABELS } from "@/constants/labels";
import { formatDateTime, formatMoney } from "@/lib/format";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetCustomerOrders } from "@/services/orders/queries";

const PAGE_SIZE = 10;
const ALL_STATUSES = "ALL";

const STATUS_OPTIONS = [
  { value: ALL_STATUSES, label: "All statuses" },
  ...ORDER_STATUSES.map((status) => ({ value: status, label: ORDER_STATUS_LABELS[status] })),
];

export function OrdersView() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const { data, isLoading, isFetching, isError, error, refetch } = useGetCustomerOrders({
    page,
    limit: PAGE_SIZE,
    status: status ?? undefined,
  });

  const filter = (
    <SelectField
      id="order-status-filter"
      options={STATUS_OPTIONS}
      value={status ?? ALL_STATUSES}
      onValueChange={(value) => {
        setStatus(!value || value === ALL_STATUSES ? null : (value as OrderStatus));
        setPage(1);
      }}
      containerClassName="w-52"
    />
  );

  let content: ReactNode;
  if (isLoading) {
    content = <TableSkeleton columns={6} />;
  } else if (isError) {
    content = <ErrorState title="Couldn't load your orders" message={error.message} onRetry={() => void refetch()} />;
  } else if (!data?.data.length) {
    content = status ? (
      <EmptyState title="No orders with this status" message="Try a different status filter." />
    ) : (
      <EmptyState
        icon={<Package className="size-6" aria-hidden="true" />}
        title="No orders yet"
        message="Your orders will appear here."
        action={
          <Link href={publicRoutes.shop} className={buttonVariants({ variant: "brand", size: "xl" })}>
            Start shopping
          </Link>
        }
      />
    );
  } else {
    content = (
      <div className="flex flex-col gap-4 p-4">
        <Table className={cn(isFetching && "opacity-60 transition-opacity")}>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Placed</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="sr-only">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-semibold text-gray-900">
                  <Link href={customerRoutes.orderDetail(order.id)} className="hover:text-brand-green hover:underline">
                    {order.orderNumber}
                  </Link>
                </TableCell>
                <TableCell className="whitespace-nowrap text-gray-500">{formatDateTime(order.createdAt)}</TableCell>
                <TableCell>{DELIVERY_TYPE_LABELS[order.deliveryType]}</TableCell>
                <TableCell className="text-right">{order.itemCount}</TableCell>
                <TableCell className="text-right font-medium">{formatMoney(order.total)}</TableCell>
                <TableCell>
                  <StatusBadge status={order.paymentStatus} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={customerRoutes.orderDetail(order.id)}
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
    <CustomerPage title="My Orders" description="Track, pay for or cancel your orders." actions={filter}>
      <Card className="py-0">{content}</Card>
    </CustomerPage>
  );
}

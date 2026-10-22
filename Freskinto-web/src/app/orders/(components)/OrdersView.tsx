"use client";

import { Package } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { ChipGroup, type ChipOption } from "@/components/shared/ChipGroup";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import type { OrderStatus } from "@/constants/enums";
import { ACCOUNT_PAGE_SIZE, ORDER_STATUS_OPTIONS } from "@/constants/filters";
import { ORDER_STATUS_LABELS } from "@/constants/labels";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetCustomerOrders } from "@/services/orders/queries";
import { OrderCard } from "./OrderCard";

const STATUS_CHIPS: ChipOption<OrderStatus | null>[] = [
  { value: null, label: "All orders" },
  ...ORDER_STATUS_OPTIONS.map((option) => ({ value: option.value as OrderStatus, label: option.label })),
];

export function OrdersView() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const { data, isLoading, isFetching, isError, error, refetch } = useGetCustomerOrders({
    page,
    limit: ACCOUNT_PAGE_SIZE,
    status: status ?? undefined,
  });

  let content: ReactNode;
  if (isLoading) {
    content = (
      <div aria-label="Loading" aria-busy="true" className="flex flex-col gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-44 w-full rounded-15" />
        ))}
      </div>
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
          <ButtonLink href={shopUrl()} variant="cta" size="lg">
            Start shopping
          </ButtonLink>
        }
      />
    );
  } else {
    content = (
      <div className="flex flex-col gap-6">
        <ul className={cn("flex flex-col gap-4", isFetching && "opacity-60 transition-opacity")}>
          {data.data.map((order) => (
            <li key={order.id}>
              <OrderCard order={order} />
            </li>
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
      <ChipGroup
        aria-label="Filter by status"
        options={STATUS_CHIPS}
        value={status}
        onValueChange={(next) => {
          setStatus(next);
          setPage(1);
        }}
      />
      {content}
    </CustomerPage>
  );
}

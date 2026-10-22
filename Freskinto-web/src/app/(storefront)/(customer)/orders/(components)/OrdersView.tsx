"use client";

import { Package } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Stack } from "@/components/ui/flex";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { ChipGroup, type ChipOption } from "@/components/shared/ChipGroup";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { ORDER_STATUSES, type OrderStatus } from "@/constants/enums";
import { ORDER_STATUS_LABELS } from "@/constants/labels";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetCustomerOrders } from "@/services/orders/queries";
import { OrderCard } from "./OrderCard";

const PAGE_SIZE = 10;

const STATUS_OPTIONS: ChipOption<OrderStatus | null>[] = [
  { value: null, label: "All orders" },
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

  let content: ReactNode;
  if (isLoading) {
    content = (
      <Stack gap="4" aria-label="Loading" aria-busy="true">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className={cn("h-44 w-full rounded-2xl")} />
        ))}
      </Stack>
    );
  } else if (isError) {
    content = <ErrorState title="Couldn't load your orders" message={error.message} onRetry={() => void refetch()} />;
  } else if (!data?.data.length) {
    content = (
      <Card>
        {status ? (
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
              <ButtonLink href={shopUrl()} size="lg">
                Start shopping
              </ButtonLink>
            }
          />
        )}
      </Card>
    );
  } else {
    content = (
      <Stack gap="6">
        <Stack as="ul" gap="4" className={cn(isFetching && "opacity-60 transition-opacity")}>
          {data.data.map((order) => (
            <Box as="li" key={order.id}>
              <OrderCard order={order} />
            </Box>
          ))}
        </Stack>
        <Pagination
          currentPage={data.meta.currentPage}
          totalPages={data.meta.pages}
          total={data.meta.total}
          limit={data.meta.limit}
          onPageChange={setPage}
          itemLabel="orders"
        />
      </Stack>
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
        options={STATUS_OPTIONS}
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

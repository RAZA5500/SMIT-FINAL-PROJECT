"use client";

import { ArrowLeft, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { ErrorState } from "@/components/shared/ErrorState";
import { CancelOrderDialog } from "@/components/shared/order/CancelOrderDialog";
import { OrderDetailsCard } from "@/components/shared/order/OrderDetailsCard";
import { OrderItemsCard } from "@/components/shared/order/OrderItemsCard";
import { OrderPaymentsCard } from "@/components/shared/order/OrderPaymentsCard";
import { OrderTimelineCard } from "@/components/shared/order/OrderTimelineCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CUSTOMER_CANCEL_REASONS, CUSTOMER_CANCELLABLE_STATUSES } from "@/constants/enums";
import { CUSTOMER_CANCEL_REASON_LABELS } from "@/constants/labels";
import { useNow } from "@/hooks/useNow";
import { formatDateTime } from "@/lib/format";
import { ApiError } from "@/lib/networking/request";
import { customerRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useCancelOrder } from "@/services/orders/mutations";
import { useGetCustomerOrderDetail } from "@/services/orders/queries";
import type { IOrder } from "@/services/orders/types";
import { OrderStatusBanner } from "./OrderStatusBanner";
import { PayNowDialog } from "./PayNowDialog";

/** PENDING + UNPAID/FAILED + deadline baqi → customer dobara pay kar sakta hai */
function canRetryPayment(order: IOrder, now: number): boolean {
  return (
    order.status === "PENDING" &&
    (order.paymentStatus === "UNPAID" || order.paymentStatus === "FAILED") &&
    new Date(order.paymentExpiresAt).getTime() > now
  );
}

const BREADCRUMB_ORDERS = { label: "My orders", href: customerRoutes.orders };

export function OrderDetailView({ id }: { id: string }) {
  const { data: order, isLoading, isError, error, refetch } = useGetCustomerOrderDetail(id);
  const cancelOrder = useCancelOrder();
  // Payment countdown ke liye har second; baaki statuses mein 30s kaafi
  const now = useNow(order?.status === "PENDING" ? 1000 : 30_000);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  const backLink = (
    <ButtonLink href={customerRoutes.orders} variant="outline">
      <ArrowLeft data-icon="inline-start" aria-hidden="true" />
      All orders
    </ButtonLink>
  );

  if (isLoading) {
    return (
      <CustomerPage title="Order details" breadcrumbs={[BREADCRUMB_ORDERS, { label: "Order" }]}>
        <Grid align="start" gap="6" aria-label="Loading" aria-busy="true" className={cn("lg:grid-cols-12")}>
          <Skeleton className={cn("h-80 w-full rounded-2xl lg:col-span-8")} />
          <Skeleton className={cn("h-80 w-full rounded-2xl lg:col-span-4")} />
        </Grid>
      </CustomerPage>
    );
  }

  if (isError || !order) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <CustomerPage title="Order details" breadcrumbs={[BREADCRUMB_ORDERS, { label: "Order" }]} actions={backLink}>
        <ErrorState
          title={notFound ? "Order not found" : "Couldn't load this order"}
          message={notFound ? "This order doesn't exist or doesn't belong to your account." : error?.message}
          onRetry={notFound ? undefined : () => void refetch()}
        />
      </CustomerPage>
    );
  }

  const canCancel = CUSTOMER_CANCELLABLE_STATUSES.includes(order.status);
  const canPay = canRetryPayment(order, now);

  return (
    <CustomerPage
      eyebrow={`Placed ${formatDateTime(order.createdAt)}`}
      title={
        <Text as="span" family="mono" className={cn("tracking-tight")}>
          {order.orderNumber}
        </Text>
      }
      meta={
        <>
          <StatusBadge status={order.status} />
          <StatusBadge status={order.paymentStatus} />
        </>
      }
      breadcrumbs={[BREADCRUMB_ORDERS, { label: order.orderNumber }]}
      actions={
        canCancel && (
          <Button variant="destructive" onClick={() => setCancelOpen(true)}>
            <XCircle data-icon="inline-start" aria-hidden="true" />
            Cancel order
          </Button>
        )
      }
    >
      <OrderStatusBanner order={order} now={now} canPay={canPay} onPay={() => setPayOpen(true)} />

      <Grid align="start" gap="6" className={cn("lg:grid-cols-12")}>
        <Stack gap="6" className={cn("lg:col-span-8")}>
          <OrderItemsCard order={order} />
          <OrderPaymentsCard order={order} />
        </Stack>
        <Stack gap="6" className={cn("lg:col-span-4")}>
          <OrderTimelineCard order={order} />
          <OrderDetailsCard order={order} />
        </Stack>
      </Grid>

      <CancelOrderDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        orderNumber={order.orderNumber}
        description={
          order.paymentStatus === "PAID"
            ? "Your payment will be refunded automatically."
            : "You haven't been charged for this order."
        }
        reasons={CUSTOMER_CANCEL_REASONS}
        labels={CUSTOMER_CANCEL_REASON_LABELS}
        isPending={cancelOrder.isPending}
        onSubmit={(payload) => cancelOrder.mutate({ id: order.id, payload }, { onSuccess: () => setCancelOpen(false) })}
      />
      <PayNowDialog order={order} open={payOpen} onOpenChange={setPayOpen} />
    </CustomerPage>
  );
}

"use client";

import { ArrowLeft, ArrowRight, Clock, CreditCard, Flag, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
import { AdminPage } from "@/components/admin/AdminPage";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { CancelOrderDialog } from "@/components/shared/order/CancelOrderDialog";
import { OrderDetailsCard } from "@/components/shared/order/OrderDetailsCard";
import { OrderItemsCard } from "@/components/shared/order/OrderItemsCard";
import { OrderPaymentsCard } from "@/components/shared/order/OrderPaymentsCard";
import { OrderTimelineCard } from "@/components/shared/order/OrderTimelineCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  ADMIN_CANCEL_REASONS,
  ADMIN_CANCELLABLE_STATUSES,
  ADMIN_NEXT_STATUSES,
  type OrderStatus,
} from "@/constants/enums";
import { ADMIN_CANCEL_REASON_LABELS, ORDER_STATUS_LABELS } from "@/constants/labels";
import { formatDateTime } from "@/lib/format";
import { ApiError } from "@/lib/networking/request";
import { adminRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useAdminCancelOrder, useUpdateOrderStatus } from "@/services/orders/mutations";
import { useGetAdminOrderDetail } from "@/services/orders/queries";
import type { IOrder } from "@/services/orders/types";

/** Allowed map + delivery type: PICKUP → READY_FOR_PICKUP, DELIVERY → READY_FOR_DELIVERY (FLOW-MD 01 §19) */
function nextStatuses(order: IOrder): OrderStatus[] {
  const wrongReady: OrderStatus = order.deliveryType === "PICKUP" ? "READY_FOR_DELIVERY" : "READY_FOR_PICKUP";
  return ADMIN_NEXT_STATUSES[order.status].filter((status) => status !== wrongReady);
}

/** Admin ko kya karna hai — status ke hisaab se ek line */
function nextStepCopy(order: IOrder): { icon: typeof Flag; title: string; text: string } {
  switch (order.status) {
    case "PENDING":
      return {
        icon: Clock,
        title: "Waiting for the customer to pay",
        text: `Unpaid orders are cancelled automatically at ${formatDateTime(order.paymentExpiresAt)}.`,
      };
    case "CONFIRMED":
      return { icon: Flag, title: "Paid — ready to prepare", text: "Start picking and packing this order." };
    case "PROCESSING":
      return {
        icon: Flag,
        title: "Being prepared",
        text:
          order.deliveryType === "PICKUP"
            ? "Mark it ready when it's waiting for collection."
            : "Mark it ready when it's out for delivery.",
      };
    case "READY_FOR_PICKUP":
    case "READY_FOR_DELIVERY":
      return { icon: Flag, title: "Ready", text: "Mark as delivered once the customer has it." };
    case "REFUND_PENDING":
      return {
        icon: CreditCard,
        title: "Refund in progress",
        text: "The refund is retried automatically if the payment gateway fails.",
      };
    case "DELIVERED":
      return { icon: Flag, title: "Completed", text: "Nothing left to do for this order." };
    case "CANCELLED":
      return { icon: XCircle, title: "Cancelled", text: "Stock has been returned to inventory." };
  }
}

export function AdminOrderDetailView({ id }: { id: string }) {
  const { data: order, isLoading, isError, error, refetch } = useGetAdminOrderDetail(id);
  const updateStatus = useUpdateOrderStatus();
  const cancelOrder = useAdminCancelOrder();
  const [cancelOpen, setCancelOpen] = useState(false);

  const backLink = (
    <ButtonLink href={adminRoutes.orders} variant="outline">
      <ArrowLeft data-icon="inline-start" aria-hidden="true" />
      All orders
    </ButtonLink>
  );

  if (isLoading) {
    return (
      <AdminPage title="Order details">
        <Stack gap="6" aria-label="Loading" aria-busy="true">
          <Skeleton className={cn("h-24 w-full rounded-2xl")} />
          <Grid gap="6" className={cn("lg:grid-cols-3")}>
            <Skeleton className={cn("h-80 w-full rounded-2xl lg:col-span-2")} />
            <Skeleton className={cn("h-80 w-full rounded-2xl")} />
          </Grid>
        </Stack>
      </AdminPage>
    );
  }

  if (isError || !order) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <AdminPage title="Order details" actions={backLink}>
        <ErrorState
          title={notFound ? "Order not found" : "Couldn't load this order"}
          message={notFound ? "It may have been removed." : error?.message}
          onRetry={notFound ? undefined : () => void refetch()}
        />
      </AdminPage>
    );
  }

  const canCancel = ADMIN_CANCELLABLE_STATUSES.includes(order.status);
  const transitions = nextStatuses(order);
  const step = nextStepCopy(order);
  const StepIcon = step.icon;
  const busy = updateStatus.isPending || cancelOrder.isPending;

  return (
    <AdminPage
      eyebrow={`Placed ${formatDateTime(order.createdAt)}`}
      title={
        <Text as="span" className={cn("font-bold tracking-tight")}>
          {order.orderNumber}
        </Text>
      }
      meta={
        <>
          <StatusBadge status={order.status} />
          <StatusBadge status={order.paymentStatus} />
        </>
      }
      actions={backLink}
    >
      <Card>
        <CardContent>
          <Flex direction="col" gap="4" className={cn("sm:flex-row sm:items-center")}>
            <Flex
              align="center"
              justify="center"
              className={cn("size-12 shrink-0 rounded-2xl border border-primary/20 bg-icon-green text-brand-green [&_svg]:size-6")}
            >
              <StepIcon aria-hidden="true" />
            </Flex>
            <Stack gap="0.5" className={cn("flex-1")}>
              <Text weight="semibold" size="base">
                {step.title}
              </Text>
              <Text tone="muted">{step.text}</Text>
            </Stack>
            <Flex wrap align="center" gap="2">
              {canCancel && (
                <Button variant="destructive" disabled={busy} onClick={() => setCancelOpen(true)}>
                  <XCircle data-icon="inline-start" aria-hidden="true" />
                  Cancel order
                </Button>
              )}
              {transitions.map((status) => (
                <LoadingButton
                  key={status}
                  variant="brand"
                  isLoading={updateStatus.isPending && updateStatus.variables?.payload.status === status}
                  disabled={busy}
                  onClick={() => updateStatus.mutate({ id: order.id, payload: { status } })}
                >
                  Mark as {ORDER_STATUS_LABELS[status]}
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </LoadingButton>
              ))}
            </Flex>
          </Flex>
        </CardContent>
      </Card>

      <Grid align="start" gap="6" className={cn("lg:grid-cols-3")}>
        <Stack gap="6" className={cn("lg:col-span-2")}>
          <OrderItemsCard order={order} />
          <OrderPaymentsCard order={order} />
        </Stack>
        <Stack gap="6">
          <OrderDetailsCard order={order} showCustomer />
          <OrderTimelineCard order={order} />
        </Stack>
      </Grid>

      <CancelOrderDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        orderNumber={order.orderNumber}
        description={
          order.paymentStatus === "PAID"
            ? "Stock goes back to inventory and the customer is refunded automatically."
            : "Stock goes back to inventory. The customer hasn't been charged."
        }
        reasons={ADMIN_CANCEL_REASONS}
        labels={ADMIN_CANCEL_REASON_LABELS}
        isPending={cancelOrder.isPending}
        onSubmit={(payload) => cancelOrder.mutate({ id: order.id, payload }, { onSuccess: () => setCancelOpen(false) })}
      />
    </AdminPage>
  );
}

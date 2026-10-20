"use client";

import { ArrowLeft, ArrowRight, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { CancelOrderDialog } from "@/components/shared/order/CancelOrderDialog";
import { OrderDetailsCard } from "@/components/shared/order/OrderDetailsCard";
import { OrderItemsCard } from "@/components/shared/order/OrderItemsCard";
import { OrderPaymentsCard } from "@/components/shared/order/OrderPaymentsCard";
import { OrderTimelineCard } from "@/components/shared/order/OrderTimelineCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useAdminCancelOrder, useUpdateOrderStatus } from "@/services/orders/mutations";
import { useGetAdminOrderDetail } from "@/services/orders/queries";
import type { IOrder } from "@/services/orders/types";

/** Allowed map + delivery type: PICKUP → READY_FOR_PICKUP, DELIVERY → READY_FOR_DELIVERY (FLOW-MD 01 §19) */
function nextStatuses(order: IOrder): OrderStatus[] {
  const wrongReady: OrderStatus = order.deliveryType === "PICKUP" ? "READY_FOR_DELIVERY" : "READY_FOR_PICKUP";
  return ADMIN_NEXT_STATUSES[order.status].filter((status) => status !== wrongReady);
}

export function AdminOrderDetailView({ id }: { id: string }) {
  const { data: order, isLoading, isError, error, refetch } = useGetAdminOrderDetail(id);
  const updateStatus = useUpdateOrderStatus();
  const cancelOrder = useAdminCancelOrder();
  const [cancelOpen, setCancelOpen] = useState(false);

  const backLink = (
    <Link href={adminRoutes.orders} className={buttonVariants({ variant: "outline", size: "xl" })}>
      <ArrowLeft aria-hidden="true" />
      All orders
    </Link>
  );

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 bg-navbar-bg p-4 sm:p-5" aria-label="Loading" aria-busy="true">
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-72 w-full rounded-xl lg:col-span-2" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      </main>
    );
  }

  if (isError || !order) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <main className="flex flex-1 flex-col items-center gap-4 bg-navbar-bg p-4 sm:p-5">
        <ErrorState
          title={notFound ? "Order not found" : "Couldn't load this order"}
          message={notFound ? "It may have been removed." : error?.message}
          onRetry={notFound ? undefined : () => void refetch()}
        />
        {backLink}
      </main>
    );
  }

  const canCancel = ADMIN_CANCELLABLE_STATUSES.includes(order.status);
  const transitions = nextStatuses(order);

  return (
    // Fixed-height shell mein scroll — `*:shrink-0` taa ke cards (overflow-hidden) daba kar chhote na hon
    <main className="flex flex-1 flex-col gap-4 overflow-y-auto bg-navbar-bg p-4 *:shrink-0 sm:p-5">
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-gray-900">{order.orderNumber}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={order.status} />
              <StatusBadge status={order.paymentStatus} />
              <span className="text-sm text-gray-500">Placed {formatDateTime(order.createdAt)}</span>
            </div>
            {order.status === "PENDING" && (
              <p className="text-sm text-gray-500">
                Waiting for customer payment — expires {formatDateTime(order.paymentExpiresAt)}.
              </p>
            )}
            {order.status === "REFUND_PENDING" && (
              <p className="text-sm text-gray-500">Refund in progress — it is retried automatically if the gateway fails.</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {backLink}
            {canCancel && (
              <Button variant="outline" size="xl" className="text-destructive" onClick={() => setCancelOpen(true)}>
                <XCircle aria-hidden="true" />
                Cancel order
              </Button>
            )}
            {transitions.map((status) => (
              <LoadingButton
                key={status}
                variant="cta"
                size="xl"
                isLoading={updateStatus.isPending && updateStatus.variables?.payload.status === status}
                disabled={updateStatus.isPending || cancelOrder.isPending}
                onClick={() => updateStatus.mutate({ id: order.id, payload: { status } })}
              >
                Mark as {ORDER_STATUS_LABELS[status]}
                <ArrowRight aria-hidden="true" />
              </LoadingButton>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid items-start gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <OrderItemsCard order={order} />
          <OrderTimelineCard order={order} />
        </div>
        <div className="flex flex-col gap-4">
          <OrderDetailsCard order={order} showCustomer />
          <OrderPaymentsCard order={order} />
        </div>
      </div>

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
        onSubmit={(payload) =>
          cancelOrder.mutate({ id: order.id, payload }, { onSuccess: () => setCancelOpen(false) })
        }
      />
    </main>
  );
}

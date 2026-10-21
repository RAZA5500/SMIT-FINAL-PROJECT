"use client";

import { ArrowLeft, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { ErrorState } from "@/components/shared/ErrorState";
import { CancelOrderDialog } from "@/components/shared/order/CancelOrderDialog";
import { OrderDetailsCard } from "@/components/shared/order/OrderDetailsCard";
import { OrderItemsCard } from "@/components/shared/order/OrderItemsCard";
import { OrderPaymentsCard } from "@/components/shared/order/OrderPaymentsCard";
import { OrderTimelineCard } from "@/components/shared/order/OrderTimelineCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CUSTOMER_CANCEL_REASONS, CUSTOMER_CANCELLABLE_STATUSES } from "@/constants/enums";
import { CUSTOMER_CANCEL_REASON_LABELS } from "@/constants/labels";
import { useNow } from "@/hooks/useNow";
import { formatDateTime } from "@/lib/format";
import { ApiError } from "@/lib/networking/request";
import { customerRoutes } from "@/lib/routes/routes";
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
    <Link href={customerRoutes.orders} className={buttonVariants({ variant: "outline" })}>
      <ArrowLeft aria-hidden="true" />
      All orders
    </Link>
  );

  if (isLoading) {
    return (
      <CustomerPage title="Order details" breadcrumbs={[BREADCRUMB_ORDERS, { label: "Order" }]}>
        <div className="grid items-start gap-6 lg:grid-cols-3" aria-label="Loading" aria-busy="true">
          <Skeleton className="h-80 w-full rounded-3xl lg:col-span-2" />
          <Skeleton className="h-80 w-full rounded-3xl" />
        </div>
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
      eyebrow="Order details"
      title={order.orderNumber}
      description={
        <span className="flex flex-wrap items-center gap-2">
          Placed {formatDateTime(order.createdAt)}
          <StatusBadge status={order.status} />
          <StatusBadge status={order.paymentStatus} />
        </span>
      }
      breadcrumbs={[BREADCRUMB_ORDERS, { label: order.orderNumber }]}
      actions={
        canCancel && (
          <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => setCancelOpen(true)}>
            <XCircle aria-hidden="true" />
            Cancel order
          </Button>
        )
      }
    >
      <OrderStatusBanner order={order} now={now} canPay={canPay} onPay={() => setPayOpen(true)} />

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <OrderItemsCard order={order} />
          <OrderPaymentsCard order={order} />
        </div>
        <div className="flex flex-col gap-6">
          <OrderTimelineCard order={order} />
          <OrderDetailsCard order={order} />
        </div>
      </div>

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
        onSubmit={(payload) =>
          cancelOrder.mutate({ id: order.id, payload }, { onSuccess: () => setCancelOpen(false) })
        }
      />
      <PayNowDialog order={order} open={payOpen} onOpenChange={setPayOpen} />
    </CustomerPage>
  );
}

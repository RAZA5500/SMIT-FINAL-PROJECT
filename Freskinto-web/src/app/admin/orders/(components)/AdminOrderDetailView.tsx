"use client";

import { ArrowLeft, ArrowRight, Clock, CreditCard, Flag, ReceiptText, Route, XCircle, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminPage } from "@/components/admin/AdminPage";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { CancelOrderDialog } from "@/components/shared/order/CancelOrderDialog";
import { OrderInfo } from "@/components/shared/order/OrderInfo";
import { OrderLines } from "@/components/shared/order/OrderLines";
import { OrderTimeline } from "@/components/shared/order/OrderTimeline";
import { OrderTotals } from "@/components/shared/order/OrderTotals";
import { PaymentAttempts } from "@/components/shared/order/PaymentAttempts";
import { Price } from "@/components/shared/Price";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  ADMIN_CANCEL_REASONS,
  ADMIN_CANCELLABLE_STATUSES,
  ADMIN_NEXT_STATUSES,
  type OrderStatus,
} from "@/constants/enums";
import { ADMIN_CANCEL_REASON_LABELS, CANCELLATION_REASON_LABELS, ORDER_STATUS_LABELS } from "@/constants/labels";
import { ApiError } from "@/lib/api";
import { orderSteps } from "@/lib/order-steps";
import { adminRoutes } from "@/lib/routes/routes";
import { formatDateTime, pluralize } from "@/lib/utils";
import { useAdminCancelOrder, useUpdateOrderStatus } from "@/services/orders/mutations";
import { useGetAdminOrderDetail } from "@/services/orders/queries";
import type { IOrder } from "@/services/orders/types";

/** Allowed map + delivery type: PICKUP → READY_FOR_PICKUP, DELIVERY → READY_FOR_DELIVERY (FLOW-MD 01 §19) */
function nextStatuses(order: IOrder): OrderStatus[] {
  const wrongReady: OrderStatus = order.deliveryType === "PICKUP" ? "READY_FOR_DELIVERY" : "READY_FOR_PICKUP";
  return ADMIN_NEXT_STATUSES[order.status].filter((status) => status !== wrongReady);
}

/** Admin ko kya karna hai — status ke hisaab se ek line */
function nextStepCopy(order: IOrder): { icon: LucideIcon; title: string; text: string } {
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
      <ArrowLeft aria-hidden="true" />
      All orders
    </ButtonLink>
  );

  if (isLoading) {
    return (
      <AdminPage title="Order details">
        <div aria-label="Loading" aria-busy="true" className="flex flex-col gap-6">
          <Skeleton className="h-24 w-full rounded-15" />
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-80 w-full rounded-15 lg:col-span-2" />
            <Skeleton className="h-80 w-full rounded-15" />
          </div>
        </div>
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
  const pickup = order.deliveryType === "PICKUP";

  return (
    <AdminPage
      eyebrow={`Placed ${formatDateTime(order.createdAt)}`}
      title={<span className="numeric">{order.orderNumber}</span>}
      meta={
        <>
          <StatusBadge status={order.status} />
          <StatusBadge status={order.paymentStatus} />
        </>
      }
      actions={backLink}
    >
      <section
        aria-label="Next step"
        className="flex flex-col gap-4 rounded-15 border border-border bg-card p-5 shadow-soft sm:flex-row sm:items-center"
      >
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-green [&_svg]:size-6"
        >
          <StepIcon />
        </span>
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="font-semibold">{step.title}</p>
          <p className="text-sm text-muted-foreground">{step.text}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {canCancel && (
            <Button variant="destructive-outline" disabled={busy} onClick={() => setCancelOpen(true)}>
              <XCircle aria-hidden="true" />
              Cancel order
            </Button>
          )}
          {transitions.map((status) => (
            <LoadingButton
              key={status}
              isLoading={updateStatus.isPending && updateStatus.variables?.payload.status === status}
              disabled={busy}
              onClick={() => updateStatus.mutate({ id: order.id, payload: { status } })}
            >
              Mark as {ORDER_STATUS_LABELS[status]}
              <ArrowRight aria-hidden="true" />
            </LoadingButton>
          ))}
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <SectionCard
            title="Items"
            icon={<ReceiptText />}
            action={<span className="text-fs-13 text-muted-foreground">{pluralize(order.items.length, "line")}</span>}
          >
            <div className="flex flex-col gap-5">
              <OrderLines
                lines={order.items.map((item) => ({
                  id: item.id,
                  name: item.productName,
                  sku: item.sku,
                  quantity: item.quantity,
                  price: item.price,
                  subtotal: item.subtotal,
                }))}
              />
              <OrderTotals
                subtotal={order.subtotal}
                shippingCost={order.shippingCost}
                total={order.total}
                shippingLabel={pickup ? "Collection" : "Delivery"}
                className="ml-auto w-full max-w-xs"
              />
            </div>
          </SectionCard>
          <SectionCard title="Payments" icon={<CreditCard />}>
            <PaymentAttempts payments={order.payments} />
          </SectionCard>
        </div>

        <div className="flex flex-col gap-6">
          <SectionCard title="Details">
            <OrderInfo
              pickup={pickup}
              pickupAt={order.pickupScheduledAt}
              addressText={
                order.address
                  ? `${order.address.addressLine}, ${order.address.city}, ${order.address.county}, ${order.address.postcode}`
                  : null
              }
              customer={order.customer}
              notes={order.customerNotes}
              cancellation={
                order.cancellationReason
                  ? {
                      reason: CANCELLATION_REASON_LABELS[order.cancellationReason] ?? order.cancellationReason,
                      note: order.cancellationNote,
                    }
                  : null
              }
            />
          </SectionCard>
          <SectionCard title="Order tracking" icon={<Route />}>
            <OrderTimeline steps={orderSteps(order)} cancelledAt={order.cancelledAt} />
          </SectionCard>
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
        entitySummary={
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="numeric font-semibold">{order.orderNumber}</p>
              <p className="truncate text-fs-13 text-muted-foreground">
                {order.customer.name} · {pluralize(order.items.length, "line")}
              </p>
            </div>
            <Price amount={order.total} size="md" />
          </div>
        }
        reasons={ADMIN_CANCEL_REASONS}
        labels={ADMIN_CANCEL_REASON_LABELS}
        isPending={cancelOrder.isPending}
        onSubmit={(payload) => cancelOrder.mutate({ id: order.id, payload }, { onSuccess: () => setCancelOpen(false) })}
      />
    </AdminPage>
  );
}

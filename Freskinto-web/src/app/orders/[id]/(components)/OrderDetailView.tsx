"use client";

import { ArrowLeft, CreditCard, ReceiptText, Route, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { ErrorState } from "@/components/shared/ErrorState";
import { CancelOrderDialog } from "@/components/shared/order/CancelOrderDialog";
import { OrderInfo } from "@/components/shared/order/OrderInfo";
import { OrderLines } from "@/components/shared/order/OrderLines";
import { OrderTimeline } from "@/components/shared/order/OrderTimeline";
import { OrderTotals } from "@/components/shared/order/OrderTotals";
import { PaymentAttempts } from "@/components/shared/order/PaymentAttempts";
import { Price } from "@/components/shared/Price";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CUSTOMER_CANCEL_REASONS, CUSTOMER_CANCELLABLE_STATUSES } from "@/constants/enums";
import { CANCELLATION_REASON_LABELS, CUSTOMER_CANCEL_REASON_LABELS } from "@/constants/labels";
import { useNow } from "@/hooks/useNow";
import { ApiError } from "@/lib/api";
import { orderSteps } from "@/lib/order-steps";
import { customerRoutes } from "@/lib/routes/routes";
import { formatDateTime, pluralize } from "@/lib/utils";
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
      <ArrowLeft aria-hidden="true" />
      All orders
    </ButtonLink>
  );

  if (isLoading) {
    return (
      <CustomerPage title="Order details" breadcrumbs={[BREADCRUMB_ORDERS, { label: "Order" }]}>
        <div aria-label="Loading" aria-busy="true" className="grid items-start gap-6 lg:grid-cols-12">
          <Skeleton className="h-80 w-full rounded-15 lg:col-span-8" />
          <Skeleton className="h-80 w-full rounded-15 lg:col-span-4" />
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
  const pickup = order.deliveryType === "PICKUP";

  return (
    <CustomerPage
      eyebrow={`Placed ${formatDateTime(order.createdAt)}`}
      title={<span className="numeric tracking-tight">{order.orderNumber}</span>}
      meta={
        <>
          <StatusBadge status={order.status} />
          <StatusBadge status={order.paymentStatus} />
        </>
      }
      breadcrumbs={[BREADCRUMB_ORDERS, { label: order.orderNumber }]}
      actions={
        canCancel && (
          <Button variant="destructive-outline" onClick={() => setCancelOpen(true)}>
            <XCircle aria-hidden="true" />
            Cancel order
          </Button>
        )
      }
    >
      <OrderStatusBanner order={order} now={now} canPay={canPay} onPay={() => setPayOpen(true)} />

      <div className="grid items-start gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-8">
          <SectionCard title="Items" icon={<ReceiptText />} action={<span className="text-fs-13 text-muted-foreground">{pluralize(order.items.length, "line")}</span>}>
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

        <div className="flex flex-col gap-6 lg:col-span-4">
          <SectionCard title="Order tracking" icon={<Route />}>
            <OrderTimeline steps={orderSteps(order)} cancelledAt={order.cancelledAt} />
          </SectionCard>
          <SectionCard title="Details">
            <OrderInfo
              pickup={pickup}
              pickupAt={order.pickupScheduledAt}
              addressText={
                order.address
                  ? `${order.address.addressLine}, ${order.address.city}, ${order.address.county}, ${order.address.postcode}`
                  : null
              }
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
        entitySummary={
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="numeric font-semibold">{order.orderNumber}</p>
              <p className="text-fs-13 text-muted-foreground">
                {pluralize(order.items.length, "line")} · {formatDateTime(order.createdAt)}
              </p>
            </div>
            <Price amount={order.total} size="md" />
          </div>
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

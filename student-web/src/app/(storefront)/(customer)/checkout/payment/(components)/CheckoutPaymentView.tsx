"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, MapPin, NotebookPen, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CartSummary } from "@/components/customer/cart/CartSummary";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { MockOutcomeField } from "@/components/customer/payment/MockOutcomeField";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DELIVERY_TYPE_LABELS } from "@/constants/labels";
import { notifyPaymentResult, PaymentStartError, usePayOrder } from "@/hooks/usePayOrder";
import { clearOrderIntent, readOrderIntent } from "@/lib/checkout-intent";
import { formatDateTime, formatMoney } from "@/lib/format";
import { ApiError } from "@/lib/networking/request";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { toastError } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { mockPaymentSchema, type MockPaymentFormValues } from "@/modules/zod/payment.model";
import { useGetAddresses } from "@/services/addresses/queries";
import { useGetCart } from "@/services/cart/queries";
import { useCancelOrder, useCreateOrder } from "@/services/orders/mutations";
import type { ICreateOrderPayload, IOrder } from "@/services/orders/types";

const PAYMENT_FORM_ID = "payment-form";
const PAYMENT_START_FAILED_NOTE = "Payment could not be started";
const ADDRESS_LIST_LIMIT = 100;

function DeliveryDetails({ intent }: { intent: ICreateOrderPayload }) {
  const { data: addresses } = useGetAddresses({ limit: ADDRESS_LIST_LIMIT });
  const saved = addresses?.data.find((address) => address.id === intent.addressId);
  const address = intent.shippingAddress ?? saved;

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-2">
        <CardTitle className="text-base font-semibold text-gray-900">
          {DELIVERY_TYPE_LABELS[intent.deliveryType]}
        </CardTitle>
        <Link href={customerRoutes.checkout} className="text-sm font-medium text-brand-green hover:underline">
          Change
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm text-gray-700">
        {intent.deliveryType === "PICKUP" ? (
          <p className="flex items-center gap-2">
            <CalendarClock className="size-4 text-brand-green" aria-hidden="true" />
            Pickup at {formatDateTime(intent.pickupScheduledAt)}
          </p>
        ) : (
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-brand-green" aria-hidden="true" />
            {address ? (
              <span>
                {address.addressLine}, {address.city}, {address.county}, {address.postcode}
              </span>
            ) : (
              <span className="text-gray-500">Saved address</span>
            )}
          </p>
        )}
        {intent.customerNotes && (
          <p className="flex items-start gap-2">
            <NotebookPen className="mt-0.5 size-4 shrink-0 text-brand-green" aria-hidden="true" />
            {intent.customerNotes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * "Pay Now": `POST /orders` → `POST /payments/initiate` → mock-complete (FLOW-MD 08 §16).
 * Duplicate order se bachao: button pending mein disabled + ref guard; backend order ke
 * saath cart khali karta hai, is liye dobara request 400 "Cart is empty" deti hai.
 */
export function CheckoutPaymentView() {
  const router = useRouter();
  // AuthGuard hydration ke baad hi render karta hai — sessionStorage yahan available hai
  const [intent] = useState(readOrderIntent);
  const { data: cart, isLoading, isError, error, refetch } = useGetCart();
  const createOrder = useCreateOrder();
  const cancelOrder = useCancelOrder({ silent: true });
  const { pay, isPending: isPaying } = usePayOrder();
  const submittingRef = useRef(false);

  const { control, handleSubmit } = useForm<MockPaymentFormValues>({
    resolver: zodResolver(mockPaymentSchema),
    defaultValues: { outcome: "succeeded" },
  });

  const isBusy = createOrder.isPending || isPaying || cancelOrder.isPending;

  const handleCreateOrderError = (err: Error) => {
    if (err instanceof ApiError && err.status === 409) {
      toastError("Duplicate request", "This order is already being processed. Please check your orders.");
    } else if (err.message.includes("Not enough stock")) {
      toastError("Out of stock", err.message);
    } else if (err.message.includes("Cart is empty")) {
      clearOrderIntent();
      toastError("Your cart is empty", "Add products to your cart to place an order.");
      router.replace(publicRoutes.shop);
    } else {
      toastError("Couldn't place your order", err.message);
    }
  };

  const onPay = async ({ outcome }: MockPaymentFormValues) => {
    if (!intent || submittingRef.current) return;
    submittingRef.current = true;
    try {
      let order: IOrder;
      try {
        order = await createOrder.mutateAsync(intent);
      } catch (err) {
        handleCreateOrderError(err as Error);
        return;
      }
      clearOrderIntent();

      try {
        notifyPaymentResult(await pay(order.id, outcome), order.orderNumber);
      } catch (err) {
        if (err instanceof PaymentStartError) {
          // Payment shuru hi na ho saki — order cancel taa ke stock wapas aaye
          const cancelled = await cancelOrder
            .mutateAsync({ id: order.id, payload: { reason: "OTHER", note: PAYMENT_START_FAILED_NOTE } })
            .then(
              () => true,
              () => false,
            );
          toastError(
            "Payment could not be started",
            cancelled
              ? `${err.message} Order ${order.orderNumber} was cancelled and you have not been charged.`
              : `${err.message} You have not been charged. Order ${order.orderNumber} will be cancelled automatically if it isn't paid.`,
          );
        } else {
          toastError("Payment failed", (err as Error).message);
        }
      }
      router.replace(customerRoutes.orderDetail(order.id));
    } finally {
      submittingRef.current = false;
    }
  };

  let content;
  if (!intent) {
    content = (
      <EmptyState
        title="Nothing to pay for yet"
        message="Start from checkout to choose delivery or pickup."
        action={
          <Link href={customerRoutes.checkout} className={buttonVariants({ variant: "brand", size: "xl" })}>
            Go to checkout
          </Link>
        }
      />
    );
  } else if (isLoading) {
    content = (
      <div className="grid items-start gap-6 lg:grid-cols-3" aria-label="Loading" aria-busy="true">
        <Skeleton className="h-64 w-full rounded-xl lg:col-span-2" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  } else if (isError) {
    content = <ErrorState title="Couldn't load your cart" message={error.message} onRetry={() => void refetch()} />;
  } else if (!cart || cart.items.length === 0) {
    content = (
      <EmptyState
        icon={<ShoppingBasket className="size-6" aria-hidden="true" />}
        title="Your cart is empty"
        message="If you already placed this order, you can find it in your orders."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={customerRoutes.orders} className={buttonVariants({ variant: "brand", size: "xl" })}>
              My orders
            </Link>
            <Link href={publicRoutes.shop} className={buttonVariants({ variant: "outline", size: "xl" })}>
              Browse products
            </Link>
          </div>
        }
      />
    );
  } else {
    content = (
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <DeliveryDetails intent={intent} />
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-gray-900">Payment</CardTitle>
            </CardHeader>
            <CardContent>
              {/* handleSubmit event ke waqt — onPay ka ref guard render mein nahi padha jata */}
              <form id={PAYMENT_FORM_ID} noValidate onSubmit={(event) => void handleSubmit(onPay)(event)}>
                <MockOutcomeField control={control} disabled={isBusy} />
              </form>
            </CardContent>
          </Card>
        </div>

        <CartSummary cart={cart} showItems>
          <LoadingButton
            type="submit"
            form={PAYMENT_FORM_ID}
            variant="brand"
            size="xl"
            className="w-full"
            isLoading={isBusy}
            loadingText="Processing payment…"
          >
            Pay {formatMoney(cart.grandTotal)}
          </LoadingButton>
          <Link
            href={customerRoutes.checkout}
            aria-disabled={isBusy || undefined}
            className={cn(
              buttonVariants({ variant: "ghost", size: "xl" }),
              "w-full text-brand-green",
              isBusy && "pointer-events-none opacity-50",
            )}
          >
            Back to checkout
          </Link>
        </CartSummary>
      </div>
    );
  }

  return (
    <CustomerPage title="Payment" description="Review your order and pay to confirm it.">
      {content}
    </CustomerPage>
  );
}

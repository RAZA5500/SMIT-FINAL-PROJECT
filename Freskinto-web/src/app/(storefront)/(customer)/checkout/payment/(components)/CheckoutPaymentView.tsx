"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Clock, CreditCard, Lock, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CartSummary } from "@/components/customer/cart/CartSummary";
import { CheckoutSteps } from "@/components/customer/checkout/CheckoutSteps";
import { MockOutcomeField } from "@/components/customer/payment/MockOutcomeField";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { notifyPaymentResult, PaymentStartError, usePayOrder } from "@/hooks/usePayOrder";
import { clearOrderIntent, readOrderIntent } from "@/lib/checkout-intent";
import { formatMoney } from "@/lib/format";
import { ApiError } from "@/lib/networking/request";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { toastError } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { mockPaymentSchema, type MockPaymentFormValues } from "@/modules/zod/payment.model";
import { useGetCart } from "@/services/cart/queries";
import { useCancelOrder, useCreateOrder } from "@/services/orders/mutations";
import type { IOrder } from "@/services/orders/types";
import { DeliveryDetails } from "./DeliveryDetails";

const PAYMENT_FORM_ID = "payment-form";
const PAYMENT_START_FAILED_NOTE = "Payment could not be started";

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
      toastError("Your basket is empty", "Add products to your basket to place an order.");
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
        icon={<CreditCard aria-hidden="true" />}
        title="Nothing to pay for yet"
        message="Start from checkout to choose delivery or collection."
        action={
          <Link href={customerRoutes.checkout} className={buttonVariants({ size: "lg" })}>
            Go to checkout
          </Link>
        }
      />
    );
  } else if (isLoading) {
    content = (
      <div className="grid items-start gap-6 lg:grid-cols-5 lg:gap-8" aria-label="Loading" aria-busy="true">
        <div className="flex flex-col gap-5 lg:col-span-3">
          <Skeleton className="h-36 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl lg:col-span-2" />
      </div>
    );
  } else if (isError) {
    content = <ErrorState title="Couldn't load your basket" message={error.message} onRetry={() => void refetch()} />;
  } else if (!cart || cart.items.length === 0) {
    content = (
      <EmptyState
        icon={<ShoppingBasket aria-hidden="true" />}
        title="Your basket is empty"
        message="If you already placed this order, you can find it in your orders."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={customerRoutes.orders} className={buttonVariants({ size: "lg" })}>
              My orders
            </Link>
            <Link href={publicRoutes.shop} className={buttonVariants({ variant: "outline", size: "lg" })}>
              Browse products
            </Link>
          </div>
        }
      />
    );
  } else {
    content = (
      <div className="grid items-start gap-6 lg:grid-cols-5 lg:gap-8">
        <div className="flex flex-col gap-5 lg:col-span-3">
          <DeliveryDetails intent={intent} />
          <section className="flex flex-col gap-4 rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border sm:p-6">
            <h2 className="flex items-center gap-2.5 text-lg font-bold">
              <span className="flex size-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <CreditCard className="size-5" aria-hidden="true" />
              </span>
              Payment
            </h2>
            {/* handleSubmit event ke waqt — onPay ka ref guard render mein nahi padha jata */}
            <form id={PAYMENT_FORM_ID} noValidate onSubmit={(event) => void handleSubmit(onPay)(event)}>
              <MockOutcomeField control={control} disabled={isBusy} />
            </form>
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <Clock className="mt-px size-3.5 shrink-0" aria-hidden="true" />
              Your order is placed when you pay. If a payment doesn&apos;t go through, you can retry from the order page
              within 5 minutes.
            </p>
          </section>
        </div>

        <CartSummary cart={cart} showItems className="lg:sticky lg:top-6 lg:col-span-2">
          <LoadingButton
            type="submit"
            form={PAYMENT_FORM_ID}
            size="xl"
            className="w-full"
            isLoading={isBusy}
            loadingText="Processing payment…"
          >
            <Lock aria-hidden="true" />
            Pay {formatMoney(cart.grandTotal)}
          </LoadingButton>
          <Link
            href={customerRoutes.checkout}
            aria-disabled={isBusy || undefined}
            className={cn(buttonVariants({ variant: "ghost" }), "w-full", isBusy && "pointer-events-none opacity-50")}
          >
            <ArrowLeft aria-hidden="true" />
            Back to delivery details
          </Link>
        </CartSummary>
      </div>
    );
  }

  return (
    <div className="container-page flex flex-col gap-6 py-6 sm:gap-8 sm:py-10">
      <div className="flex flex-col gap-5">
        <CheckoutSteps current={2} />
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold sm:text-4xl">Payment</h1>
          <p className="text-muted-foreground">Check your order and pay to confirm it.</p>
        </div>
      </div>
      {content}
    </div>
  );
}

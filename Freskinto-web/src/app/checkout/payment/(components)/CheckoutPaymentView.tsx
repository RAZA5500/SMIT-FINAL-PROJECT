"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Clock, CreditCard, Lock, ShoppingBasket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";
import { CartSummaryCard } from "@/components/customer/cart/CartSummaryCard";
import { CheckoutSteps } from "@/components/customer/checkout/CheckoutSteps";
import { MockOutcomeField } from "@/components/customer/checkout/MockOutcomeField";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { STORE } from "@/constants/store";
import { notifyPaymentResult, PaymentStartError, usePayOrder } from "@/hooks/usePayOrder";
import { ApiError } from "@/lib/api";
import { clearOrderIntent, readOrderIntent } from "@/lib/checkout-intent";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { toastError } from "@/lib/toast";
import { cn, formatMoney, scrollToFirstError } from "@/lib/utils";
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
    mode: "onChange",
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
          <ButtonLink href={customerRoutes.checkout} variant="cta" size="lg">
            Go to checkout
          </ButtonLink>
        }
      />
    );
  } else if (isLoading) {
    content = (
      <div aria-label="Loading" aria-busy="true" className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-5 lg:col-span-7">
          <Skeleton className="h-36 w-full rounded-15" />
          <Skeleton className="h-72 w-full rounded-15" />
        </div>
        <Skeleton className="h-96 w-full rounded-15 lg:col-span-5" />
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
          <>
            <ButtonLink href={customerRoutes.orders} variant="cta" size="lg">
              My orders
            </ButtonLink>
            <ButtonLink href={publicRoutes.shop} variant="outline" size="lg" className="rounded-full">
              Browse products
            </ButtonLink>
          </>
        }
      />
    );
  } else {
    content = (
      <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-5 lg:col-span-7">
          <DeliveryDetails intent={intent} />
          <section
            aria-label="Payment"
            className="flex flex-col gap-5 rounded-15 border border-border bg-card p-5 shadow-soft sm:p-6"
          >
            <header className="flex flex-col gap-1">
              <h2 className="flex items-center gap-2 font-heading text-fs-18 font-semibold">
                <CreditCard aria-hidden="true" className="size-5 text-brand-green" />
                Payment
              </h2>
              <p className="text-sm text-muted-foreground">Your order is placed when you pay.</p>
            </header>
            {/* handleSubmit event ke waqt — onPay ka ref guard render mein nahi padha jata */}
            <form
              id={PAYMENT_FORM_ID}
              noValidate
              onSubmit={(event) => void handleSubmit(onPay, () => scrollToFirstError(PAYMENT_FORM_ID))(event)}
            >
              <MockOutcomeField control={control} disabled={isBusy} />
            </form>
            <p className="flex items-start gap-2 text-fs-13 text-muted-foreground">
              <Clock aria-hidden="true" className="mt-px size-3.5 shrink-0" />
              If a payment doesn&apos;t go through, you can retry from the order page within {STORE.paymentWindowMinutes}{" "}
              minutes.
            </p>
          </section>
        </div>

        <CartSummaryCard cart={cart} showItems className="lg:sticky lg:top-6 lg:col-span-5">
          <LoadingButton
            type="submit"
            form={PAYMENT_FORM_ID}
            variant="cta"
            size="xl"
            className="w-full"
            isLoading={isBusy}
            loadingText="Processing payment…"
          >
            <Lock aria-hidden="true" />
            Pay {formatMoney(cart.grandTotal)}
          </LoadingButton>
          <ButtonLink
            href={customerRoutes.checkout}
            variant="ghost"
            aria-disabled={isBusy || undefined}
            className={cn("w-full", isBusy && "pointer-events-none opacity-50")}
          >
            <ArrowLeft aria-hidden="true" />
            Back to delivery details
          </ButtonLink>
        </CartSummaryCard>
      </div>
    );
  }

  return (
    <div className="page-container flex flex-col gap-8 py-8 sm:py-10">
      <div className="flex flex-col gap-6">
        <CheckoutSteps current={2} />
        <PageHeader eyebrow="Step 3 of 3" title="Payment" description="Check your order and pay to confirm it." />
      </div>
      {content}
    </div>
  );
}

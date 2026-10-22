"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Clock, CreditCard, Lock, ShoppingBasket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Grid } from "@/components/ui/grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
import { CartReceipt } from "@/components/customer/cart/CartReceipt";
import { CheckoutSteps } from "@/components/customer/checkout/CheckoutSteps";
import { MockOutcomeField } from "@/components/customer/checkout/MockOutcomeField";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { STORE } from "@/constants/store";
import { notifyPaymentResult, PaymentStartError, usePayOrder } from "@/hooks/usePayOrder";
import { clearOrderIntent, readOrderIntent } from "@/lib/checkout-intent";
import { formatMoney } from "@/lib/format";
import { scrollToFirstError } from "@/lib/forms";
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
          <ButtonLink href={customerRoutes.checkout} size="lg">
            Go to checkout
          </ButtonLink>
        }
      />
    );
  } else if (isLoading) {
    content = (
      <Grid align="start" gap="6" aria-label="Loading" aria-busy="true" className={cn("lg:grid-cols-12 lg:gap-8")}>
        <Stack gap="5" className={cn("lg:col-span-7")}>
          <Skeleton className={cn("h-36 w-full rounded-2xl")} />
          <Skeleton className={cn("h-72 w-full rounded-2xl")} />
        </Stack>
        <Skeleton className={cn("h-96 w-full rounded-2xl lg:col-span-5")} />
      </Grid>
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
          <Flex wrap justify="center" gap="3">
            <ButtonLink href={customerRoutes.orders} size="lg">
              My orders
            </ButtonLink>
            <ButtonLink href={publicRoutes.shop} variant="outline" size="lg">
              Browse products
            </ButtonLink>
          </Flex>
        }
      />
    );
  } else {
    content = (
      <Grid align="start" gap="6" className={cn("lg:grid-cols-12 lg:gap-8")}>
        <Stack gap="5" className={cn("lg:col-span-7")}>
          <DeliveryDetails intent={intent} />
          <Card>
            <CardHeader>
              <CardTitle>
                <Flex as="span" align="center" gap="2">
                  <CreditCard aria-hidden="true" className={cn("size-5 text-brand")} />
                  Payment
                </Flex>
              </CardTitle>
              <CardDescription>Your order is placed when you pay.</CardDescription>
            </CardHeader>
            <CardContent className={cn("flex flex-col gap-5")}>
              {/* handleSubmit event ke waqt — onPay ka ref guard render mein nahi padha jata */}
              <Form id={PAYMENT_FORM_ID} onSubmit={(event) => void handleSubmit(onPay, () => scrollToFirstError(PAYMENT_FORM_ID))(event)}>
                <MockOutcomeField control={control} disabled={isBusy} />
              </Form>
              <Text variant="small" tone="muted" className={cn("flex items-start gap-2")}>
                <Clock aria-hidden="true" className={cn("mt-px size-3.5 shrink-0")} />
                If a payment doesn&apos;t go through, you can retry from the order page within{" "}
                {STORE.paymentWindowMinutes} minutes.
              </Text>
            </CardContent>
          </Card>
        </Stack>

        <CartReceipt cart={cart} showItems className={cn("lg:sticky lg:top-6 lg:col-span-5")}>
          <LoadingButton
            type="submit"
            form={PAYMENT_FORM_ID}
            size="xl"
            className={cn("w-full")}
            isLoading={isBusy}
            loadingText="Processing payment…"
          >
            <Lock data-icon="inline-start" aria-hidden="true" />
            Pay {formatMoney(cart.grandTotal)}
          </LoadingButton>
          <ButtonLink
            href={customerRoutes.checkout}
            variant="ghost"
            aria-disabled={isBusy || undefined}
            className={cn("w-full", isBusy && "pointer-events-none opacity-50")}
          >
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Back to delivery details
          </ButtonLink>
        </CartReceipt>
      </Grid>
    );
  }

  return (
    <Container className={cn("flex flex-col gap-8 py-8 sm:py-10")}>
      <Stack gap="6">
        <CheckoutSteps current={2} />
        <PageHeader eyebrow="Step 3 of 3" title="Payment" description="Check your order and pay to confirm it." />
      </Stack>
      {content}
    </Container>
  );
}

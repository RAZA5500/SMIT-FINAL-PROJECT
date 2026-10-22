"use client";

import { ArrowRight, CircleAlert, ShoppingBasket } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Skeleton } from "@/components/ui/skeleton";
import { cartHasIssues } from "@/components/customer/cart/cart-availability";
import { CartReceipt } from "@/components/customer/cart/CartReceipt";
import { CheckoutSteps } from "@/components/customer/checkout/CheckoutSteps";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { TextLink } from "@/components/shared/TextLink";
import { customerRoutes, shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetAddresses } from "@/services/addresses/queries";
import { useGetCart } from "@/services/cart/queries";
import { CHECKOUT_FORM_ID, CheckoutForm } from "./CheckoutForm";

/** Checkout ke saved-address cards ke liye saare addresses (backend max limit) */
const ADDRESS_LIST_LIMIT = 100;

export function CheckoutView() {
  const cartQuery = useGetCart();
  const addressesQuery = useGetAddresses({ limit: ADDRESS_LIST_LIMIT });

  const cart = cartQuery.data;
  const failed = cartQuery.isError ? cartQuery : addressesQuery.isError ? addressesQuery : null;

  let content;
  if (cartQuery.isLoading || addressesQuery.isLoading) {
    content = (
      <Grid align="start" gap="6" aria-label="Loading" aria-busy="true" className={cn("lg:grid-cols-12 lg:gap-8")}>
        <Stack gap="5" className={cn("lg:col-span-7")}>
          <Skeleton className={cn("h-44 w-full rounded-2xl")} />
          <Skeleton className={cn("h-64 w-full rounded-2xl")} />
        </Stack>
        <Skeleton className={cn("h-96 w-full rounded-2xl lg:col-span-5")} />
      </Grid>
    );
  } else if (failed) {
    content = (
      <ErrorState title="Couldn't load checkout" message={failed.error?.message} onRetry={() => void failed.refetch()} />
    );
  } else if (!cart || cart.items.length === 0) {
    content = (
      <EmptyState
        icon={<ShoppingBasket aria-hidden="true" />}
        title="Your basket is empty"
        message="Add a few products to your basket before checking out."
        action={
          <ButtonLink href={shopUrl()} size="lg">
            Browse products
          </ButtonLink>
        }
      />
    );
  } else {
    const hasIssues = cartHasIssues(cart.items);
    content = (
      <Grid align="start" gap="6" className={cn("lg:grid-cols-12 lg:gap-8")}>
        <Stack className={cn("lg:col-span-7")}>
          <CheckoutForm addresses={addressesQuery.data?.data ?? []} />
        </Stack>
        <CartReceipt cart={cart} showItems className={cn("lg:sticky lg:top-6 lg:col-span-5")}>
          {hasIssues && (
            <Alert variant="destructive">
              <CircleAlert aria-hidden="true" />
              <AlertDescription>
                Some items in your basket need attention. <TextLink href={customerRoutes.cart} underline>Review basket</TextLink>
              </AlertDescription>
            </Alert>
          )}
          <Button type="submit" form={CHECKOUT_FORM_ID} size="xl" disabled={hasIssues} className={cn("w-full")}>
            Continue to payment
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Button>
        </CartReceipt>
      </Grid>
    );
  }

  return (
    <Container className={cn("flex flex-col gap-8 py-8 sm:py-10")}>
      <Stack gap="6">
        <CheckoutSteps current={1} />
        <PageHeader
          eyebrow="Step 2 of 3"
          title="Delivery details"
          description="Choose home delivery or click & collect — both are free."
        />
      </Stack>
      {content}
    </Container>
  );
}

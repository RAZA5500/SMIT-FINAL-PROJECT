"use client";

import { CircleAlert, ShoppingBasket } from "lucide-react";
import { Alert, AlertBody, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { cartHasIssues } from "@/components/customer/cart/cart-availability";
import { CartSummaryCard } from "@/components/customer/cart/CartSummaryCard";
import { CheckoutForm } from "@/components/customer/CheckoutForm";
import { CheckoutSteps } from "@/components/customer/checkout/CheckoutSteps";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { TextLink } from "@/components/shared/TextLink";
import { LOOKUP_LIMIT } from "@/constants/filters";
import { customerRoutes, shopUrl } from "@/lib/routes/routes";
import { useGetAddresses } from "@/services/addresses/queries";
import { useGetCart } from "@/services/cart/queries";

export function CheckoutView() {
  const cartQuery = useGetCart();
  const addressesQuery = useGetAddresses({ limit: LOOKUP_LIMIT });

  const cart = cartQuery.data;
  const failed = cartQuery.isError ? cartQuery : addressesQuery.isError ? addressesQuery : null;

  let content;
  if (cartQuery.isLoading || addressesQuery.isLoading) {
    content = (
      <div aria-label="Loading" aria-busy="true" className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-5 lg:col-span-7">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-15" />
        </div>
        <Skeleton className="h-96 w-full rounded-15 lg:col-span-5" />
      </div>
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
          <ButtonLink href={shopUrl()} variant="cta" size="lg">
            Browse products
          </ButtonLink>
        }
      />
    );
  } else {
    const hasIssues = cartHasIssues(cart.items);
    content = (
      <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <CheckoutForm addresses={addressesQuery.data?.data ?? []} blocked={hasIssues} />
        </div>
        <CartSummaryCard cart={cart} showItems className="lg:sticky lg:top-6 lg:col-span-5">
          {hasIssues && (
            <Alert variant="destructive">
              <CircleAlert aria-hidden="true" />
              <AlertBody>
                <AlertDescription>
                  Some items in your basket need attention.{" "}
                  <TextLink href={customerRoutes.cart} underline>
                    Review basket
                  </TextLink>
                </AlertDescription>
              </AlertBody>
            </Alert>
          )}
        </CartSummaryCard>
      </div>
    );
  }

  return (
    <div className="page-container flex flex-col gap-8 py-8 sm:py-10">
      <div className="flex flex-col gap-6">
        <CheckoutSteps current={1} />
        <PageHeader
          eyebrow="Step 2 of 3"
          title="Delivery details"
          description="Choose home delivery or click & collect — both are free."
        />
      </div>
      {content}
    </div>
  );
}

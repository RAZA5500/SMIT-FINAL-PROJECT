"use client";

import { ArrowRight, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { cartHasIssues } from "@/components/customer/cart/cart-availability";
import { CartSummary } from "@/components/customer/cart/CartSummary";
import { CheckoutSteps } from "@/components/customer/checkout/CheckoutSteps";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { customerRoutes, shopUrl } from "@/lib/routes/routes";
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
      <div className="grid items-start gap-6 lg:grid-cols-5 lg:gap-8" aria-label="Loading" aria-busy="true">
        <div className="flex flex-col gap-5 lg:col-span-3">
          <Skeleton className="h-40 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl lg:col-span-2" />
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
          <Link href={shopUrl()} className={buttonVariants({ size: "lg" })}>
            Browse products
          </Link>
        }
      />
    );
  } else {
    const hasIssues = cartHasIssues(cart.items);
    content = (
      <div className="grid items-start gap-6 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-3">
          <CheckoutForm addresses={addressesQuery.data?.data ?? []} />
        </div>
        <CartSummary cart={cart} showItems className="lg:sticky lg:top-6 lg:col-span-2">
          {hasIssues && (
            <p role="alert" className="rounded-lg bg-tomato-soft px-3 py-2 text-sm font-medium text-destructive">
              Some items in your basket need attention.{" "}
              <Link href={customerRoutes.cart} className="underline">
                Review basket
              </Link>
            </p>
          )}
          <Button type="submit" form={CHECKOUT_FORM_ID} size="xl" disabled={hasIssues} className="w-full">
            Continue to payment
            <ArrowRight aria-hidden="true" />
          </Button>
        </CartSummary>
      </div>
    );
  }

  return (
    <div className="container-page flex flex-col gap-6 py-6 sm:gap-8 sm:py-10">
      <div className="flex flex-col gap-5">
        <CheckoutSteps current={1} />
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold sm:text-4xl">Delivery details</h1>
          <p className="text-muted-foreground">Choose home delivery or click &amp; collect — both are free.</p>
        </div>
      </div>
      {content}
    </div>
  );
}

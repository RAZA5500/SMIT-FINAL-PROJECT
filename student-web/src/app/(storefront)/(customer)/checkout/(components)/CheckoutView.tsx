"use client";

import { ArrowRight, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { cartHasIssues } from "@/components/customer/cart/cart-availability";
import { CartSummary } from "@/components/customer/cart/CartSummary";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { useGetAddresses } from "@/services/addresses/queries";
import { useGetCart } from "@/services/cart/queries";
import { CHECKOUT_FORM_ID, CheckoutForm } from "./CheckoutForm";

/** Checkout dropdown ke liye saare saved addresses (backend max limit) */
const ADDRESS_LIST_LIMIT = 100;

export function CheckoutView() {
  const cartQuery = useGetCart();
  const addressesQuery = useGetAddresses({ limit: ADDRESS_LIST_LIMIT });

  const cart = cartQuery.data;
  const failed = cartQuery.isError ? cartQuery : addressesQuery.isError ? addressesQuery : null;

  let content;
  if (cartQuery.isLoading || addressesQuery.isLoading) {
    content = (
      <div className="grid items-start gap-6 lg:grid-cols-3" aria-label="Loading" aria-busy="true">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-56 w-full rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  } else if (failed) {
    content = (
      <ErrorState
        title="Couldn't load checkout"
        message={failed.error?.message}
        onRetry={() => void failed.refetch()}
      />
    );
  } else if (!cart || cart.items.length === 0) {
    content = (
      <EmptyState
        icon={<ShoppingBasket className="size-6" aria-hidden="true" />}
        title="Your cart is empty"
        message="Add products to your cart before checking out."
        action={
          <Link href={publicRoutes.shop} className={buttonVariants({ variant: "brand", size: "xl" })}>
            Browse products
          </Link>
        }
      />
    );
  } else {
    const hasIssues = cartHasIssues(cart.items);
    content = (
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutForm addresses={addressesQuery.data?.data ?? []} />
        </div>
        <CartSummary cart={cart} showItems>
          {hasIssues && (
            <p role="alert" className="text-xs text-destructive">
              Some items in your cart need attention.{" "}
              <Link href={customerRoutes.cart} className="font-medium underline">
                Review cart
              </Link>
            </p>
          )}
          <Button type="submit" form={CHECKOUT_FORM_ID} variant="brand" size="xl" disabled={hasIssues} className="w-full">
            Continue to payment
            <ArrowRight aria-hidden="true" />
          </Button>
        </CartSummary>
      </div>
    );
  }

  return (
    <CustomerPage title="Checkout" description="Choose delivery or pickup, then continue to payment.">
      {content}
    </CustomerPage>
  );
}

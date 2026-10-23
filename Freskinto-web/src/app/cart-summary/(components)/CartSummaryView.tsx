"use client";

import { ArrowRight, ShoppingBasket } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid } from "@/components/ui/grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
import { CartSummaryCard } from "@/components/customer/cart/CartSummaryCard";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { OrderLines } from "@/components/shared/order/OrderLines";
import { cartHasIssues } from "@/components/customer/cart/cart-availability";
import { customerRoutes, shopUrl } from "@/lib/routes/routes";
import { pluralize } from "@/lib/utils";
import { useGetCart } from "@/services/cart/queries";

/** Checkout se pehle read-only itemized review — edit karna ho to basket par wapas */
export function CartSummaryView() {
  const { data: cart, isLoading, isError, error, refetch } = useGetCart();
  const items = cart?.items ?? [];

  let content;
  if (isLoading) {
    content = (
      <Grid aria-label="Loading" aria-busy="true" align="start" gap="6" className="lg:grid-cols-12 lg:gap-8">
        <Skeleton className="h-96 rounded-[2rem] lg:col-span-7" />
        <Skeleton className="h-96 rounded-[2rem] lg:col-span-5" />
      </Grid>
    );
  } else if (isError) {
    content = (
      <ErrorState title="Couldn't load your order summary" message={error.message} onRetry={() => void refetch()} />
    );
  } else if (!cart || items.length === 0) {
    content = (
      <EmptyState
        icon={<ShoppingBasket aria-hidden="true" />}
        title="Your basket is empty"
        message="Browse fresh produce and everyday essentials to build your order."
        action={
          <ButtonLink href={shopUrl()} size="lg">
            Browse products
          </ButtonLink>
        }
      />
    );
  } else {
    const hasIssues = cartHasIssues(items);
    content = (
      <Grid align="start" gap="6" className="lg:grid-cols-12 lg:gap-8">
        <Card render={<Box as="section" aria-label="Items" />} size="lg" className="rounded-[2rem] lg:col-span-7">
          <CardHeader>
            <CardTitle render={<Box as="span" />} className="text-xl font-semibold">
              {pluralize(items.length, "product")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OrderLines
            lines={items.map((item) => ({
              id: item.id,
              name: item.name,
              sku: item.sku,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.lineTotal,
              }))}
            />
          </CardContent>
        </Card>

        <CartSummaryCard cart={cart} className="lg:sticky lg:top-28 lg:col-span-5">
          {hasIssues ? (
            <ButtonLink href={customerRoutes.cart} size="xl" className="w-full">
              Fix items in basket
            </ButtonLink>
          ) : (
            <ButtonLink href={customerRoutes.checkout} size="xl" className="w-full">
              Proceed to checkout
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
          )}
          <ButtonLink href={customerRoutes.cart} variant="outline" className="w-full border">
            Edit items in basket
          </ButtonLink>
        </CartSummaryCard>
      </Grid>
    );
  }

  return (
    <CustomerPage
      eyebrow="Review & total"
      title={
        <>
          Order{" "}
          <Text as="em" variant="accent">
            summary
          </Text>
        </>
      }
      description="A line-by-line summary of your selected items before you enter delivery details."
      breadcrumbs={[{ label: "Basket", href: customerRoutes.cart }, { label: "Summary" }]}
    >
      {content}
    </CustomerPage>
  );
}

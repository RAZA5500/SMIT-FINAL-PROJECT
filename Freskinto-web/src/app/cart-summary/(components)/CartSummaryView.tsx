"use client";

import { ArrowRight, ShoppingBasket } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div aria-label="Loading" aria-busy="true" className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
        <Skeleton className="h-96 rounded-15 lg:col-span-7" />
        <Skeleton className="h-96 rounded-15 lg:col-span-5" />
      </div>
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
          <ButtonLink href={shopUrl()} variant="cta" size="lg">
            Browse products
          </ButtonLink>
        }
      />
    );
  } else {
    const hasIssues = cartHasIssues(items);
    content = (
      <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
        <section aria-label="Items" className="rounded-15 border border-border bg-card p-5 shadow-soft sm:p-6 lg:col-span-7">
          <h2 className="mb-5 font-heading text-fs-18 font-semibold">{pluralize(items.length, "product")}</h2>
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
        </section>

        <CartSummaryCard cart={cart} className="lg:sticky lg:top-header lg:col-span-5">
          {hasIssues ? (
            <ButtonLink href={customerRoutes.cart} variant="cta" size="xl" className="w-full">
              Fix items in basket
            </ButtonLink>
          ) : (
            <ButtonLink href={customerRoutes.checkout} variant="cta" size="xl" className="w-full">
              Proceed to checkout
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
          )}
          <ButtonLink href={customerRoutes.cart} variant="outline" className="w-full rounded-full">
            Edit items in basket
          </ButtonLink>
        </CartSummaryCard>
      </div>
    );
  }

  return (
    <CustomerPage
      eyebrow="Review & total"
      title="Order summary"
      description="A line-by-line summary of your selected items before you enter delivery details."
      breadcrumbs={[{ label: "Basket", href: customerRoutes.cart }, { label: "Summary" }]}
    >
      {content}
    </CustomerPage>
  );
}

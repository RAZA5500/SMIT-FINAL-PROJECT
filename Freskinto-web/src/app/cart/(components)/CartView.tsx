"use client";

import { ArrowRight, CircleAlert, ShoppingBasket, Trash2 } from "lucide-react";
import { useState } from "react";
import { Alert, AlertBody, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cartHasIssues } from "@/components/customer/cart/cart-availability";
import { CartLine } from "@/components/customer/cart/CartLine";
import { CartSummaryCard } from "@/components/customer/cart/CartSummaryCard";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { ProductGridSkeleton } from "@/components/customer/product/ProductCardSkeleton";
import { ProductListing } from "@/components/customer/ProductListing";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Price } from "@/components/shared/Price";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { customerRoutes, shopUrl } from "@/lib/routes/routes";
import { pluralize } from "@/lib/utils";
import { useClearCart } from "@/services/cart/mutations";
import { useGetCart } from "@/services/cart/queries";
import type { ICart } from "@/services/cart/types";
import { useGetProducts } from "@/services/products/queries";

export function CartView() {
  const { data: cart, isLoading, isError, error, refetch } = useGetCart();
  const clearCart = useClearCart();
  const [confirmClear, setConfirmClear] = useState(false);

  const items = cart?.items ?? [];

  let content;
  if (isLoading) {
    content = <CartViewSkeleton />;
  } else if (isError) {
    content = <ErrorState title="Couldn't load your basket" message={error.message} onRetry={() => void refetch()} />;
  } else if (!cart || items.length === 0) {
    content = (
      <EmptyState
        icon={<ShoppingBasket aria-hidden="true" />}
        title="Your basket is empty"
        message="Fresh produce, poultry and everyday essentials are waiting — and delivery is always free."
        action={
          <ButtonLink href={shopUrl()} variant="cta" size="lg">
            Start shopping
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        }
      />
    );
  } else {
    content = <FilledBasket cart={cart} onClear={() => setConfirmClear(true)} />;
  }

  return (
    <CustomerPage
      eyebrow="Your basket"
      title="Basket"
      breadcrumbs={[{ label: "Basket" }]}
      description={items.length > 0 ? `${pluralize(cart?.itemCount ?? 0, "item")} ready for checkout.` : undefined}
    >
      {content}
      <SuggestedProducts excludeIds={items.map((item) => item.productId)} />

      <DeleteDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="Clear your basket?"
        description="All items will be removed from your basket."
        confirmLabel="Clear basket"
        isLoading={clearCart.isPending}
        onConfirm={() => clearCart.mutate(undefined, { onSuccess: () => setConfirmClear(false) })}
      />
    </CustomerPage>
  );
}

function FilledBasket({ cart, onClear }: { cart: ICart; onClear: () => void }) {
  const hasIssues = cartHasIssues(cart.items);

  const checkoutAction = hasIssues ? (
    <Button variant="cta" size="xl" disabled className="w-full">
      Checkout
      <ArrowRight aria-hidden="true" />
    </Button>
  ) : (
    <ButtonLink href={customerRoutes.checkout} variant="cta" size="xl" className="w-full">
      Checkout
      <ArrowRight aria-hidden="true" />
    </ButtonLink>
  );

  return (
    <>
      <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
        <section aria-label="Basket items" className="rounded-15 border border-border bg-card shadow-soft lg:col-span-8">
          <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <h2 className="font-heading text-fs-18 font-semibold">{pluralize(cart.items.length, "product")}</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={onClear}>
              <Trash2 aria-hidden="true" />
              Clear basket
            </Button>
          </header>
          <div className="flex flex-col gap-4 px-5">
            {hasIssues && (
              <Alert variant="destructive" className="mt-4">
                <CircleAlert aria-hidden="true" />
                <AlertBody>
                  <AlertTitle>Some items need your attention</AlertTitle>
                  <AlertDescription>Fix the highlighted lines before you check out.</AlertDescription>
                </AlertBody>
              </Alert>
            )}
            <ul className="flex flex-col divide-y divide-border">
              {cart.items.map((item) => (
                <li key={item.id}>
                  <CartLine item={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <CartSummaryCard cart={cart} className="lg:sticky lg:top-header lg:col-span-4">
          {checkoutAction}
          <ButtonLink href={customerRoutes.cartSummary} variant="outline" className="w-full rounded-full">
            Review order summary
          </ButtonLink>
          <ButtonLink href={shopUrl()} variant="ghost" className="w-full">
            Continue shopping
          </ButtonLink>
        </CartSummaryCard>
      </div>

      {/* Phone: checkout hamesha nazar mein — tab bar ke upar */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-card/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-fs-12 text-muted-foreground">Total</span>
            <Price amount={cart.grandTotal} size="lg" className="font-heading" />
          </div>
          <div className="flex-1">{checkoutAction}</div>
        </div>
      </div>
      <div aria-hidden="true" className="h-16 lg:hidden" />
    </>
  );
}

/** Upsell — naye products jo basket mein nahi */
function SuggestedProducts({ excludeIds }: { excludeIds: string[] }) {
  const { data, isLoading, isError, error, refetch } = useGetProducts({ limit: 12, sortBy: "newest" });
  const products = data?.data.filter((product) => !excludeIds.includes(product.id)).slice(0, 4);
  if (!isLoading && !isError && !products?.length) return null;

  return (
    <section aria-label="Suggestions" className="flex flex-col gap-6 pt-6">
      <SectionHeading
        eyebrow="While you're here"
        title="You might also like"
        description="Fresh additions to round off your shop."
        href={shopUrl()}
      />
      <ProductListing
        products={products}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        onRetry={() => void refetch()}
        skeleton={<ProductGridSkeleton count={4} />}
      />
    </section>
  );
}

function CartViewSkeleton() {
  return (
    <div aria-label="Loading" aria-busy="true" className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="flex flex-col gap-5 rounded-15 border border-border bg-card p-5 lg:col-span-8">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="size-24 rounded-xl" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-9 w-32 rounded-full" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-96 w-full rounded-15 lg:col-span-4" />
    </div>
  );
}

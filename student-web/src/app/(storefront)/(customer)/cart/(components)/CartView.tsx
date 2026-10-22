"use client";

import { ArrowRight, CircleAlert, ShoppingBasket, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cartHasIssues } from "@/components/customer/cart/cart-availability";
import { CartLine } from "@/components/customer/cart/CartLine";
import { CartSummary } from "@/components/customer/cart/CartSummary";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { ProductRail } from "@/components/customer/product/ProductRail";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney, pluralize } from "@/lib/format";
import { customerRoutes, shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
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
    content = <CartPageSkeleton />;
  } else if (isError) {
    content = <ErrorState title="Couldn't load your basket" message={error.message} onRetry={() => void refetch()} />;
  } else if (!cart || items.length === 0) {
    content = (
      <div className="rounded-3xl bg-card shadow-soft ring-1 ring-border">
        <EmptyState
          icon={<ShoppingBasket aria-hidden="true" />}
          title="Your basket is empty"
          message="Fresh produce, poultry and everyday essentials are waiting — and delivery is always free."
          action={
            <Link href={shopUrl()} className={buttonVariants({ size: "lg" })}>
              Start shopping
              <ArrowRight aria-hidden="true" />
            </Link>
          }
        />
      </div>
    );
  } else {
    content = <FilledBasket cart={cart} onClear={() => setConfirmClear(true)} />;
  }

  return (
    <CustomerPage
      title="Your basket"
      breadcrumbs={[{ label: "Basket" }]}
      description={items.length > 0 ? `${pluralize(cart?.itemCount ?? 0, "item")} ready for checkout.` : undefined}
    >
      {content}
      <SuggestedProducts excludeIds={items.map((item) => item.productId)} />

      <ConfirmDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="Clear your basket?"
        description="All items will be removed from your basket."
        confirmLabel="Clear basket"
        isPending={clearCart.isPending}
        onConfirm={() => clearCart.mutate(undefined, { onSuccess: () => setConfirmClear(false) })}
      />
    </CustomerPage>
  );
}

function FilledBasket({ cart, onClear }: { cart: ICart; onClear: () => void }) {
  const hasIssues = cartHasIssues(cart.items);

  const checkoutAction = hasIssues ? (
    <Button size="xl" disabled className="w-full">
      Checkout
      <ArrowRight aria-hidden="true" />
    </Button>
  ) : (
    <Link href={customerRoutes.checkout} className={cn(buttonVariants({ size: "xl" }), "w-full")}>
      Checkout
      <ArrowRight aria-hidden="true" />
    </Link>
  );

  return (
    <>
      <div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
        <section aria-label="Basket items" className="rounded-3xl bg-card shadow-soft ring-1 ring-border lg:col-span-2">
          <div className="flex items-center justify-between gap-3 border-b px-5 py-4 sm:px-6">
            <h2 className="font-sans text-sm font-semibold">
              {pluralize(cart.items.length, "product")}
            </h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={onClear}>
              <Trash2 aria-hidden="true" />
              Clear basket
            </Button>
          </div>
          {hasIssues && (
            <p role="alert" className="flex items-center gap-2 border-b bg-tomato-soft px-5 py-3 text-sm font-medium text-destructive sm:px-6">
              <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
              Some items need your attention before you can check out.
            </p>
          )}
          <div className="divide-y px-5 sm:px-6">
            {cart.items.map((item) => (
              <CartLine key={item.id} item={item} />
            ))}
          </div>
        </section>

        <CartSummary cart={cart} className="lg:sticky lg:top-24">
          {checkoutAction}
          <Link href={shopUrl()} className={cn(buttonVariants({ variant: "ghost" }), "w-full")}>
            Continue shopping
          </Link>
        </CartSummary>
      </div>

      {/* Phone: checkout hamesha nazar mein — tab bar ke upar */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t bg-card/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="numeric font-heading text-xl font-bold">{formatMoney(cart.grandTotal)}</span>
          </div>
          <div className="flex-1">{checkoutAction}</div>
        </div>
      </div>
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
}

/** Upsell — naye products jo basket mein nahi */
function SuggestedProducts({ excludeIds }: { excludeIds: string[] }) {
  const { data, isLoading, isError, error, refetch } = useGetProducts({ limit: 16, sortBy: "newest" });
  const products = data?.data.filter((product) => !excludeIds.includes(product.id)).slice(0, 12);
  if (!isLoading && !isError && !products?.length) return null;

  return (
    <ProductRail
      title="You might also like"
      description="Fresh additions to round off your shop."
      href={shopUrl()}
      products={products}
      isLoading={isLoading}
      isError={isError}
      errorMessage={error?.message}
      onRetry={() => void refetch()}
      className="pt-6"
    />
  );
}

function CartPageSkeleton() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-8" aria-label="Loading" aria-busy="true">
      <div className="flex flex-col gap-5 rounded-3xl bg-card p-6 ring-1 ring-border lg:col-span-2">
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
      <Skeleton className="h-80 w-full rounded-2xl" />
    </div>
  );
}

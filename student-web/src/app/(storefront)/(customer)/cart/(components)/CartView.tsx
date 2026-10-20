"use client";

import { ArrowRight, ShoppingBasket, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cartHasIssues } from "@/components/customer/cart/cart-availability";
import { CartLine } from "@/components/customer/cart/CartLine";
import { CartSummary } from "@/components/customer/cart/CartSummary";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useClearCart } from "@/services/cart/mutations";
import { useGetCart } from "@/services/cart/queries";

export function CartView() {
  const { data: cart, isLoading, isError, error, refetch } = useGetCart();
  const clearCart = useClearCart();
  const [confirmClear, setConfirmClear] = useState(false);

  const items = cart?.items ?? [];
  const hasIssues = cartHasIssues(items);

  const clearAction = items.length > 0 && (
    <Button variant="outline" size="xl" onClick={() => setConfirmClear(true)}>
      <Trash2 aria-hidden="true" />
      Clear cart
    </Button>
  );

  return (
    <CustomerPage title="Your Cart" description="Review your items before checkout." actions={clearAction}>
      {isLoading ? (
        <CartPageSkeleton />
      ) : isError ? (
        <ErrorState title="Couldn't load your cart" message={error.message} onRetry={() => void refetch()} />
      ) : !cart || items.length === 0 ? (
        <EmptyState
          icon={<ShoppingBasket className="size-6" aria-hidden="true" />}
          title="Your cart is empty"
          message="Browse the shop and add products to your cart."
          action={
            <Link href={publicRoutes.shop} className={buttonVariants({ variant: "brand", size: "xl" })}>
              Browse products
            </Link>
          }
        />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-3">
          <Card className="py-0 lg:col-span-2">
            {items.map((item) => (
              <CartLine key={item.id} item={item} className="last:border-b-0" />
            ))}
          </Card>

          <CartSummary cart={cart}>
            {hasIssues && (
              <p role="alert" className="text-xs text-destructive">
                Some items need your attention before you can check out.
              </p>
            )}
            {hasIssues ? (
              <Button variant="brand" size="xl" disabled className="w-full">
                Proceed to checkout
                <ArrowRight aria-hidden="true" />
              </Button>
            ) : (
              <Link
                href={customerRoutes.checkout}
                className={cn(buttonVariants({ variant: "brand", size: "xl" }), "w-full")}
              >
                Proceed to checkout
                <ArrowRight aria-hidden="true" />
              </Link>
            )}
            <Link
              href={publicRoutes.shop}
              className={cn(buttonVariants({ variant: "ghost", size: "xl" }), "w-full text-brand-green")}
            >
              Continue shopping
            </Link>
          </CartSummary>
        </div>
      )}

      <ConfirmDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="Clear your cart?"
        description="All items will be removed from your cart."
        confirmLabel="Clear cart"
        isPending={clearCart.isPending}
        onConfirm={() => clearCart.mutate(undefined, { onSuccess: () => setConfirmClear(false) })}
      />
    </CustomerPage>
  );
}

function CartPageSkeleton() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-3" aria-label="Loading" aria-busy="true">
      <div className="flex flex-col gap-3 rounded-xl p-4 ring-1 ring-foreground/10 lg:col-span-2">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
      <Skeleton className="h-56 w-full rounded-xl" />
    </div>
  );
}

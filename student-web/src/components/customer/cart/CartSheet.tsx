"use client";

import { ArrowRight, PartyPopper, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney, pluralize } from "@/lib/format";
import { customerRoutes, loginUrl, publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetCart } from "@/services/cart/queries";
import { useAuthStore } from "@/stores/auth-store";
import { useUiStore } from "@/stores/ui-store";
import { cartHasIssues } from "./cart-availability";
import { CartLine } from "./CartLine";

/** Header / tab bar se khulne wala basket drawer */
export function CartSheet() {
  const open = useUiStore((state) => state.cartOpen);
  const setOpen = useUiStore((state) => state.setCartOpen);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full gap-0 bg-background p-0 sm:max-w-md">
        <CartSheetBody onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

function CartSheetBody({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const { data: cart, isLoading, isError, error, refetch } = useGetCart();

  const items = cart?.items ?? [];
  const isCustomer = Boolean(token) && user?.role === "CUSTOMER";
  const canCheckout = items.length > 0 && !cartHasIssues(items);

  let body: ReactNode;
  if (!hasHydrated || (isCustomer && isLoading)) {
    body = <CartLinesSkeleton />;
  } else if (!token) {
    body = (
      <EmptyState
        icon={<ShoppingBasket aria-hidden="true" />}
        title="Sign in to start your basket"
        message="Your basket is saved to your account, so it's there on every device."
        action={
          <Link href={loginUrl(pathname)} onClick={onClose} className={buttonVariants()}>
            Sign in
          </Link>
        }
      />
    );
  } else if (!isCustomer) {
    body = (
      <EmptyState
        icon={<ShoppingBasket aria-hidden="true" />}
        title="Baskets are for customers"
        message="Admin accounts can browse the shop but can't place orders."
      />
    );
  } else if (isError) {
    body = <ErrorState title="Couldn't load your basket" message={error.message} onRetry={() => void refetch()} />;
  } else if (items.length === 0) {
    body = (
      <EmptyState
        icon={<ShoppingBasket aria-hidden="true" />}
        title="Your basket is empty"
        message="Fresh produce, poultry and everyday essentials are a tap away."
        action={
          <Link href={publicRoutes.shop} onClick={onClose} className={buttonVariants()}>
            Start shopping
            <ArrowRight aria-hidden="true" />
          </Link>
        }
      />
    );
  } else {
    body = (
      <div className="divide-y divide-border">
        {items.map((item) => (
          <CartLine key={item.id} item={item} compact onNavigate={onClose} />
        ))}
      </div>
    );
  }

  return (
    <>
      <SheetHeader className="border-b bg-card px-5 py-4">
        <SheetTitle>Your basket</SheetTitle>
        <SheetDescription>
          {items.length > 0 ? `${pluralize(cart?.itemCount ?? 0, "item")} · ${formatMoney(cart?.subtotal ?? 0)}` : "Delivery is always free"}
        </SheetDescription>
      </SheetHeader>

      {items.length > 0 && (
        <p className="flex items-center gap-2 bg-brand-soft px-5 py-2.5 text-xs font-medium text-brand">
          <PartyPopper className="size-4 shrink-0" aria-hidden="true" />
          Free delivery is included with this order
        </p>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-5 scrollbar-thin">{body}</div>

      {items.length > 0 && (
        <div className="flex flex-col gap-3 border-t bg-card px-5 py-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="numeric font-heading text-2xl font-bold">{formatMoney(cart?.grandTotal ?? 0)}</span>
          </div>
          {canCheckout ? (
            <Link
              href={customerRoutes.checkout}
              onClick={onClose}
              className={cn(buttonVariants({ size: "xl" }), "w-full")}
            >
              Checkout
              <ArrowRight aria-hidden="true" />
            </Link>
          ) : (
            <p role="alert" className="rounded-lg bg-tomato-soft px-3 py-2 text-center text-xs font-medium text-destructive">
              Some items need attention before you can check out.
            </p>
          )}
          <Link
            href={customerRoutes.cart}
            onClick={onClose}
            className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
          >
            View full basket
          </Link>
        </div>
      )}
    </>
  );
}

function CartLinesSkeleton() {
  return (
    <div className="flex flex-col gap-5 py-5" aria-label="Loading" aria-busy="true">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="size-16 rounded-xl" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

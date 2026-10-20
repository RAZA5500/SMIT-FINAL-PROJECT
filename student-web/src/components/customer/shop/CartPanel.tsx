"use client";

import { ArrowRight, ShoppingBasket, Tag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { formatMoney } from "@/lib/format";
import { customerRoutes, loginUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetCart } from "@/services/cart/queries";
import { useAuthStore } from "@/stores/auth-store";
import { cartHasIssues } from "../cart/cart-availability";
import { CartLine } from "../cart/CartLine";

interface CartPanelProps {
  /** Mobile drawer: close button; links par click se band */
  onClose?: () => void;
  /** Header hover preview: chhoti read-only list + sirf "View Cart" */
  compact?: boolean;
}

const ACTION_CLASS = cn(buttonVariants({ variant: "brand" }), "w-full rounded-5");

export default function CartPanel({ onClose, compact = false }: CartPanelProps) {
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
        icon={<ShoppingBasket className="size-6" aria-hidden="true" />}
        title="Sign in to start shopping"
        message="Your cart is saved to your account."
        action={
          <Link href={loginUrl(pathname)} className={cn(buttonVariants({ variant: "brand" }))} onClick={onClose}>
            Sign in
          </Link>
        }
      />
    );
  } else if (!isCustomer) {
    body = (
      <EmptyState
        icon={<ShoppingBasket className="size-6" aria-hidden="true" />}
        title="Carts are for customers"
        message="Admin accounts can browse the shop but can't place orders."
      />
    );
  } else if (isError) {
    body = <ErrorState title="Couldn't load your cart" message={error.message} onRetry={() => void refetch()} />;
  } else if (items.length === 0) {
    body = (
      <EmptyState
        icon={<ShoppingBasket className="size-6" aria-hidden="true" />}
        title="Your cart is empty"
        message="Add products from the shop to get started."
      />
    );
  } else {
    body = items.map((item) => <CartLine key={item.id} item={item} readOnly={compact} />);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3.5">
        <h3 className="font-medium text-gray-900">
          Your Cart <span className="text-brand-green">({items.length})</span>
        </h3>
        {onClose && (
          <button
            type="button"
            className="cursor-pointer text-brand-green transition-opacity hover:opacity-70"
            aria-label="Close cart"
            onClick={onClose}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>

      <div
        className={cn(
          "flex scrollbar-thin flex-col overflow-y-auto",
          compact ? "max-h-48" : "lg:min-h-0 lg:flex-1",
        )}
      >
        {body}
      </div>

      {compact ? (
        <div className="flex h-11 items-center px-2.5 py-(--cart-preview-footer-padding-y)">
          <Link href={customerRoutes.cart} className={cn(ACTION_CLASS, "h-full")}>
            View Cart
          </Link>
        </div>
      ) : (
        <>
          <div className="shrink-0 border-b border-gray-100 px-4 py-3">
            {/* Coupons scope se bahar — static design element (user decision) */}
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1.5 font-inter text-xs font-medium text-gray-500 transition-colors hover:text-brand-green"
            >
              <Tag className="size-3.5" aria-hidden="true" />
              Have a promo code?
            </button>
          </div>

          <div className="shrink-0 space-y-2.5 border-t border-gray-100 px-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-summary-label">Subtotal</span>
              <span className="text-sm font-medium text-price-text">{formatMoney(cart?.subtotal ?? 0)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-summary-divider pt-2.5">
              <span className="text-sm font-semibold text-summary-label">Total</span>
              <span className="text-base font-bold text-brand-green">{formatMoney(cart?.grandTotal ?? 0)}</span>
            </div>
            {canCheckout ? (
              <Link href={customerRoutes.checkout} className={cn(ACTION_CLASS, "mt-1 h-11")} onClick={onClose}>
                Checkout
                <ArrowRight aria-hidden="true" />
              </Link>
            ) : (
              <button type="button" disabled className={cn(ACTION_CLASS, "mt-1 h-11")}>
                Checkout
                <ArrowRight aria-hidden="true" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function CartLinesSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4" aria-label="Loading" aria-busy="true">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}

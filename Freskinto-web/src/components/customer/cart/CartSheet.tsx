"use client";

import { ArrowRight, ShoppingBasket, Truck } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Flex, Stack } from "@/components/ui/flex";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Price } from "@/components/shared/Price";
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
      <SheetContent side="right" className={cn("w-full gap-0 p-0 sm:max-w-md")}>
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
          <ButtonLink href={loginUrl(pathname)} onClick={onClose}>
            Sign in
          </ButtonLink>
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
          <ButtonLink href={publicRoutes.shop} onClick={onClose}>
            Start shopping
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </ButtonLink>
        }
      />
    );
  } else {
    body = (
      <Stack className={cn("divide-y")}>
        {items.map((item) => (
          <CartLine key={item.id} item={item} compact onNavigate={onClose} />
        ))}
      </Stack>
    );
  }

  return (
    <>
      <SheetHeader className={cn("border-b px-5 py-4")}>
        <SheetTitle>Your basket</SheetTitle>
        <SheetDescription>
          {items.length > 0
            ? `${pluralize(cart?.itemCount ?? 0, "item")} · ${formatMoney(cart?.subtotal ?? 0)}`
            : "Delivery is always free"}
        </SheetDescription>
      </SheetHeader>

      {items.length > 0 && (
        <Flex align="center" gap="2" className={cn("border-b px-5 py-2.5 bg-icon-green/50")}>
          <Truck aria-hidden="true" className={cn("size-4 shrink-0 text-brand-green")} />
          <Text as="span" variant="small" tone="muted" className={cn("text-xs font-semibold tracking-wider text-foreground/80 uppercase")}>
            Free delivery is included with this order
          </Text>
        </Flex>
      )}

      <ScrollArea className={cn("min-h-0 flex-1")}>
        <Stack className={cn("px-5")}>{body}</Stack>
      </ScrollArea>

      {items.length > 0 && (
        <SheetFooter className={cn("gap-3 border-t border-border bg-modal-footer px-5 py-4")}>
          <Flex align="baseline" justify="between">
            <Text tone="muted">Total</Text>
            <Price amount={cart?.grandTotal ?? 0} size="lg" tone="default" className={cn("font-heading")} />
          </Flex>
          {canCheckout ? (
            <ButtonLink href={customerRoutes.checkout} onClick={onClose} size="lg" variant="brand" className={cn("w-full shadow-md shadow-brand-green/20")}>
              Checkout
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </ButtonLink>
          ) : (
            <Alert variant="destructive">
              <AlertDescription>Some items need attention before you can check out.</AlertDescription>
            </Alert>
          )}
          <ButtonLink href={customerRoutes.cart} onClick={onClose} variant="ghost" className={cn("w-full")}>
            View full basket
          </ButtonLink>
        </SheetFooter>
      )}
    </>
  );
}

function CartLinesSkeleton() {
  return (
    <Stack gap="5" aria-label="Loading" aria-busy="true" className={cn("py-5")}>
      {Array.from({ length: 3 }, (_, i) => (
        <Flex key={i} gap="3">
          <Skeleton className={cn("size-16 rounded-xl")} />
          <Stack gap="2" className={cn("flex-1")}>
            <Skeleton className={cn("h-4 w-3/4")} />
            <Skeleton className={cn("h-3 w-1/3")} />
            <Skeleton className={cn("h-9 w-28 rounded-full")} />
          </Stack>
        </Flex>
      ))}
    </Stack>
  );
}

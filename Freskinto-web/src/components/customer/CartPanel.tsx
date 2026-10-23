"use client";

import { ArrowRight, ShoppingBasket, Truck } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Alert, AlertBody } from "@/components/ui/alert";
import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Price } from "@/components/shared/Price";
import { customerRoutes, loginUrl, publicRoutes } from "@/lib/routes/routes";
import { formatMoney, pluralize } from "@/lib/utils";
import { useGetCart } from "@/services/cart/queries";
import { useAuthStore } from "@/stores/auth-store";
import { useShopStore } from "@/stores/shop-store";
import { cartHasIssues } from "./cart/cart-availability";
import { CartLine } from "./cart/CartLine";

/** Header / tab bar se khulne wala slide-over basket (optimistic quantity controls ke saath) */
export function CartPanel() {
  const open = useShopStore((state) => state.cartOpen);
  const setOpen = useShopStore((state) => state.setCartOpen);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="gap-0 p-0">
        <CartPanelBody onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

function CartPanelBody({ onClose }: { onClose: () => void }) {
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
        className="border-0 bg-transparent"
      />
    );
  } else if (!isCustomer) {
    body = (
      <EmptyState
        icon={<ShoppingBasket aria-hidden="true" />}
        title="Baskets are for customers"
        message="Admin accounts can browse the shop but can't place orders."
        className="border-0 bg-transparent"
      />
    );
  } else if (isError) {
    body = <ErrorState title="Couldn't load your basket" message={error.message} onRetry={() => void refetch()} className="border-0" />;
  } else if (items.length === 0) {
    body = (
      <EmptyState
        icon={<ShoppingBasket aria-hidden="true" />}
        title="Your basket is empty"
        message="Fresh produce, poultry and everyday essentials are a tap away."
        action={
          <ButtonLink href={publicRoutes.shop} onClick={onClose}>
            Start shopping
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        }
        className="border-0 bg-transparent"
      />
    );
  } else {
    body = (
      <Stack as="ul" className="divide-y divide-border">
        {items.map((item, index) => (
          <Box as="li" key={item.id} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
            <CartLine item={item} compact onNavigate={onClose} />
          </Box>
        ))}
      </Stack>
    );
  }

  return (
    <>
      <SheetHeader className="border-b border-border">
        <SheetTitle className="font-display text-2xl tracking-[-0.04em]">Your basket</SheetTitle>
        <SheetDescription>
          {items.length > 0
            ? `${pluralize(cart?.itemCount ?? 0, "item")} · ${formatMoney(cart?.subtotal ?? 0)}`
            : "Delivery is always free"}
        </SheetDescription>
      </SheetHeader>

      {items.length > 0 && (
        <Flex align="center" gap="2.5" className="mx-4 mt-4 animate-fade-up rounded-2xl bg-fresh-soft px-4 py-3 text-brand-ink">
          <Truck aria-hidden="true" className="size-4 shrink-0" />
          <Text as="span" tone="inherit" weight="semibold" className="text-fs-13">
            Free delivery unlocked — on every order
          </Text>
        </Flex>
      )}

      <ScrollArea className="min-h-0 flex-1">
        <Box className="px-5">{body}</Box>
      </ScrollArea>

      {items.length > 0 && (
        <SheetFooter>
          <Flex align="baseline" justify="between">
            <Text as="span" tone="muted">
              Total
            </Text>
            <Price amount={cart?.grandTotal ?? 0} size="xl" />
          </Flex>
          {canCheckout ? (
            <ButtonLink href={customerRoutes.checkout} onClick={onClose} variant="fresh" size="xl" className="w-full">
              Checkout
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
          ) : (
            <Alert variant="destructive">
              <AlertBody>Some items need attention before you can check out.</AlertBody>
            </Alert>
          )}
          <ButtonLink href={customerRoutes.cart} onClick={onClose} variant="ghost" className="w-full">
            View full basket
          </ButtonLink>
        </SheetFooter>
      )}
    </>
  );
}

function CartLinesSkeleton() {
  return (
    <Stack aria-label="Loading" aria-busy="true" gap="5" className="py-5">
      {Array.from({ length: 3 }, (_, i) => (
        <Flex key={i} gap="3">
          <Skeleton className="size-16 rounded-lg" />
          <Stack gap="2" className="flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-9 w-28" />
          </Stack>
        </Flex>
      ))}
    </Stack>
  );
}

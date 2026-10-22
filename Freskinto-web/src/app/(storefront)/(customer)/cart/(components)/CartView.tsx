"use client";

import { ArrowRight, CircleAlert, ShoppingBasket, Trash2 } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
import { cartHasIssues } from "@/components/customer/cart/cart-availability";
import { CartLine } from "@/components/customer/cart/CartLine";
import { CartReceipt } from "@/components/customer/cart/CartReceipt";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { ProductRail } from "@/components/customer/product/ProductRail";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Price } from "@/components/shared/Price";
import { pluralize } from "@/lib/format";
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
      <Card>
        <EmptyState
          icon={<ShoppingBasket aria-hidden="true" />}
          title="Your basket is empty"
          message="Fresh produce, poultry and everyday essentials are waiting — and delivery is always free."
          action={
            <ButtonLink href={shopUrl()} size="lg">
              Start shopping
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </ButtonLink>
          }
        />
      </Card>
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
    <Button size="xl" disabled className={cn("w-full")}>
      Checkout
      <ArrowRight data-icon="inline-end" aria-hidden="true" />
    </Button>
  ) : (
    <ButtonLink href={customerRoutes.checkout} size="xl" className={cn("w-full")}>
      Checkout
      <ArrowRight data-icon="inline-end" aria-hidden="true" />
    </ButtonLink>
  );

  return (
    <>
      <Grid align="start" gap="6" className={cn("lg:grid-cols-12 lg:gap-8")}>
        <Card className={cn("lg:col-span-8")}>
          <CardHeader className={cn("border-b")}>
            <CardTitle>{pluralize(cart.items.length, "product")}</CardTitle>
            <CardAction>
              <Button variant="ghost" size="sm" className={cn("text-muted-foreground hover:text-destructive")} onClick={onClear}>
                <Trash2 data-icon="inline-start" aria-hidden="true" />
                Clear basket
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className={cn("flex flex-col gap-4")}>
            {hasIssues && (
              <Alert variant="destructive">
                <CircleAlert aria-hidden="true" />
                <AlertTitle>Some items need your attention</AlertTitle>
                <AlertDescription>Fix the highlighted lines before you check out.</AlertDescription>
              </Alert>
            )}
            <Stack className={cn("divide-y")}>
              {cart.items.map((item) => (
                <CartLine key={item.id} item={item} />
              ))}
            </Stack>
          </CardContent>
        </Card>

        <CartReceipt cart={cart} className={cn("lg:sticky lg:top-28 lg:col-span-4")}>
          {checkoutAction}
          <ButtonLink href={shopUrl()} variant="ghost" className={cn("w-full")}>
            Continue shopping
          </ButtonLink>
        </CartReceipt>
      </Grid>

      {/* Phone: checkout hamesha nazar mein — tab bar ke upar */}
      <Box className={cn("fixed inset-x-0 bottom-16 z-30 border-t bg-background/95 px-4 py-3 backdrop-blur md:hidden")}>
        <Flex align="center" gap="3">
          <Stack gap="0.5">
            <Text variant="small" tone="muted">
              Total
            </Text>
            <Price amount={cart.grandTotal} size="lg" tone="default" className={cn("font-heading")} />
          </Stack>
          <Box className={cn("flex-1")}>{checkoutAction}</Box>
        </Flex>
      </Box>
      <Box aria-hidden="true" className={cn("h-16 md:hidden")} />
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
      eyebrow="While you're here"
      title="You might also like"
      description="Fresh additions to round off your shop."
      href={shopUrl()}
      products={products}
      isLoading={isLoading}
      isError={isError}
      errorMessage={error?.message}
      onRetry={() => void refetch()}
      className={cn("pt-6")}
    />
  );
}

function CartPageSkeleton() {
  return (
    <Grid align="start" gap="6" aria-label="Loading" aria-busy="true" className={cn("lg:grid-cols-12 lg:gap-8")}>
      <Card className={cn("lg:col-span-8")}>
        <CardContent className={cn("flex flex-col gap-5")}>
          {Array.from({ length: 3 }, (_, i) => (
            <Flex key={i} gap="4">
              <Skeleton className={cn("size-24 rounded-xl")} />
              <Stack gap="2" className={cn("flex-1")}>
                <Skeleton className={cn("h-4 w-3/5")} />
                <Skeleton className={cn("h-3 w-1/4")} />
                <Skeleton className={cn("h-9 w-32 rounded-full")} />
              </Stack>
            </Flex>
          ))}
        </CardContent>
      </Card>
      <Skeleton className={cn("h-96 w-full rounded-2xl lg:col-span-4")} />
    </Grid>
  );
}

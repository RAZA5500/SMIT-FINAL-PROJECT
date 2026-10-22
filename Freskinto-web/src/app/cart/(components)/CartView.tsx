"use client";

import { ArrowRight, CircleAlert, ShoppingBasket, Trash2 } from "lucide-react";
import { useState } from "react";
import { Alert, AlertBody, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
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
      <Grid align="start" gap="6" className="lg:grid-cols-12 lg:gap-8">
        <Card render={<Box as="section" aria-label="Basket items" />} className="gap-0 rounded-3xl border-2 py-0 lg:col-span-8">
          <CardHeader className="border-b border-border py-4">
            <CardTitle render={<Box as="span" />} className="text-xl font-bold">
              {pluralize(cart.items.length, "product")}
            </CardTitle>
            <CardAction className="top-3">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full text-muted-foreground hover:bg-destructive-soft hover:text-destructive"
                onClick={onClear}
              >
                <Trash2 aria-hidden="true" />
                Clear basket
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {hasIssues && (
              <Alert variant="destructive" className="mt-4">
                <CircleAlert aria-hidden="true" />
                <AlertBody>
                  <AlertTitle>Some items need your attention</AlertTitle>
                  <AlertDescription>Fix the highlighted lines before you check out.</AlertDescription>
                </AlertBody>
              </Alert>
            )}
            <Stack as="ul" className="divide-y divide-border">
              {cart.items.map((item) => (
                <Box as="li" key={item.id}>
                  <CartLine item={item} />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <CartSummaryCard cart={cart} className="lg:sticky lg:top-28 lg:col-span-4">
          {checkoutAction}
          <ButtonLink href={customerRoutes.cartSummary} variant="outline" className="w-full rounded-full border-2">
            Review order summary
          </ButtonLink>
          <ButtonLink href={shopUrl()} variant="ghost" className="w-full rounded-full">
            Continue shopping
          </ButtonLink>
        </CartSummaryCard>
      </Grid>

      {/* Phone: checkout hamesha nazar mein — floating tab bar ke upar */}
      <Box className="glass fixed inset-x-3 bottom-24 z-30 rounded-3xl border border-border/70 px-4 py-3 shadow-lift lg:hidden">
        <Flex align="center" gap="3">
          <Stack gap="0.5">
            <Text as="span" tone="muted" className="text-fs-12">
              Total
            </Text>
            <Price amount={cart.grandTotal} size="lg" />
          </Stack>
          <Box className="flex-1">{checkoutAction}</Box>
        </Flex>
      </Box>
      <Box aria-hidden="true" className="h-20 lg:hidden" />
    </>
  );
}

/** Upsell — naye products jo basket mein nahi */
function SuggestedProducts({ excludeIds }: { excludeIds: string[] }) {
  const { data, isLoading, isError, error, refetch } = useGetProducts({ limit: 12, sortBy: "newest" });
  const products = data?.data.filter((product) => !excludeIds.includes(product.id)).slice(0, 4);
  if (!isLoading && !isError && !products?.length) return null;

  return (
    <Stack as="section" aria-label="Suggestions" gap="6" className="pt-6">
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
    </Stack>
  );
}

function CartViewSkeleton() {
  return (
    <Grid aria-label="Loading" aria-busy="true" align="start" gap="6" className="lg:grid-cols-12 lg:gap-8">
      <Card className="gap-5 rounded-3xl border-2 p-5 lg:col-span-8">
        {Array.from({ length: 3 }, (_, i) => (
          <Flex key={i} gap="4">
            <Skeleton className="size-24 rounded-2xl" />
            <Stack gap="2" className="flex-1">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-10 w-32 rounded-full" />
            </Stack>
          </Flex>
        ))}
      </Card>
      <Skeleton className="h-96 w-full rounded-3xl lg:col-span-4" />
    </Grid>
  );
}

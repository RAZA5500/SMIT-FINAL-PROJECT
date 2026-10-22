"use client";

import { ArrowRight, ShoppingBasket, Truck } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
import { CartReceipt } from "@/components/customer/cart/CartReceipt";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatMoney } from "@/lib/format";
import { customerRoutes, shopUrl } from "@/lib/routes/routes";
import { useGetCart } from "@/services/cart/queries";

export function CartSummaryView() {
  const { data: cart, isLoading, isError, error, refetch } = useGetCart();
  const items = cart?.items ?? [];

  if (isLoading) {
    return (
      <Container className="py-8">
        <Stack gap="6" aria-busy="true">
          <Skeleton className="h-20 w-72 rounded-2xl" />
          <Grid gap="6" className="lg:grid-cols-12">
            <Skeleton className="h-96 rounded-2xl lg:col-span-8" />
            <Skeleton className="h-96 rounded-2xl lg:col-span-4" />
          </Grid>
        </Stack>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="py-10">
        <ErrorState
          title="Could not load your cart summary"
          message={error?.message}
          onRetry={() => void refetch()}
        />
      </Container>
    );
  }

  if (!cart || items.length === 0) {
    return (
      <Container className="py-12">
        <EmptyState
          icon={<ShoppingBasket aria-hidden="true" />}
          title="Your basket is empty"
          message="Browse fresh organic produce and everyday essentials to build your order."
          action={
            <ButtonLink href={shopUrl()} size="lg" variant="brand">
              Browse products
            </ButtonLink>
          }
        />
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-10">
      <Stack gap="8">
        <PageHeader
          eyebrow="Review & Total"
          title="Cart summary"
          description="A complete line-by-line summary of your selected items before entering delivery details."
        />

        <Grid gap="8" className="lg:grid-cols-12">
          <Card className="lg:col-span-7">
            <CardHeader className="border-b">
              <CardTitle>Basket Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              {items.map((item) => (
                <Flex key={item.id} align="center" justify="between" gap="4" className="py-3.5">
                  <Stack gap="0.5">
                    <Text weight="semibold" className="text-foreground">
                      {item.name}
                    </Text>
                    <Text variant="small" tone="muted">
                      Qty: {item.quantity} · {formatMoney(item.price)} each
                    </Text>
                  </Stack>
                  <Text weight="bold" numeric className="text-base text-foreground">
                    {formatMoney(item.lineTotal)}
                  </Text>
                </Flex>
              ))}

              <Flex align="center" gap="2.5" className="pt-4 text-brand-green">
                <Truck className="size-4" />
                <Text variant="small" weight="medium" className="text-brand-green">
                  Standard delivery is free on all orders
                </Text>
              </Flex>
            </CardContent>
          </Card>

          <Box className="lg:col-span-5">
            <CartReceipt cart={cart} showItems={false} className="lg:sticky lg:top-24">
              <ButtonLink
                href={customerRoutes.checkout}
                size="xl"
                variant="brand"
                className="w-full shadow-md shadow-brand-green/20"
              >
                Proceed to checkout
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href={customerRoutes.cart} variant="outline" size="lg" className="w-full">
                Edit items in basket
              </ButtonLink>
            </CartReceipt>
          </Box>
        </Grid>
      </Stack>
    </Container>
  );
}

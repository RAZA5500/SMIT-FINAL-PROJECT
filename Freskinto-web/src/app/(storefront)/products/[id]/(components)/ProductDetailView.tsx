"use client";

import { ArrowLeft, Clock, PackageCheck, Store, Truck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading, Text } from "@/components/ui/typography";
import { ProductBadges } from "@/components/customer/product/ProductCard";
import { ProductRail } from "@/components/customer/product/ProductRail";
import { aisleIndexOf, useAisles } from "@/components/customer/shop/use-aisles";
import { AisleTag } from "@/components/shared/AisleTag";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { ShelfLabel } from "@/components/shared/Price";
import { ProductImage } from "@/components/shared/ProductImage";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TextLink } from "@/components/shared/TextLink";
import { STORE } from "@/constants/store";
import { ApiError } from "@/lib/networking/request";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetProduct, useGetProducts } from "@/services/products/queries";
import type { IProduct } from "@/services/products/types";
import { PurchasePanel } from "./PurchasePanel";

const RELATED_LIMIT = 12;

/** Store ke asli wade — FLOW-MD 01 (shipping 0, pickup slot, cancel before packing) */
const PERKS = [
  { icon: Truck, title: "Free delivery", text: "On every order — no minimum spend." },
  { icon: Store, title: "Click & collect", text: "Choose a collection time at checkout." },
  { icon: Clock, title: "Pay in minutes", text: `Confirmed as soon as you pay (within ${STORE.paymentWindowMinutes} minutes).` },
  { icon: PackageCheck, title: "Track every step", text: "Cancel any time before we start packing." },
];

export function ProductDetailView({ id }: { id: string }) {
  const { data: product, isLoading, isError, error, refetch } = useGetProduct(id);

  if (isLoading) return <ProductDetailSkeleton />;

  if (isError || !product) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <Container className={cn("py-12")}>
        {notFound ? (
          <EmptyState
            title="This product isn't available"
            message="It may have sold out for good or been removed from the shop."
            action={
              <ButtonLink href={shopUrl()}>
                <ArrowLeft data-icon="inline-start" aria-hidden="true" />
                Back to the shop
              </ButtonLink>
            }
          />
        ) : (
          <ErrorState title="Couldn't load this product" message={error?.message} onRetry={() => void refetch()} />
        )}
      </Container>
    );
  }

  return (
    <Stack gap="16" className={cn("pb-16 sm:gap-24")}>
      <ProductOverview product={product} />
      <RelatedProducts product={product} />
    </Stack>
  );
}

function ProductOverview({ product }: { product: IProduct }) {
  const { aisles } = useAisles();
  const aisleIndex = aisleIndexOf(aisles, product.category.id);

  return (
    <Container className={cn("flex flex-col gap-6 pt-8")}>
      <PageBreadcrumbs
        root={{ label: "Home", href: publicRoutes.home }}
        items={[
          { label: "Shop", href: shopUrl() },
          { label: product.category.name, href: shopUrl({ category: product.category.id }) },
          { label: product.name },
        ]}
      />

      <Grid gap="8" className={cn("lg:grid-cols-12 lg:gap-14")}>
        <Box className={cn("relative lg:col-span-7")}>
          <Card className={cn("overflow-hidden py-0")}>
            <ProductImage
              name={product.name}
              categoryName={product.category.name}
              alt={product.name}
              eager
              sizes="(min-width: 1024px) 680px, 100vw"
              muted={product.stockStatus === "OUT_OF_STOCK"}
              imageClassName={cn("p-10 sm:p-16")}
            />
          </Card>
          <ProductBadges product={product} className={cn("absolute top-4 left-4")} />
        </Box>

        <Stack gap="6" className={cn("lg:col-span-5 lg:py-2")}>
          <Stack gap="3">
            <TextLink href={shopUrl({ category: product.category.id })} className={cn("w-fit hover:no-underline")}>
              <AisleTag index={aisleIndex} label={product.category.name} className={cn("hover:border-primary")} />
            </TextLink>
            <Heading size="1" className={cn("font-heading font-extrabold tracking-tight text-foreground lg:text-5xl")}>
              {product.name}
            </Heading>
            <Text variant="small" tone="muted" className={cn("font-medium")}>
              SKU {product.sku}
            </Text>
          </Stack>

          <Flex wrap align="end" gap="4">
            <ShelfLabel amount={product.price} size="lg" />
            <StatusBadge status={product.stockStatus} />
          </Flex>

          <PurchasePanel product={product} />

          <Separator />

          <Accordion multiple defaultValue={["delivery"]}>
            <AccordionItem value="delivery">
              <AccordionTrigger className={cn("text-base hover:no-underline")}>Delivery &amp; collection</AccordionTrigger>
              <AccordionContent>
                <ItemGroup className={cn("gap-1")}>
                  {PERKS.map(({ icon: Icon, title, text }) => (
                    <Item key={title} size="sm" className={cn("px-0")}>
                      <ItemMedia className={cn("size-9 rounded-xl border border-primary/20 bg-primary/10 text-brand-green [&_svg]:size-4")}>
                        <Icon aria-hidden="true" />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle className={cn("font-semibold")}>{title}</ItemTitle>
                        <ItemDescription>{text}</ItemDescription>
                      </ItemContent>
                    </Item>
                  ))}
                </ItemGroup>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="limits">
              <AccordionTrigger className={cn("text-base hover:no-underline")}>Order limits</AccordionTrigger>
              <AccordionContent>
                <Text tone="muted">
                  Add at least {product.minimumOrderQuantity} and at most {product.maximumOrderQuantity} per order. The
                  basket also caps the quantity at what&apos;s on the shelf.
                </Text>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Stack>
      </Grid>
    </Container>
  );
}

function RelatedProducts({ product }: { product: IProduct }) {
  const { data, isLoading, isError, error, refetch } = useGetProducts({
    categoryId: product.category.id,
    limit: RELATED_LIMIT + 1,
  });
  const related = data?.data.filter((item) => item.id !== product.id).slice(0, RELATED_LIMIT);

  // Aisle mein sirf yahi product ho to shelf ka koi faida nahi
  if (!isLoading && !isError && !related?.length) return null;

  return (
    <Container>
      <ProductRail
        eyebrow="Same aisle"
        title={`More from ${product.category.name}`}
        href={shopUrl({ category: product.category.id })}
        products={related}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        onRetry={() => void refetch()}
      />
    </Container>
  );
}

function ProductDetailSkeleton() {
  return (
    <Container aria-label="Loading" aria-busy="true" className={cn("flex flex-col gap-6 pt-8")}>
      <Skeleton className={cn("h-4 w-64")} />
      <Grid gap="8" className={cn("lg:grid-cols-12 lg:gap-14")}>
        <Skeleton className={cn("aspect-square w-full rounded-2xl lg:col-span-7")} />
        <Stack gap="4" className={cn("lg:col-span-5 lg:py-2")}>
          <Skeleton className={cn("h-6 w-36 rounded-md")} />
          <Skeleton className={cn("h-12 w-4/5")} />
          <Skeleton className={cn("h-16 w-36 rounded-lg")} />
          <Skeleton className={cn("h-12 w-full rounded-full")} />
          <Skeleton className={cn("h-40 w-full rounded-2xl")} />
        </Stack>
      </Grid>
    </Container>
  );
}

"use client";

import { ArrowLeft, Clock, PackageCheck, Store, Truck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Box } from "@/components/ui/box";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading, Text } from "@/components/ui/typography";
import { ProductBadges, ProductCard } from "@/components/customer/product/ProductCard";
import { ProductCardSkeleton } from "@/components/customer/product/ProductCardSkeleton";
import { aisleIndexOf, useAisles } from "@/components/customer/shop/use-aisles";
import { AisleTag } from "@/components/shared/AisleTag";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { Price } from "@/components/shared/Price";
import { ProductImage } from "@/components/shared/ProductImage";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TextLink } from "@/components/shared/TextLink";
import { STORE } from "@/constants/store";
import { ApiError } from "@/lib/api";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { useGetProduct, useGetProducts } from "@/services/products/queries";
import type { IProduct } from "@/services/products/types";
import { PurchasePanel } from "./PurchasePanel";

const RELATED_LIMIT = 8;

/** Store ke asli wade — FLOW-MD 01 (shipping 0, pickup slot, cancel before packing) */
const PERKS = [
  { icon: Truck, title: "Free delivery", text: "On every order — no minimum spend." },
  { icon: Store, title: "Click & collect", text: "Choose a collection day and hour at checkout." },
  { icon: Clock, title: "Pay in minutes", text: `Confirmed as soon as you pay (within ${STORE.paymentWindowMinutes} minutes).` },
  { icon: PackageCheck, title: "Track every step", text: "Cancel any time before we start packing." },
];

export function ProductDetailView({ id }: { id: string }) {
  const { data: product, isLoading, isError, error, refetch } = useGetProduct(id);

  if (isLoading) return <ProductDetailSkeleton />;

  if (isError || !product) {
    const notFound = error instanceof ApiError && error.status === 404;
    return (
      <Container className="py-12">
        {notFound ? (
          <EmptyState
            title="This product isn't available"
            message="It may have sold out for good or been removed from the shop."
            action={
              <ButtonLink href={shopUrl()}>
                <ArrowLeft aria-hidden="true" />
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
    <Container className="flex flex-col gap-20 py-8 sm:py-10">
      <ProductOverview product={product} />
      <RelatedProducts product={product} />
    </Container>
  );
}

function ProductOverview({ product }: { product: IProduct }) {
  const { aisles } = useAisles();
  const aisleIndex = aisleIndexOf(aisles, product.category.id);

  return (
    <Stack gap="6">
      <PageBreadcrumbs
        root={{ label: "Home", href: publicRoutes.home }}
        items={[
          { label: "Shop", href: shopUrl() },
          { label: product.category.name, href: shopUrl({ category: product.category.id }) },
          { label: product.name },
        ]}
      />

      <Grid gap="8" className="lg:grid-cols-2 lg:gap-14">
        <Box className="relative">
          <ProductImage
            name={product.name}
            categoryName={product.category.name}
            alt={product.name}
            eager
            sizes="(min-width: 1024px) 680px, 100vw"
            muted={product.stockStatus === "OUT_OF_STOCK"}
            className="rounded-xl sm:aspect-4/3"
            imageClassName="p-10 sm:p-14"
          />
          <ProductBadges product={product} className="absolute top-4 left-4" />
        </Box>

        <Stack gap="6" className="lg:py-2">
          <Stack gap="3">
            <TextLink href={shopUrl({ category: product.category.id })} className="w-fit hover:no-underline">
              <AisleTag index={aisleIndex} label={product.category.name} />
            </TextLink>
            <Heading as="h1" size="1">
              {product.name}
            </Heading>
            <Text tone="muted" family="mono" className="text-fs-12">
              SKU {product.sku}
            </Text>
          </Stack>

          <Flex wrap align="center" gap="4">
            <Price amount={product.price} size="xl" />
            <StatusBadge status={product.stockStatus} />
          </Flex>

          <PurchasePanel product={product} />

          <Accordion defaultValue={[PERKS[0].title]} className="rounded-lg border border-border px-4">
            {PERKS.map(({ icon: Icon, title, text }) => (
              <AccordionItem key={title} value={title}>
                <AccordionTrigger className="items-center py-3.5 font-medium hover:no-underline">
                  <Flex as="span" align="center" gap="3">
                    <Flex
                      as="span"
                      align="center"
                      justify="center"
                      aria-hidden="true"
                      className="size-8 rounded-md bg-muted text-muted-foreground"
                    >
                      <Icon className="size-4" />
                    </Flex>
                    {title}
                  </Flex>
                </AccordionTrigger>
                <AccordionContent className="pl-11 text-muted-foreground">{text}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Stack>
      </Grid>
    </Stack>
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
    <Stack as="section" aria-label="Related products" gap="6">
      <SectionHeading
        title={`More from ${product.category.name}`}
        href={shopUrl({ category: product.category.id })}
      />
      {isError ? (
        <ErrorState title="Couldn't load products" message={error?.message} onRetry={() => void refetch()} />
      ) : (
        <Carousel opts={{ align: "start", dragFree: true }} aria-label={`More from ${product.category.name}`}>
          <CarouselContent className="-ml-3 sm:-ml-4">
            {isLoading
              ? Array.from({ length: 4 }, (_, index) => (
                  <CarouselItem key={index} className="basis-1/2 pl-3 sm:pl-4 md:basis-1/3 xl:basis-1/4">
                    <ProductCardSkeleton />
                  </CarouselItem>
                ))
              : related?.map((item) => (
                  <CarouselItem key={item.id} className="basis-1/2 pl-3 sm:pl-4 md:basis-1/3 xl:basis-1/4">
                    <ProductCard product={item} />
                  </CarouselItem>
                ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 hidden bg-background shadow-soft md:flex" />
          <CarouselNext className="-right-4 hidden bg-background shadow-soft md:flex" />
        </Carousel>
      )}
    </Stack>
  );
}

function ProductDetailSkeleton() {
  return (
    <Container aria-label="Loading" aria-busy="true" className="flex flex-col gap-6 py-8 sm:py-10">
      <Skeleton className="h-4 w-64" />
      <Grid gap="8" className="lg:grid-cols-2 lg:gap-14">
        <Skeleton className="aspect-square w-full rounded-xl sm:aspect-4/3" />
        <Stack gap="4" className="lg:py-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-9 w-4/5" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </Stack>
      </Grid>
    </Container>
  );
}

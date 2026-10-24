"use client";

import { ArrowLeft, Clock, PackageCheck, Store, Truck } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
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
import { Reveal } from "@/components/ui/reveal";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading, Text } from "@/components/ui/typography";
import { ProductCard } from "@/components/customer/product/ProductCard";
import { ProductCardSkeleton } from "@/components/customer/product/ProductCardSkeleton";
import { aisleIndexOf, useAisles } from "@/components/customer/shop/use-aisles";
import { AisleTag } from "@/components/shared/AisleTag";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { Price } from "@/components/shared/Price";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TextLink } from "@/components/shared/TextLink";
import { STORE } from "@/constants/store";
import { ApiError } from "@/lib/api";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { useGetProduct, useGetProducts } from "@/services/products/queries";
import type { IProduct } from "@/services/products/types";
import { ProductStage } from "./ProductStage";
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
              <ButtonLink href={shopUrl()} transitionTypes={["nav-back"]}>
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

      <Grid gap="8" className="items-start lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <ProductStage product={product} />

        <Stack gap="7" className="lg:py-4">
          <Stack gap="4" className="animate-fade-up">
            <TextLink href={shopUrl({ category: product.category.id })} className="w-fit hover:no-underline">
              <AisleTag index={aisleIndex} label={product.category.name} />
            </TextLink>
            <Heading as="h1" size="display">
              {product.name}
            </Heading>
            <Text tone="muted" family="mono" className="text-fs-12">
              SKU {product.sku}
            </Text>
          </Stack>

          <Flex wrap align="center" gap="4" className="animate-fade-up [animation-delay:90ms]">
            <Price amount={product.price} size="xl" />
            <StatusBadge status={product.stockStatus} />
          </Flex>

          <Separator />

          <Box className="animate-fade-up [animation-delay:180ms]">
            <PurchasePanel product={product} />
          </Box>

          <Grid gap="3" className="sm:grid-cols-2">
            {PERKS.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} delay={220 + index * 70} className="h-full">
                <Card className="h-full flex-row items-start gap-3.5 rounded-3xl p-4 transition-[translate,box-shadow] duration-500 ease-out-expo hover:-translate-y-0.5 hover:shadow-lift">
                  <Flex
                    as="span"
                    align="center"
                    justify="center"
                    aria-hidden="true"
                    className="size-10 shrink-0 rounded-2xl bg-fresh text-[#06100b] shadow-glow"
                  >
                    <Icon className="size-4.5" />
                  </Flex>
                  <Stack gap="0.5">
                    <Text weight="bold">{title}</Text>
                    <Text tone="muted" className="text-fs-13 leading-relaxed">
                      {text}
                    </Text>
                  </Stack>
                </Card>
              </Reveal>
            ))}
          </Grid>

          <Reveal delay={450}>
            <Accordion className="rounded-[1.75rem] border border-border/80 bg-card/60 p-2 backdrop-blur-sm sm:p-3 dark:border-white/[0.08]">
              <AccordionItem value="freshness">
                <AccordionTrigger className="px-3 py-3 text-base">
                  Freshness &amp; Quality Guarantee
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3 text-muted-foreground leading-relaxed">
                  Hand-inspected daily for peak ripeness and flavour. Kept chilled in temperature-controlled transit from our market shelves straight to your door.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="storage">
                <AccordionTrigger className="px-3 py-3 text-base">
                  Storage &amp; Shelf Life
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3 text-muted-foreground leading-relaxed">
                  Keep refrigerated or in a cool, dry pantry upon arrival. For the most vibrant taste and texture, best consumed within 3–5 days of delivery.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="delivery">
                <AccordionTrigger className="px-3 py-3 text-base">
                  Delivery &amp; Free Returns
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3 text-muted-foreground leading-relaxed">
                  Zero delivery fee on all orders. Pick a convenient Click &amp; Collect hour at checkout or choose free doorstep delivery. If you&apos;re not delighted, reach out to our team for a no-quibble refund or replacement.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Reveal>
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
      <Reveal>
        <SectionHeading
          eyebrow="Same aisle"
          title={
            <>
              More from{" "}
              <Text as="em" variant="accent">
                {product.category.name}
              </Text>
            </>
          }
          href={shopUrl({ category: product.category.id })}
        />
      </Reveal>
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
                    <ProductCard product={item} morph />
                  </CarouselItem>
                ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 hidden glass md:flex" />
          <CarouselNext className="-right-4 hidden glass md:flex" />
        </Carousel>
      )}
    </Stack>
  );
}

function ProductDetailSkeleton() {
  return (
    <Container aria-label="Loading" aria-busy="true" className="flex flex-col gap-6 py-8 sm:py-10">
      <Skeleton className="h-4 w-64" />
      <Grid gap="8" className="lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <Skeleton className="aspect-square w-full rounded-[2.5rem] sm:aspect-5/4 lg:aspect-square" />
        <Stack gap="5" className="lg:py-4">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-16 w-4/5 rounded-2xl" />
          <Skeleton className="h-11 w-32 rounded-2xl" />
          <Skeleton className="h-13 w-full rounded-full" />
          <Grid gap="3" className="sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-22 rounded-3xl" />
            ))}
          </Grid>
        </Stack>
      </Grid>
    </Container>
  );
}

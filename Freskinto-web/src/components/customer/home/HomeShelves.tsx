"use client";

import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Box } from "@/components/ui/box";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Flex, Stack } from "@/components/ui/flex";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { shopUrl } from "@/lib/routes/routes";
import { useGetProducts } from "@/services/products/queries";
import type { IFetchProductsPayload } from "@/services/products/types";
import { ProductCard } from "../product/ProductCard";
import { ProductCardSkeleton } from "../product/ProductCardSkeleton";
import { useAisles } from "../shop/use-aisles";

const SHELF_SIZE = 10;
const AISLE_TABS = 3;

interface Shelf {
  id: string;
  label: string;
  query: IFetchProductsPayload;
  href: string;
}

/** Ek shelf: products ka carousel (swipe / arrows / ← → keys) */
function ShelfCarousel({ shelf }: { shelf: Shelf }) {
  const { data, isLoading, isError, error, refetch } = useGetProducts({ ...shelf.query, limit: SHELF_SIZE });
  const products = data?.data ?? [];

  if (isError) return <ErrorState title="Couldn't load this shelf" message={error.message} onRetry={() => void refetch()} />;
  if (!isLoading && products.length === 0) {
    return <EmptyState title="This shelf is being restocked" message="Check back soon — or browse the whole shop." />;
  }

  return (
    <Carousel opts={{ align: "start", dragFree: true }} aria-label={shelf.label} className="group/shelf">
      <CarouselContent className="-ml-3 sm:-ml-4">
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => (
              <CarouselItem key={index} className="basis-1/2 pl-3 sm:pl-4 md:basis-1/3 xl:basis-1/4">
                <ProductCardSkeleton />
              </CarouselItem>
            ))
          : products.map((product, index) => (
              <CarouselItem key={product.id} className="basis-1/2 pl-3 sm:pl-4 md:basis-1/3 xl:basis-1/4">
                <ProductCard product={product} eager={index < 2} />
              </CarouselItem>
            ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4 hidden bg-background shadow-soft md:flex" />
      <CarouselNext className="-right-4 hidden bg-background shadow-soft md:flex" />
    </Carousel>
  );
}

/** "Popular right now" — tabs (naye products, sasti cheezein, top aisles), har ek ka carousel */
export function HomeShelves() {
  const { aisles } = useAisles();
  const shelves = useMemo<Shelf[]>(
    () => [
      {
        id: "new",
        label: "New in",
        query: { sortBy: "newest" },
        href: shopUrl({ sort: "newest" }),
      },
      {
        id: "budget",
        label: "Under £2",
        query: { maxPrice: 2, sortBy: "price_asc" },
        href: shopUrl({ max: 2, sort: "price_asc" }),
      },
      ...aisles.slice(0, AISLE_TABS).map((aisle) => ({
        id: aisle.id,
        label: aisle.name,
        query: { categoryId: aisle.id },
        href: shopUrl({ category: aisle.id }),
      })),
    ],
    [aisles],
  );
  const [tab, setTab] = useState("new");
  const active = shelves.find((shelf) => shelf.id === tab) ?? shelves[0];

  return (
    <Stack as="section" id="shelves" aria-labelledby="shelves-heading" gap="6" className="scroll-mt-header">
      <SectionHeading id="shelves-heading" title="Popular right now" />
      <Tabs value={tab} onValueChange={(value) => setTab(value as string)} className="gap-5">
        <Flex wrap align="center" justify="between" gap="3">
          <Box className="no-scrollbar max-w-full overflow-x-auto">
            <TabsList>
              {shelves.map((shelf) => (
                <TabsTrigger key={shelf.id} value={shelf.id} className="px-3">
                  {shelf.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Box>
          <ButtonLink href={active.href} variant="ghost" size="sm" className="group/more -mr-3">
            View all
            <ArrowRight aria-hidden="true" className="transition-transform group-hover/more:translate-x-0.5" />
          </ButtonLink>
        </Flex>
        {shelves.map((shelf) => (
          <TabsContent key={shelf.id} value={shelf.id}>
            <ShelfCarousel shelf={shelf} />
          </TabsContent>
        ))}
      </Tabs>
    </Stack>
  );
}

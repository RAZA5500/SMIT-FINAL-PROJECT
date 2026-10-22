"use client";

import { ArrowRight, Sparkles, Tag } from "lucide-react";
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
import { categoryTheme } from "@/lib/merchandising";
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
  icon?: React.ReactNode;
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
      <CarouselContent className="-ml-3 py-2 sm:-ml-5">
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => (
              <CarouselItem key={index} className="basis-1/2 pl-3 sm:pl-5 md:basis-1/3 xl:basis-1/4">
                <ProductCardSkeleton />
              </CarouselItem>
            ))
          : products.map((product, index) => (
              <CarouselItem key={product.id} className="basis-1/2 pl-3 sm:pl-5 md:basis-1/3 xl:basis-1/4">
                <ProductCard product={product} eager={index < 2} />
              </CarouselItem>
            ))}
      </CarouselContent>
      <CarouselPrevious className="-left-3 hidden size-11 border-2 bg-card shadow-lift md:flex" />
      <CarouselNext className="-right-3 hidden size-11 border-2 bg-card shadow-lift md:flex" />
    </Carousel>
  );
}

/** "Fresh on the shelves" — tabs (naye products, sasti cheezein, top aisles) har ek ka carousel */
export function HomeShelves() {
  const { aisles } = useAisles();
  const shelves = useMemo<Shelf[]>(
    () => [
      {
        id: "new",
        label: "Just landed",
        icon: <Sparkles aria-hidden="true" />,
        query: { sortBy: "newest" },
        href: shopUrl({ sort: "newest" }),
      },
      {
        id: "budget",
        label: "Under £2",
        icon: <Tag aria-hidden="true" />,
        query: { maxPrice: 2, sortBy: "price_asc" },
        href: shopUrl({ max: 2, sort: "price_asc" }),
      },
      ...aisles.slice(0, AISLE_TABS).map((aisle) => {
        const Icon = categoryTheme(aisle.name).icon;
        return {
          id: aisle.id,
          label: aisle.name,
          icon: <Icon aria-hidden="true" />,
          query: { categoryId: aisle.id },
          href: shopUrl({ category: aisle.id }),
        };
      }),
    ],
    [aisles],
  );
  const [tab, setTab] = useState("new");
  const active = shelves.find((shelf) => shelf.id === tab) ?? shelves[0];

  return (
    <Stack as="section" id="shelves" aria-labelledby="shelves-heading" gap="6" className="scroll-mt-header">
      <SectionHeading
        id="shelves-heading"
        eyebrow="Picked for you"
        title="Fresh on the shelves"
        description="Swipe through what just arrived, the bargains and the busiest aisles."
      />
      <Tabs value={tab} onValueChange={(value) => setTab(value as string)} className="gap-5">
        <Flex wrap align="center" justify="between" gap="3">
          <Box className="no-scrollbar -mx-1 max-w-full overflow-x-auto px-1 py-1">
            <TabsList className="h-auto rounded-full border-2 border-border bg-card p-1">
              {shelves.map((shelf) => (
                <TabsTrigger
                  key={shelf.id}
                  value={shelf.id}
                  className="rounded-full px-4 py-2 font-semibold data-active:bg-primary! data-active:text-primary-foreground! data-active:shadow-none!"
                >
                  {shelf.icon}
                  {shelf.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Box>
          <ButtonLink href={active.href} variant="ghost" className="rounded-full text-primary">
            Shop this shelf
            <ArrowRight aria-hidden="true" />
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

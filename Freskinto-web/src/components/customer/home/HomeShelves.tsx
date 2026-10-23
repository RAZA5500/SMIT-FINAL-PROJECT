"use client";

import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import { Reveal } from "@/components/ui/reveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetProducts } from "@/services/products/queries";
import type { IFetchProductsPayload } from "@/services/products/types";
import { ProductCard } from "../product/ProductCard";
import { ProductCardSkeleton } from "../product/ProductCardSkeleton";
import { PRODUCT_GRID_CLASS } from "../product/product-grid";
import { useAisles } from "../shop/use-aisles";

const SHELF_SIZE = 8;
const AISLE_TABS = 3;

interface Shelf {
  id: string;
  label: string;
  query: IFetchProductsPayload;
  href: string;
}

/** Ek shelf ka grid — tab badalte hi cards ek lehar mein ubharte hain */
function ShelfGrid({ shelf }: { shelf: Shelf }) {
  const { data, isLoading, isError, error, refetch } = useGetProducts({ ...shelf.query, limit: SHELF_SIZE });
  const products = data?.data ?? [];

  if (isError) return <ErrorState title="Couldn't load this shelf" message={error.message} onRetry={() => void refetch()} />;
  if (!isLoading && products.length === 0) {
    return <EmptyState title="This shelf is being restocked" message="Check back soon — or browse the whole shop." />;
  }

  return (
    <Box className={cn(PRODUCT_GRID_CLASS, "lg:grid-cols-4")}>
      {isLoading
        ? Array.from({ length: 4 }, (_, index) => <ProductCardSkeleton key={index} />)
        : products.map((product, index) => (
            <Reveal key={product.id} variant="scale" delay={(index % 4) * 70 + Math.floor(index / 4) * 60}>
              <ProductCard product={product} eager={index < 2} morph />
            </Reveal>
          ))}
    </Box>
  );
}

/** "Picked fresh today" — tabs (naye products, sasti cheezein, top aisles); pill indicator slide karti hai */
export function HomeShelves() {
  const { aisles } = useAisles();
  const shelves = useMemo<Shelf[]>(
    () => [
      { id: "new", label: "New in", query: { sortBy: "newest" }, href: shopUrl({ sort: "newest" }) },
      { id: "budget", label: "Under £2", query: { maxPrice: 2, sortBy: "price_asc" }, href: shopUrl({ max: 2, sort: "price_asc" }) },
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
    <Stack as="section" id="shelves" aria-labelledby="shelves-heading" gap="8" className="scroll-mt-header">
      <Reveal>
        <SectionHeading
          id="shelves-heading"
          eyebrow="Today's shelves"
          title={
            <>
              Picked{" "}
              <Text as="em" variant="accent">
                fresh
              </Text>{" "}
              today
            </>
          }
          description="What just arrived, the little bargains and the busiest aisles — straight from the shelf."
        />
      </Reveal>
      <Tabs value={tab} onValueChange={(value) => setTab(value as string)} className="gap-7">
        <Reveal delay={80}>
          <Flex wrap align="center" justify="between" gap="3">
            {/* Phone par tabs screen ke kinare tak scroll hote hain — beech mein kati hui pill nahi dikhti */}
            <Box className="no-scrollbar -mx-4 w-[calc(100%+2rem)] overflow-x-auto px-4 py-1 sm:mx-0 sm:w-auto sm:max-w-full sm:px-1">
              <TabsList>
                {shelves.map((shelf) => (
                  <TabsTrigger key={shelf.id} value={shelf.id}>
                    {shelf.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Box>
            <ButtonLink href={active.href} variant="ghost" className="group/more">
              Shop this shelf
              <ArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover/more:translate-x-1" />
            </ButtonLink>
          </Flex>
        </Reveal>
        {shelves.map((shelf) => (
          <TabsContent key={shelf.id} value={shelf.id}>
            <ShelfGrid shelf={shelf} />
          </TabsContent>
        ))}
      </Tabs>
    </Stack>
  );
}

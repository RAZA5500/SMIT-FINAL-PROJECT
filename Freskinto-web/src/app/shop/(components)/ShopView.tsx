"use client";

import { SearchX } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ProductGridSkeleton } from "@/components/customer/product/ProductCardSkeleton";
import { ProductListing } from "@/components/customer/ProductListing";
import { findCategory, findParent } from "@/components/customer/shop/category-tree";
import { aisleIndexOf, useAisles } from "@/components/customer/shop/use-aisles";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { SHOP_PAGE_SIZE } from "@/constants/filters";
import { useHydrated } from "@/hooks/useHydrated";
import { pluralize } from "@/lib/utils";
import { useGetProducts } from "@/services/products/queries";
import { useShopStore } from "@/stores/shop-store";
import { CategoryPills } from "./CategoryPills";
import { ShopFilters } from "./ShopFilters";
import { ShopHeader } from "./ShopHeader";
import { ShopToolbar, SortSelect } from "./ShopToolbar";
import { ShopViewSkeleton } from "./ShopViewSkeleton";
import { useShopParams } from "./useShopParams";

/** Shop: filters URL mein; categories ∥ products parallel load (FLOW-MD 08 §11, 11 §7) */
export function ShopView() {
  const shop = useShopParams();
  const hydrated = useHydrated();
  const layout = useShopStore((state) => state.productLayout);
  const setLayout = useShopStore((state) => state.setProductLayout);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetProducts({
    page: shop.page,
    limit: SHOP_PAGE_SIZE,
    q: shop.q || undefined,
    categoryId: shop.category ?? undefined,
    minPrice: shop.min ?? undefined,
    maxPrice: shop.max ?? undefined,
    sortBy: shop.sort ?? undefined,
  });
  const { aisles } = useAisles();

  // Availability API mein nahi — current page ke results ko client par chhaanta jata hai
  const products = useMemo(
    () => (shop.inStock ? data?.data.filter((product) => product.stockStatus !== "OUT_OF_STOCK") : data?.data),
    [data, shop.inStock],
  );
  const hiddenCount = (data?.data.length ?? 0) - (products?.length ?? 0);

  // Suspense ke andar — hydration tak server wala skeleton (footer ki categories cache mein aa chuki hoti hain)
  if (!hydrated) return <ShopViewSkeleton />;

  const category = findCategory(aisles, shop.category);
  const parent = findParent(aisles, shop.category);
  const aisleIndex = aisleIndexOf(aisles, shop.category);

  const goToPage = (page: number) => {
    shop.update({ page });
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const emptyState = shop.hasFilters ? (
    <EmptyState
      icon={<SearchX aria-hidden="true" />}
      title="No products match your filters"
      message="Try a different search, widen the price range or browse another aisle."
      action={
        <Button variant="cta" onClick={shop.clear}>
          Clear all filters
        </Button>
      }
    />
  ) : undefined;

  return (
    <Container className="flex flex-col gap-6 py-6 sm:py-8">
      <ShopHeader
        shop={shop}
        category={category}
        parent={parent}
        aisleIndex={aisleIndex}
        totalCount={data?.meta.total}
      />

      <CategoryPills aisles={aisles} selected={shop.category} onSelect={(next) => shop.update({ category: next })} />

      <Flex align="start" gap="8">
        <Card
          render={<Box as="aside" aria-label="Filters" />}
          className="sticky top-32 hidden max-h-[calc(100dvh-9rem)] w-72 shrink-0 overflow-y-auto rounded-3xl border-2 px-5 py-1 shadow-none scrollbar-thin lg:flex"
        >
          <ShopFilters shop={shop} />
        </Card>

        <Stack
          as="section"
          id="products"
          ref={resultsRef}
          aria-label="Products"
          aria-busy={isFetching || undefined}
          gap="5"
          className="min-w-0 flex-1 scroll-mt-header"
        >
          <ShopToolbar
            shop={shop}
            categoryName={category?.name}
            layout={layout}
            onLayoutChange={setLayout}
            onOpenFilters={() => setFiltersOpen(true)}
          />

          {shop.inStock && hiddenCount > 0 && (
            <Text tone="muted" className="text-fs-13">
              Hiding {pluralize(hiddenCount, "sold-out item")} on this page.
            </Text>
          )}

          <ProductListing
            products={products}
            layout={layout}
            isLoading={isLoading}
            isFetching={isFetching}
            isError={isError}
            errorMessage={error?.message}
            onRetry={() => void refetch()}
            skeleton={<ProductGridSkeleton count={SHOP_PAGE_SIZE} />}
            emptyState={emptyState}
          />

          {data && (
            <Pagination
              currentPage={data.meta.currentPage}
              totalPages={data.meta.pages}
              total={data.meta.total}
              limit={data.meta.limit}
              onPageChange={goToPage}
              itemLabel="products"
              className="border-t-2 border-dashed border-input pt-6"
            />
          )}
        </Stack>
      </Flex>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="bottom" className="gap-0 p-0">
          <SheetHeader className="border-b border-border">
            <SheetTitle>Filter &amp; sort</SheetTitle>
          </SheetHeader>
          <Stack gap="5" className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <Stack gap="3">
              <Text as="div" variant="eyebrow">
                Sort by
              </Text>
              <SortSelect id="shop-sort-mobile" shop={shop} />
            </Stack>
            <ShopFilters shop={shop} />
          </Stack>
          <SheetFooter>
            <Button size="xl" variant="cta" className="w-full" onClick={() => setFiltersOpen(false)}>
              {data ? `Show ${pluralize(data.meta.total, "product")}` : "Show products"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Container>
  );
}

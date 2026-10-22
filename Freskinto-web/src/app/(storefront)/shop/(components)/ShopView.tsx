"use client";

import { SearchX } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
import { ProductCard } from "@/components/customer/product/ProductCard";
import { ProductGridSkeleton } from "@/components/customer/product/ProductCardSkeleton";
import { ProductListItem } from "@/components/customer/product/ProductListItem";
import { findCategory, findParent } from "@/components/customer/shop/category-tree";
import { ShopFilters } from "@/components/customer/shop/ShopFilters";
import { aisleIndexOf, useAisles } from "@/components/customer/shop/use-aisles";
import { useShopParams } from "@/components/customer/shop/use-shop-params";
import { AisleTag } from "@/components/shared/AisleTag";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageBreadcrumbs, type Crumb } from "@/components/shared/PageBreadcrumbs";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { useHydrated } from "@/hooks/useHydrated";
import { pluralize } from "@/lib/format";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetProducts } from "@/services/products/queries";
import { ShopToolbar, SortSelect, type ShopLayout } from "./ShopToolbar";
import { SubcategoryChips } from "./SubcategoryChips";

const PAGE_SIZE = 24;
const GRID_CLASS = "grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4";

/** Server HTML aur pehla client render — page ke Suspense fallback mein bhi yahi */
export function ShopViewSkeleton() {
  return (
    <Container className={cn("flex flex-col gap-8 py-8 sm:py-10")}>
      <Stack gap="3">
        <Skeleton className={cn("h-4 w-28")} />
        <Skeleton className={cn("h-10 w-64")} />
        <Skeleton className={cn("h-4 w-48")} />
      </Stack>
      <Flex align="start" gap="8">
        <Skeleton className={cn("hidden h-96 w-72 shrink-0 rounded-2xl lg:block")} />
        <ProductGridSkeleton count={8} className={cn("min-w-0 flex-1", GRID_CLASS)} />
      </Flex>
    </Container>
  );
}

/** Shop: filters URL mein; categories ∥ products parallel load (FLOW-MD 08 §11, 11 §7) */
export function ShopView() {
  const shop = useShopParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [layout, setLayout] = useState<ShopLayout>("grid");
  const resultsRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetProducts({
    page: shop.page,
    limit: PAGE_SIZE,
    q: shop.q || undefined,
    categoryId: shop.category ?? undefined,
    minPrice: shop.min ?? undefined,
    maxPrice: shop.max ?? undefined,
    sortBy: shop.sort ?? undefined,
  });
  const { aisles } = useAisles();
  const hydrated = useHydrated();

  // Suspense ke andar — hydration tak server wala skeleton (footer ki categories cache mein aa chuki hoti hain)
  if (!hydrated) return <ShopViewSkeleton />;

  const category = findCategory(aisles, shop.category);
  const parent = findParent(aisles, shop.category);
  const aisleIndex = aisleIndexOf(aisles, shop.category);

  const title = shop.q
    ? category
      ? `“${shop.q}” in ${category.name}`
      : `Results for “${shop.q}”`
    : (category?.name ?? "All products");

  const crumbs: Crumb[] = [{ label: "Shop", href: shopUrl() }];
  if (parent) crumbs.push({ label: parent.name, href: shopUrl({ category: parent.id }) });
  if (category) crumbs.push({ label: category.name });

  const goToPage = (page: number) => {
    shop.update({ page });
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  let content: ReactNode;
  if (isLoading) {
    content = <ProductGridSkeleton count={8} className={cn(GRID_CLASS)} />;
  } else if (isError) {
    content = <ErrorState title="Couldn't load products" message={error.message} onRetry={() => void refetch()} />;
  } else if (!data?.data.length) {
    content = shop.hasFilters ? (
      <EmptyState
        icon={<SearchX aria-hidden="true" />}
        title="No products match your filters"
        message="Try a different search, widen the price range or browse another aisle."
        action={<Button onClick={shop.clear}>Clear all filters</Button>}
      />
    ) : (
      <EmptyState title="No products yet" message="New products will appear here soon." />
    );
  } else {
    content = (
      <Stack gap="8">
        {layout === "grid" ? (
          <Grid className={cn(GRID_CLASS, isFetching && "opacity-60 transition-opacity")}>
            {data.data.map((product, index) => (
              <ProductCard key={product.id} product={product} eager={index < 4} />
            ))}
          </Grid>
        ) : (
          <Stack gap="3" className={cn(isFetching && "opacity-60 transition-opacity")}>
            {data.data.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </Stack>
        )}
        <Pagination
          currentPage={data.meta.currentPage}
          totalPages={data.meta.pages}
          total={data.meta.total}
          limit={data.meta.limit}
          onPageChange={goToPage}
          itemLabel="products"
          className={cn("border-t border-dashed pt-6")}
        />
      </Stack>
    );
  }

  return (
    <Container className={cn("flex flex-col gap-8 py-8 sm:py-10")}>
      <Stack gap="4">
        <PageHeader
          breadcrumbs={<PageBreadcrumbs root={{ label: "Home", href: publicRoutes.home }} items={crumbs} />}
          eyebrow={aisleIndex !== undefined ? <AisleTag index={aisleIndex} label={parent?.name ?? category?.name} /> : "The whole market"}
          title={title}
          description={
            data ? (
              <Text as="span" aria-live="polite">
                {pluralize(data.meta.total, "product")} · Free delivery on every order
              </Text>
            ) : (
              <Skeleton className={cn("h-4 w-48")} />
            )
          }
        />
        <SubcategoryChips tree={aisles} selected={shop.category} onSelect={(id) => shop.update({ category: id })} />
      </Stack>

      <Flex align="start" gap="8">
        <Box as="aside" aria-label="Filters" className={cn("hidden w-72 shrink-0 lg:block")}>
          <Card className={cn("sticky top-28 py-2")}>
            <CardContent>
              <ShopFilters params={shop} update={shop.update} />
            </CardContent>
          </Card>
        </Box>

        <Stack
          as="section"
          ref={resultsRef}
          gap="5"
          aria-label="Products"
          aria-busy={isFetching || undefined}
          className={cn("min-w-0 flex-1 scroll-mt-32")}
        >
          <ShopToolbar
            shop={shop}
            categoryName={category?.name}
            layout={layout}
            onLayoutChange={setLayout}
            onOpenFilters={() => setFiltersOpen(true)}
          />
          {content}
        </Stack>
      </Flex>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="bottom" className={cn("max-h-5/6 gap-0 rounded-t-3xl p-0")}>
          <SheetHeader className={cn("border-b px-5 py-4")}>
            <SheetTitle>Filter &amp; sort</SheetTitle>
          </SheetHeader>
          <Stack gap="5" className={cn("overflow-y-auto px-5 py-5")}>
            <Stack gap="3">
              <Text variant="eyebrow" className={cn("text-foreground")}>
                Sort by
              </Text>
              <SortSelect id="shop-sort-mobile" shop={shop} />
            </Stack>
            <ShopFilters params={shop} update={shop.update} />
          </Stack>
          <SheetFooter className={cn("border-t px-5 py-4")}>
            <Button size="lg" className={cn("w-full")} onClick={() => setFiltersOpen(false)}>
              {data ? `Show ${pluralize(data.meta.total, "product")}` : "Show products"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Container>
  );
}

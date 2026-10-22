"use client";

import { SearchX } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ProductGridSkeleton } from "@/components/customer/product/ProductCardSkeleton";
import { ProductListing } from "@/components/customer/ProductListing";
import { findCategory, findParent } from "@/components/customer/shop/category-tree";
import { aisleIndexOf, useAisles } from "@/components/customer/shop/use-aisles";
import { AisleTag } from "@/components/shared/AisleTag";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageBreadcrumbs, type Crumb } from "@/components/shared/PageBreadcrumbs";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { SHOP_PAGE_SIZE } from "@/constants/filters";
import { useHydrated } from "@/hooks/useHydrated";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { pluralize } from "@/lib/utils";
import { useGetProducts } from "@/services/products/queries";
import { useShopStore } from "@/stores/shop-store";
import { CategoryPills } from "./CategoryPills";
import { ShopFilters } from "./ShopFilters";
import { ShopHero } from "./ShopHero";
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
  const resultsRef = useRef<HTMLElement>(null);

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

  const emptyState = shop.hasFilters ? (
    <EmptyState
      icon={<SearchX aria-hidden="true" />}
      title="No products match your filters"
      message="Try a different search, widen the price range or browse another aisle."
      action={<Button onClick={shop.clear}>Clear all filters</Button>}
    />
  ) : undefined;

  return (
    <div className="page-container flex flex-col gap-6 py-6 sm:py-8">
      {!shop.hasFilters && shop.page === 1 ? (
        <ShopHero />
      ) : (
        <PageHeader
          breadcrumbs={<PageBreadcrumbs root={{ label: "Home", href: publicRoutes.home }} items={crumbs} />}
          eyebrow={aisleIndex !== undefined ? <AisleTag index={aisleIndex} label={parent?.name ?? category?.name} /> : "The whole market"}
          title={title}
          description={
            data ? (
              <span aria-live="polite">{pluralize(data.meta.total, "product")} · Free delivery on every order</span>
            ) : undefined
          }
        />
      )}

      <CategoryPills aisles={aisles} selected={shop.category} onSelect={(next) => shop.update({ category: next })} />

      <div className="flex items-start gap-8">
        <aside aria-label="Filters" className="hidden w-72 shrink-0 rounded-15 border border-border bg-card p-5 shadow-soft lg:block">
          <ShopFilters shop={shop} />
        </aside>

        <section
          id="products"
          ref={resultsRef}
          aria-label="Products"
          aria-busy={isFetching || undefined}
          className="flex min-w-0 flex-1 scroll-mt-header flex-col gap-5"
        >
          <ShopToolbar
            shop={shop}
            categoryName={category?.name}
            layout={layout}
            onLayoutChange={setLayout}
            onOpenFilters={() => setFiltersOpen(true)}
          />

          {shop.inStock && hiddenCount > 0 && (
            <p className="text-fs-13 text-muted-foreground">
              Hiding {pluralize(hiddenCount, "sold-out item")} on this page.
            </p>
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
              className="border-t border-dashed border-input pt-6"
            />
          )}
        </section>
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="bottom" className="gap-0 p-0">
          <SheetHeader className="border-b border-border">
            <SheetTitle>Filter &amp; sort</SheetTitle>
          </SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-5">
            <div className="flex flex-col gap-3">
              <h3 className="text-fs-11 font-semibold tracking-widest text-foreground uppercase">Sort by</h3>
              <SortSelect id="shop-sort-mobile" shop={shop} />
            </div>
            <ShopFilters shop={shop} />
          </div>
          <SheetFooter>
            <Button size="lg" variant="cta" className="w-full" onClick={() => setFiltersOpen(false)}>
              {data ? `Show ${pluralize(data.meta.total, "product")}` : "Show products"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

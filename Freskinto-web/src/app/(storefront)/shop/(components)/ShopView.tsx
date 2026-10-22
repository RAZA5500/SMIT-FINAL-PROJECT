"use client";

import { SearchX, SlidersHorizontal } from "lucide-react";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { PageBreadcrumbs, type Crumb } from "@/components/customer/CustomerPage";
import { CATEGORY_LIST_LIMIT } from "@/components/customer/layout/CategoryBar";
import { ProductCard } from "@/components/customer/product/ProductCard";
import { ProductGridSkeleton } from "@/components/customer/product/ProductCardSkeleton";
import { ActiveFilters } from "@/components/customer/shop/ActiveFilters";
import { buildCategoryTree, findCategory, findParent } from "@/components/customer/shop/category-tree";
import { ShopFilters } from "@/components/customer/shop/ShopFilters";
import { useShopParams } from "@/components/customer/shop/use-shop-params";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { SelectField } from "@/components/shared/SelectField";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useHydrated } from "@/hooks/useHydrated";
import { pluralize } from "@/lib/format";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetCategories } from "@/services/categories/queries";
import { useGetProducts } from "@/services/products/queries";
import type { ProductSort } from "@/services/products/types";
import { SubcategoryChips } from "./SubcategoryChips";

const PAGE_SIZE = 24;
const GRID_CLASS = "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4";

/** Backend sirf yeh sorts support karta hai (api-reference Part 2); default newest */
const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "name_asc", label: "Name: A to Z" },
];

/** Server HTML aur pehla client render — page ke Suspense fallback mein bhi yahi */
export function ShopViewSkeleton() {
  return (
    <div className="container-page flex flex-col gap-6 py-6 sm:py-8">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex items-start gap-8">
        <Skeleton className="hidden h-96 w-64 shrink-0 rounded-2xl lg:block" />
        <ProductGridSkeleton count={8} className={cn("min-w-0 flex-1", GRID_CLASS)} />
      </div>
    </div>
  );
}

/** Shop: filters URL mein; categories ∥ products parallel load (FLOW-MD 08 §11, 11 §7) */
export function ShopView() {
  const shop = useShopParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
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
  const { data: categories } = useGetCategories({ limit: CATEGORY_LIST_LIMIT });
  const tree = useMemo(() => buildCategoryTree(categories?.data ?? []), [categories]);
  const hydrated = useHydrated();

  // Suspense ke andar — hydration tak server wala skeleton (footer ki categories cache mein aa chuki hoti hain)
  if (!hydrated) return <ShopViewSkeleton />;

  const category = findCategory(tree, shop.category);
  const parent = findParent(tree, shop.category);

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

  const sortSelect = (id: string) => (
    <SelectField
      id={id}
      aria-label="Sort products"
      options={SORT_OPTIONS}
      value={shop.sort ?? "newest"}
      onValueChange={(sort) => shop.update({ sort: sort === "newest" ? null : sort })}
      containerClassName="w-full sm:w-52"
    />
  );

  let content: ReactNode;
  if (isLoading) {
    content = <ProductGridSkeleton count={8} className={GRID_CLASS} />;
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
      <div className="flex flex-col gap-8">
        <div className={cn(GRID_CLASS, isFetching && "opacity-60 transition-opacity")}>
          {data.data.map((product, index) => (
            <ProductCard key={product.id} product={product} eager={index < 4} />
          ))}
        </div>
        <Pagination
          currentPage={data.meta.currentPage}
          totalPages={data.meta.pages}
          total={data.meta.total}
          limit={data.meta.limit}
          onPageChange={goToPage}
          itemLabel="products"
          className="border-t pt-6"
        />
      </div>
    );
  }

  return (
    <div className="container-page flex flex-col gap-6 py-6 sm:py-8">
      <div className="flex flex-col gap-3">
        <PageBreadcrumbs items={crumbs} />
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
          {data ? (
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {pluralize(data.meta.total, "product")} · Free delivery on every order
            </p>
          ) : (
            <Skeleton className="h-4 w-48" />
          )}
        </div>
        <SubcategoryChips tree={tree} selected={shop.category} onSelect={(id) => shop.update({ category: id })} />
      </div>

      <div className="flex items-start gap-8">
        <aside className="hidden w-64 shrink-0 lg:block" aria-label="Filters">
          <div className="sticky top-24 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border">
            <ShopFilters params={shop} update={shop.update} />
          </div>
        </aside>

        <section ref={resultsRef} aria-label="Products" aria-busy={isFetching || undefined} className="min-w-0 flex-1 scroll-mt-28">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Button variant="outline" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal aria-hidden="true" />
              Filters
            </Button>
            <div className="min-w-0 flex-1">
              <ActiveFilters params={shop} categoryName={category?.name} update={shop.update} clear={shop.clear} />
            </div>
            <div className="hidden sm:block">{sortSelect("shop-sort")}</div>
          </div>
          {content}
        </section>
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="bottom" className="max-h-5/6 gap-0 rounded-t-3xl p-0">
          <SheetHeader className="border-b px-5 py-4">
            <SheetTitle>Filter &amp; sort</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-5 overflow-y-auto px-5 py-5">
            <div className="flex flex-col gap-3">
              <h2 className="font-sans text-xs font-semibold tracking-widest text-muted-foreground uppercase">Sort by</h2>
              {sortSelect("shop-sort-mobile")}
            </div>
            <ShopFilters params={shop} update={shop.update} />
          </div>
          <SheetFooter className="border-t bg-card px-5 py-4">
            <Button size="lg" className="w-full" onClick={() => setFiltersOpen(false)}>
              {data ? `Show ${pluralize(data.meta.total, "product")}` : "Show products"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

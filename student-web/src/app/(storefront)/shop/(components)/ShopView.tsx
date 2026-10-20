"use client";

import { Funnel } from "lucide-react";
import { useState, type ReactNode } from "react";
import ProductCard from "@/components/customer/ProductCard";
import { ProductGridSkeleton } from "@/components/customer/ProductCardSkeleton";
import CartPanel from "@/components/customer/shop/CartPanel";
import ShopFilters, {
  PRICE_CEILING,
  PRICE_FLOOR,
  type ShopFilterState,
} from "@/components/customer/shop/ShopFilters";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useGetProducts } from "@/services/products/queries";

const PAGE_SIZE = 12;
const GRID_CLASS = "grid shop-product-grid gap-5";

const INITIAL_FILTERS: ShopFilterState = {
  categoryId: null,
  minPrice: PRICE_FLOOR,
  maxPrice: PRICE_CEILING,
  sort: null,
};

/** Shop: categories ∥ products parallel load; filter badle to page 1 (FLOW-MD 08 §11, 11 §7) */
export function ShopView() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<ShopFilterState>(INITIAL_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Typing aur slider drag har tabdeeli par request na bhejein
  const debouncedSearch = useDebounce(search.trim());
  const minPrice = useDebounce(filters.minPrice);
  const maxPrice = useDebounce(filters.maxPrice);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetProducts({
    page,
    limit: PAGE_SIZE,
    q: debouncedSearch || undefined,
    categoryId: filters.categoryId ?? undefined,
    minPrice: minPrice !== PRICE_FLOOR ? minPrice : undefined,
    maxPrice: maxPrice !== PRICE_CEILING ? maxPrice : undefined,
    sortBy: filters.sort ?? undefined,
  });

  const patchFilters = (next: Partial<ShopFilterState>) => {
    setFilters((prev) => ({ ...prev, ...next }));
    setPage(1);
  };

  const onSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  let content: ReactNode;
  if (isLoading) {
    content = <ProductGridSkeleton count={6} className={GRID_CLASS} />;
  } else if (isError) {
    content = (
      <ErrorState title="Couldn't load products" message={error.message} onRetry={() => void refetch()} />
    );
  } else if (!data?.data.length) {
    content = <EmptyState title="No products found" message="Try a different search or filter." />;
  } else {
    content = (
      <div className="flex flex-col gap-6">
        <div className={cn(GRID_CLASS, isFetching && "opacity-60 transition-opacity")}>
          {data.data.map((product) => (
            <ProductCard key={product.id} product={product} variant="shop" />
          ))}
        </div>
        <Pagination
          currentPage={data.meta.currentPage}
          totalPages={data.meta.pages}
          total={data.meta.total}
          limit={data.meta.limit}
          onPageChange={setPage}
          itemLabel="products"
        />
      </div>
    );
  }

  return (
    <div className="mt-23">
      <div className="flex min-h-[calc(100vh-5.75rem)] bg-white">
        <main className="min-w-0 flex-1">
          <div className="shop-container scrollbar-hide pt-5 pr-6 pb-10 pl-6 lg:pl-10">
            <div className="flex items-start gap-6">
              <aside className="hidden w-52 shrink-0 shop:block">
                <ShopFilters state={filters} onChange={patchFilters} />
              </aside>

              <div className="flex min-w-0 flex-1 flex-col gap-5">
                <div className="flex items-center gap-3">
                  <SearchInput
                    value={search}
                    onValueChange={onSearch}
                    placeholder="Search for products..."
                    className="flex-1"
                    inputClassName="h-12 rounded-10 border-gray-300 bg-gray-50 pl-10 text-xs text-neutral-gray md:text-sm"
                  />
                  <button
                    type="button"
                    className="inline-flex h-12 shrink-0 items-center gap-2 rounded-lg bg-brand-green px-4 font-inter text-fs-12 leading-none font-medium text-white shop:hidden"
                    onClick={() => setFiltersOpen(true)}
                  >
                    Filter
                    <Funnel className="size-4" aria-hidden="true" />
                  </button>
                </div>

                <section aria-label="Products" aria-busy={isFetching || undefined}>
                  {content}
                </section>
              </div>
            </div>
          </div>
        </main>

        <aside className="hidden w-100 shrink-0 flex-col pt-5 pr-6 lg:flex">
          <div className="sticky top-28 flex h-[calc(100vh-8.5rem)] flex-col overflow-hidden rounded-15 border border-gray-200 bg-white shadow-card">
            <CartPanel />
          </div>
        </aside>
      </div>

      {/* Chhoti screens par sidebar ki jagah filters dialog */}
      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          <ShopFilters state={filters} onChange={patchFilters} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

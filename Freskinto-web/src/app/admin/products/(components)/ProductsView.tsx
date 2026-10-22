"use client";

import { Package, Plus } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTableCard } from "@/components/admin/DataTableCard";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { adminRoutes } from "@/lib/routes/routes";
import { useGetAdminCategories } from "@/services/categories/queries";
import { useUpdateProduct } from "@/services/products/mutations";
import { useGetAdminProducts } from "@/services/products/queries";
import type { IAdminProduct, ProductSort } from "@/services/products/types";
import { ProductFilters } from "./ProductFilters";
import { ProductTable } from "./ProductTable";
import { ProductViewModal } from "./ProductViewModal";

const PAGE_SIZE = 10;
const ALL_CATEGORIES_LIMIT = 100;
const ALL = "ALL";

export function ProductsView() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<ProductSort>("newest");
  const [viewingProduct, setViewingProduct] = useState<IAdminProduct | null>(null);

  const debouncedSearch = useDebounce(search.trim());
  const { data, isLoading, isFetching, isError, error, refetch } = useGetAdminProducts({
    page,
    limit: PAGE_SIZE,
    q: debouncedSearch || undefined,
    categoryId: categoryId ?? undefined,
    isActive: isActive ?? undefined,
    sortBy,
  });
  const { data: categories } = useGetAdminCategories({ limit: ALL_CATEGORIES_LIMIT });
  const updateProduct = useUpdateProduct();

  const categoryOptions = useMemo(() => {
    const all = categories?.data ?? [];
    const nameById = new Map(all.map((category) => [category.id, category.name]));
    return [
      { value: ALL, label: "All categories" },
      ...all.map((category) => ({
        value: category.id,
        label: category.parentId ? `${nameById.get(category.parentId) ?? "…"} › ${category.name}` : category.name,
      })),
    ];
  }, [categories]);

  const onFilter =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(1);
    };

  const hasFilters = Boolean(debouncedSearch || categoryId || isActive !== null);
  const newProductLink = (
    <ButtonLink href={adminRoutes.productNew}>
      <Plus data-icon="inline-start" aria-hidden="true" />
      New product
    </ButtonLink>
  );

  let content: ReactNode;
  if (isLoading) {
    content = <TableSkeleton columns={6} />;
  } else if (isError) {
    content = <ErrorState title="Couldn't load products" message={error.message} onRetry={() => void refetch()} />;
  } else if (!data?.data.length) {
    content = (
      <EmptyState
        icon={<Package aria-hidden="true" />}
        title={hasFilters ? "No products match" : "No products yet"}
        message={hasFilters ? "Try a different search or aisle." : "Add your first product to start filling the shelves."}
        action={!hasFilters ? newProductLink : undefined}
      />
    );
  } else {
    content = (
      <ProductTable
        products={data.data}
        isUpdating={updateProduct.isPending}
        onToggleStatus={(product) =>
          updateProduct.mutate({ id: product.id, payload: { isActive: !product.isActive } })
        }
        onViewProduct={(product) => setViewingProduct(product)}
      />
    );
  }

  return (
    <AdminPage
      eyebrow="Catalogue"
      title="Products"
      description="Everything on the shelves. Prices and order limits are enforced at checkout."
      actions={newProductLink}
    >
      <DataTableCard
        busy={isFetching && !isLoading}
        toolbar={
          <ProductFilters
            search={search}
            onSearchChange={onFilter(setSearch)}
            categoryId={categoryId}
            onCategoryChange={onFilter(setCategoryId)}
            categoryOptions={categoryOptions}
            isActive={isActive}
            onStatusChange={onFilter(setIsActive)}
            sortBy={sortBy}
            onSortChange={onFilter(setSortBy)}
          />
        }
        footer={
          data && data.meta.total > 0 ? (
            <Pagination
              currentPage={data.meta.currentPage}
              totalPages={data.meta.pages}
              total={data.meta.total}
              limit={data.meta.limit}
              onPageChange={setPage}
              itemLabel="products"
            />
          ) : undefined
        }
      >
        {content}
      </DataTableCard>

      <ProductViewModal
        product={viewingProduct}
        open={viewingProduct !== null}
        onOpenChange={(open) => !open && setViewingProduct(null)}
      />
    </AdminPage>
  );
}

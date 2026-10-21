"use client";

import { ExternalLink, Eye, EyeOff, Package, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTableCard, ToolbarFilters } from "@/components/admin/DataTableCard";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { ProductImage } from "@/components/shared/ProductImage";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/hooks/useDebounce";
import { formatMoney } from "@/lib/format";
import { adminRoutes, publicRoutes } from "@/lib/routes/routes";
import { useGetAdminCategories } from "@/services/categories/queries";
import { useUpdateProduct } from "@/services/products/mutations";
import { useGetAdminProducts } from "@/services/products/queries";
import type { ProductSort } from "@/services/products/types";

const PAGE_SIZE = 10;
const ALL_CATEGORIES_LIMIT = 100;
const ALL = "ALL";

const STATUS_OPTIONS = [
  { value: ALL, label: "All statuses" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export function ProductsView() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<ProductSort>("newest");

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

  const onFilter = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const hasFilters = Boolean(debouncedSearch || categoryId || isActive !== null);
  const newProductLink = (
    <Link href={adminRoutes.productNew} className={buttonVariants()}>
      <Plus aria-hidden="true" />
      New product
    </Link>
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
        message={hasFilters ? "Try a different search or filter." : "Create your first product, then add stock from Inventory."}
        action={!hasFilters && newProductLink}
      />
    );
  } else {
    content = (
      <Table className="min-w-225">
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Order qty</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="max-w-72">
                <div className="flex items-center gap-3">
                  <ProductImage
                    name={product.name}
                    categoryName={product.category.name}
                    sizes="44px"
                    className="size-11 shrink-0 rounded-lg ring-1 ring-border"
                    imageClassName="p-1"
                  />
                  <div className="min-w-0">
                    <Link
                      href={adminRoutes.productEdit(product.id)}
                      className="block truncate font-semibold text-foreground hover:text-brand"
                    >
                      {product.name}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">{product.sku}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{product.category.name}</TableCell>
              <TableCell className="numeric text-right font-semibold">{formatMoney(product.price)}</TableCell>
              <TableCell className="numeric text-right text-muted-foreground">
                {product.minimumOrderQuantity}–{product.maximumOrderQuantity}
              </TableCell>
              <TableCell>
                {product.inventoryId ? (
                  <div className="flex items-center gap-2">
                    <span className="numeric w-8 font-semibold">{product.qtyOnHand}</span>
                    <StatusBadge status={product.stockStatus} />
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">No inventory yet</span>
                )}
              </TableCell>
              <TableCell>
                <StatusBadge status={product.isActive ? "ACTIVE" : "INACTIVE"} />
              </TableCell>
              <TableCell>
                <RowActionsMenu
                  label={product.name}
                  actions={[
                    { label: "Edit", icon: Pencil, onSelect: () => router.push(adminRoutes.productEdit(product.id)) },
                    ...(product.isActive
                      ? [{ label: "View in shop", icon: ExternalLink, onSelect: () => router.push(publicRoutes.product(product.id)) }]
                      : []),
                    {
                      label: product.isActive ? "Deactivate" : "Activate",
                      icon: product.isActive ? EyeOff : Eye,
                      disabled: updateProduct.isPending,
                      onSelect: () => updateProduct.mutate({ id: product.id, payload: { isActive: !product.isActive } }),
                    },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <AdminPage
      title="Products"
      description="Everything on the shelves. Prices and order limits are enforced at checkout."
      actions={newProductLink}
    >
      <DataTableCard
        busy={isFetching && !isLoading}
        toolbar={
          <>
            <SearchInput
              value={search}
              onValueChange={onFilter(setSearch)}
              placeholder="Search by name or SKU…"
              className="w-full md:max-w-xs"
            />
            <ToolbarFilters>
              <SelectField
                id="product-category-filter"
                aria-label="Filter by category"
                size="sm"
                options={categoryOptions}
                value={categoryId ?? ALL}
                onValueChange={(value) => onFilter(setCategoryId)(!value || value === ALL ? null : value)}
                containerClassName="w-48"
              />
              <SelectField
                id="product-status-filter"
                aria-label="Filter by status"
                size="sm"
                options={STATUS_OPTIONS}
                value={isActive === null ? ALL : String(isActive)}
                onValueChange={(value) => onFilter(setIsActive)(!value || value === ALL ? null : value === "true")}
                containerClassName="w-36"
              />
              <SelectField
                id="product-sort"
                aria-label="Sort products"
                size="sm"
                options={SORT_OPTIONS}
                value={sortBy}
                onValueChange={(value) => onFilter(setSortBy)(value ?? "newest")}
                containerClassName="w-44"
              />
            </ToolbarFilters>
          </>
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
    </AdminPage>
  );
}

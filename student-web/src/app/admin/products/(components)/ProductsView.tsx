"use client";

import { Eye, EyeOff, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import AdminListPage, {
  ADMIN_FILTER_FIELD_CLASS,
  ADMIN_SEARCH_FIELD_CLASS,
  FilterIcon,
  PrimaryAction,
  TD_CLASS,
  TH_CENTER_CLASS,
  TH_CLASS,
  TR_STATIC_CLASS,
} from "@/components/admin/AdminListPage";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/hooks/useDebounce";
import { formatMoney } from "@/lib/format";
import { adminRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
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
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
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

  const toolbar = (
    <>
      <SearchInput
        value={search}
        onValueChange={onFilter(setSearch)}
        placeholder="Search by product name or SKU..."
        className="max-w-search"
        inputClassName={ADMIN_SEARCH_FIELD_CLASS}
      />
      <div className="ml-auto flex shrink-0 flex-wrap items-center gap-3">
        <FilterIcon />
        <SelectField
          id="product-category-filter"
          options={categoryOptions}
          value={categoryId ?? ALL}
          onValueChange={(value) => onFilter(setCategoryId)(!value || value === ALL ? null : value)}
          className={ADMIN_FILTER_FIELD_CLASS}
        />
        <SelectField
          id="product-status-filter"
          options={STATUS_OPTIONS}
          value={isActive === null ? ALL : String(isActive)}
          onValueChange={(value) => onFilter(setIsActive)(!value || value === ALL ? null : value === "true")}
          className={ADMIN_FILTER_FIELD_CLASS}
        />
        <SelectField
          id="product-sort"
          options={SORT_OPTIONS}
          value={sortBy}
          onValueChange={(value) => onFilter(setSortBy)(value ?? "newest")}
          className={ADMIN_FILTER_FIELD_CLASS}
        />
        <PrimaryAction label="Create Product" href={adminRoutes.productNew} />
      </div>
    </>
  );

  let content: ReactNode;
  if (isLoading) {
    content = <TableSkeleton columns={7} />;
  } else if (isError) {
    content = <ErrorState title="Couldn't load products" message={error.message} onRetry={() => void refetch()} />;
  } else if (!data?.data.length) {
    content = (
      <EmptyState
        title="No products found"
        message={debouncedSearch || categoryId || isActive !== null ? "Try different filters." : "Create your first product."}
      />
    );
  } else {
    content = (
      <Table className={cn("min-w-225", isFetching && "opacity-60 transition-opacity")}>
        <TableHeader>
          <TableRow className="border-gray-200">
            <TableHead className={TH_CLASS}>Product</TableHead>
            <TableHead className={TH_CLASS}>Category</TableHead>
            <TableHead className={TH_CLASS}>Price</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Order qty</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Stock</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Status</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((product) => (
            <TableRow key={product.id} className={TR_STATIC_CLASS}>
              <TableCell className={cn(TD_CLASS, "max-w-56")}>
                <p className="truncate text-base font-semibold text-body-text">{product.name}</p>
                <p className="truncate text-sm font-light text-gray-500">SKU: {product.sku}</p>
              </TableCell>
              <TableCell className={cn(TD_CLASS, "text-gray-500")}>{product.category.name}</TableCell>
              <TableCell className={cn(TD_CLASS, "font-semibold text-body-text")}>
                {formatMoney(product.price)}
              </TableCell>
              <TableCell className={cn(TD_CLASS, "text-center")}>
                {product.minimumOrderQuantity}–{product.maximumOrderQuantity}
              </TableCell>
              <TableCell className={cn(TD_CLASS, "text-center")}>
                {product.inventoryId ? (
                  <span className="inline-flex flex-col items-center gap-1">
                    <span className="font-medium text-gray-900">{product.qtyOnHand}</span>
                    <StatusBadge status={product.stockStatus} />
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">No inventory</span>
                )}
              </TableCell>
              <TableCell className={cn(TD_CLASS, "text-center")}>
                <StatusBadge status={product.isActive ? "ACTIVE" : "INACTIVE"} />
              </TableCell>
              <TableCell className={TD_CLASS}>
                <RowActionsMenu
                  label={product.name}
                  actions={[
                    { label: "Edit", icon: Pencil, onSelect: () => router.push(adminRoutes.productEdit(product.id)) },
                    {
                      label: product.isActive ? "Deactivate" : "Activate",
                      icon: product.isActive ? EyeOff : Eye,
                      disabled: updateProduct.isPending,
                      onSelect: () =>
                        updateProduct.mutate({ id: product.id, payload: { isActive: !product.isActive } }),
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
    <AdminListPage
      toolbar={toolbar}
      responsiveToolbar
      total={data?.meta.total ?? 0}
      page={data?.meta.currentPage ?? page}
      pageSize={data?.meta.limit ?? PAGE_SIZE}
      onPageChange={setPage}
      noun="products"
    >
      {content}
    </AdminListPage>
  );
}

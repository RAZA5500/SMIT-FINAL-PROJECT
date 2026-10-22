"use client";

import { ExternalLink, Eye, EyeOff, Package, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { Flex, Stack } from "@/components/ui/flex";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Text } from "@/components/ui/typography";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTableCard, ToolbarFilters } from "@/components/admin/DataTableCard";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { ProductImage } from "@/components/shared/ProductImage";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { TextLink } from "@/components/shared/TextLink";
import { useDebounce } from "@/hooks/useDebounce";
import { formatMoney } from "@/lib/format";
import { adminRoutes, publicRoutes } from "@/lib/routes/routes";
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
        message={hasFilters ? "Try a different search or filter." : "Create your first product, then add stock from Stock levels."}
        action={!hasFilters && newProductLink}
      />
    );
  } else {
    content = (
      <Table className={cn("min-w-225")}>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className={cn("text-right")}>Price</TableHead>
            <TableHead className={cn("text-right")}>Order qty</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className={cn("w-12")}>
              <Text as="span" className={cn("sr-only")}>
                Actions
              </Text>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell className={cn("max-w-72")}>
                <Flex align="center" gap="3">
                  <ProductImage
                    name={product.name}
                    categoryName={product.category.name}
                    sizes="44px"
                    className={cn("size-11 shrink-0 rounded-lg border")}
                    imageClassName={cn("p-1")}
                  />
                  <Stack gap="0.5" className={cn("min-w-0")}>
                    <TextLink href={adminRoutes.productEdit(product.id)} tone="default" className={cn("truncate font-semibold")}>
                      {product.name}
                    </TextLink>
                    <Text variant="code" tone="muted" className={cn("truncate")}>
                      {product.sku}
                    </Text>
                  </Stack>
                </Flex>
              </TableCell>
              <TableCell className={cn("text-muted-foreground")}>{product.category.name}</TableCell>
              <TableCell className={cn("text-right font-semibold tabular-nums")}>{formatMoney(product.price)}</TableCell>
              <TableCell className={cn("text-right text-muted-foreground tabular-nums")}>
                {product.minimumOrderQuantity}–{product.maximumOrderQuantity}
              </TableCell>
              <TableCell>
                {product.inventoryId ? (
                  <Flex align="center" gap="2">
                    <Text as="span" weight="semibold" numeric className={cn("w-8")}>
                      {product.qtyOnHand}
                    </Text>
                    <StatusBadge status={product.stockStatus} />
                  </Flex>
                ) : (
                  <Text as="span" variant="small" tone="muted">
                    No inventory yet
                  </Text>
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
      eyebrow="Catalogue"
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
              className={cn("w-full md:max-w-xs")}
            />
            <ToolbarFilters>
              <SelectField
                id="product-category-filter"
                aria-label="Filter by category"
                size="sm"
                options={categoryOptions}
                value={categoryId ?? ALL}
                onValueChange={(value) => onFilter(setCategoryId)(!value || value === ALL ? null : value)}
                containerClassName={cn("w-48")}
              />
              <SelectField
                id="product-status-filter"
                aria-label="Filter by status"
                size="sm"
                options={STATUS_OPTIONS}
                value={isActive === null ? ALL : String(isActive)}
                onValueChange={(value) => onFilter(setIsActive)(!value || value === ALL ? null : value === "true")}
                containerClassName={cn("w-36")}
              />
              <SelectField
                id="product-sort"
                aria-label="Sort products"
                size="sm"
                options={SORT_OPTIONS}
                value={sortBy}
                onValueChange={(value) => onFilter(setSortBy)(value ?? "newest")}
                containerClassName={cn("w-44")}
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

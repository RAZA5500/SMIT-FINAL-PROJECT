"use client";

import { useMemo } from "react";
import { pluralize } from "@/lib/format";
import { categoryTheme, TONE_CLASSES } from "@/lib/merchandising";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetCategories } from "@/services/categories/queries";
import { useGetProducts } from "@/services/products/queries";
import { CATEGORY_LIST_LIMIT } from "../layout/CategoryBar";
import { ProductRail } from "../product/ProductRail";
import { buildCategoryTree, totalProducts, type CategoryNode } from "../shop/category-tree";

const FEATURED_AISLES = 2;
const RAIL_LIMIT = 10;

/** Sab se bari do aisles ki shelves (backend productCount se andaza; khali shelf chhupti hai) */
export function CategoryRails() {
  const { data } = useGetCategories({ limit: CATEGORY_LIST_LIMIT });
  const featured = useMemo(
    () =>
      buildCategoryTree(data?.data ?? [])
        .filter((root) => totalProducts(root) > 0)
        .sort((a, b) => totalProducts(b) - totalProducts(a))
        .slice(0, FEATURED_AISLES),
    [data],
  );

  return featured.map((category) => <CategoryRail key={category.id} category={category} />);
}

function CategoryRail({ category }: { category: CategoryNode }) {
  // Top-level categoryId par backend children ke products bhi deta hai
  const { data, isLoading, isError, error, refetch } = useGetProducts({ categoryId: category.id, limit: RAIL_LIMIT });
  const theme = categoryTheme(category.name);
  const Icon = theme.icon;

  // Sirf hidden products wali aisle — khali shelf mat dikhao
  if (data && data.meta.total === 0) return null;
  const total = data?.meta.total;

  return (
    <div className="container-page">
      <ProductRail
        title={category.name}
        eyebrow={
          <span
            className={cn(
              "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
              TONE_CLASSES[theme.tone].chip,
            )}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            Shop the aisle
          </span>
        }
        description={total === undefined ? undefined : `${pluralize(total, "product")} in this aisle`}
        href={shopUrl({ category: category.id })}
        products={data?.data}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
        onRetry={() => void refetch()}
      />
    </div>
  );
}

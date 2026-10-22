"use client";

import { useMemo } from "react";
import { useGetCategories } from "@/services/categories/queries";
import { buildCategoryTree, type CategoryNode } from "./category-tree";

/** Header, shop sidebar, home aur footer — sab yahi query (same key) → ek hi request, sab jagah cache */
export const CATEGORY_LIST_LIMIT = 100;

/** Public categories ka 2-level tree ("aisles"), naam se sorted */
export function useAisles() {
  const query = useGetCategories({ limit: CATEGORY_LIST_LIMIT });
  const aisles = useMemo(() => buildCategoryTree(query.data?.data ?? []), [query.data]);
  return { ...query, aisles };
}

/** Top-level aisle ka index (child di ho to us ke parent ka) — aisle number ke liye */
export function aisleIndexOf(aisles: CategoryNode[], categoryId: string | null | undefined): number | undefined {
  if (!categoryId) return undefined;
  const index = aisles.findIndex(
    (aisle) => aisle.id === categoryId || aisle.children.some((child) => child.id === categoryId),
  );
  return index >= 0 ? index : undefined;
}

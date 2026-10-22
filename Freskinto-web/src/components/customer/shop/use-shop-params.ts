"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { shopUrl } from "@/lib/routes/routes";
import { PRODUCT_SORTS, type ProductSort } from "@/services/products/types";

export interface ShopParams {
  q: string;
  category: string | null;
  sort: ProductSort | null;
  min: number | null;
  max: number | null;
  page: number;
}

function toNumber(raw: string | null): number | null {
  if (raw === null || raw.trim() === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

/** URL → saaf state: sort whitelist, page ≥ 1, min > max kabhi nahi (backend 400) */
export function parseShopParams(params: URLSearchParams): ShopParams {
  const sort = params.get("sort");
  const page = Math.floor(Number(params.get("page")));
  let min = toNumber(params.get("min"));
  let max = toNumber(params.get("max"));
  if (min !== null && max !== null && min > max) [min, max] = [max, min];
  return {
    q: params.get("q")?.trim() ?? "",
    category: params.get("category") || null,
    sort: PRODUCT_SORTS.includes(sort as ProductSort) ? (sort as ProductSort) : null,
    min,
    max,
    page: Number.isFinite(page) && page > 1 ? page : 1,
  };
}

/**
 * Shop filters URL mein rehte hain (shareable, back button) — har filter tabdeeli
 * par page 1 (FLOW-MD 08 §11). Slider/typing jaisi tez tabdeeliyan `replace`.
 */
export function useShopParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const state = useMemo(() => parseShopParams(new URLSearchParams(searchParams.toString())), [searchParams]);

  const update = useCallback(
    (patch: Partial<ShopParams>, { replace = false }: { replace?: boolean } = {}) => {
      const next: ShopParams = { ...state, page: 1, ...patch };
      const url = shopUrl({
        q: next.q || undefined,
        category: next.category ?? undefined,
        sort: next.sort ?? undefined,
        min: next.min ?? undefined,
        max: next.max ?? undefined,
        page: next.page > 1 ? next.page : undefined,
      });
      if (replace) router.replace(url, { scroll: false });
      else router.push(url, { scroll: false });
    },
    [state, router],
  );

  const clear = useCallback(() => router.push(shopUrl(), { scroll: false }), [router]);

  const hasFilters = Boolean(state.q || state.category || state.min !== null || state.max !== null);

  return { ...state, hasFilters, update, clear };
}

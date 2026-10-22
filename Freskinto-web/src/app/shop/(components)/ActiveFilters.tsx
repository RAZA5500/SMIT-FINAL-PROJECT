"use client";

import { X } from "lucide-react";
import { formatMoney } from "@/lib/utils";
import type { ShopParamsApi } from "./useShopParams";

function priceLabel(min: number | null, max: number | null): string | null {
  if (min !== null && max !== null) return `${formatMoney(min)} – ${formatMoney(max)}`;
  if (min !== null) return `From ${formatMoney(min)}`;
  if (max !== null) return `Up to ${formatMoney(max)}`;
  return null;
}

/** Lage hue filters — har ek alag se hatane ka button */
export function ActiveFilters({ shop, categoryName }: { shop: ShopParamsApi; categoryName?: string }) {
  const price = priceLabel(shop.min, shop.max);
  const chips = [
    shop.q && { key: "q", label: `“${shop.q}”`, remove: () => shop.update({ q: "" }) },
    shop.category && { key: "category", label: categoryName ?? "Aisle", remove: () => shop.update({ category: null }) },
    price && { key: "price", label: price, remove: () => shop.update({ min: null, max: null }) },
    shop.inStock && { key: "stock", label: "In stock only", remove: () => shop.update({ inStock: false }) },
  ].filter(Boolean) as { key: string; label: string; remove: () => void }[];

  if (chips.length === 0) return null;

  return (
    <div aria-label="Active filters" role="group" className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.remove}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card pr-2 pl-3 text-fs-13 font-medium transition-colors outline-none hover:border-foreground/30 focus-visible:ring-3 focus-visible:ring-ring/35"
        >
          {chip.label}
          <span className="sr-only">— remove filter</span>
          <X aria-hidden="true" className="size-3.5 text-muted-foreground" />
        </button>
      ))}
      <button
        type="button"
        onClick={shop.clear}
        className="rounded-md px-1.5 text-fs-13 font-medium text-brand-green underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/35"
      >
        Clear all
      </button>
    </div>
  );
}

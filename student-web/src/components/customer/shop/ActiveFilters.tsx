"use client";

import { X } from "lucide-react";
import { formatMoney } from "@/lib/format";
import type { ShopParams } from "./use-shop-params";

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 rounded-full bg-card py-1.5 pr-2 pl-3 text-xs font-medium ring-1 ring-border transition-colors hover:bg-muted"
    >
      {label}
      <span className="sr-only">— remove filter</span>
      <X className="size-3.5 text-muted-foreground" aria-hidden="true" />
    </button>
  );
}

function priceLabel(min: number | null, max: number | null): string | null {
  if (min !== null && max !== null) return `${formatMoney(min)} – ${formatMoney(max)}`;
  if (min !== null) return `From ${formatMoney(min)}`;
  if (max !== null) return `Up to ${formatMoney(max)}`;
  return null;
}

interface ActiveFiltersProps {
  params: ShopParams;
  categoryName?: string;
  update: (patch: Partial<ShopParams>) => void;
  clear: () => void;
}

export function ActiveFilters({ params, categoryName, update, clear }: ActiveFiltersProps) {
  const price = priceLabel(params.min, params.max);
  const chips = [
    params.q && { key: "q", label: `“${params.q}”`, remove: () => update({ q: "" }) },
    params.category && { key: "category", label: categoryName ?? "Category", remove: () => update({ category: null }) },
    price && { key: "price", label: price, remove: () => update({ min: null, max: null }) },
  ].filter(Boolean) as { key: string; label: string; remove: () => void }[];

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <Chip key={chip.key} label={chip.label} onRemove={chip.remove} />
      ))}
      <button type="button" onClick={clear} className="px-1.5 text-xs font-semibold text-brand hover:underline">
        Clear all
      </button>
    </div>
  );
}

"use client";

import { ChevronDown, ChevronRight, Funnel } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetCategories } from "@/services/categories/queries";
import type { ProductSort } from "@/services/products/types";
import { buildCategoryTree, findCategoryName, type CategoryNode } from "./category-tree";

/** Backend sirf yeh sorts support karta hai (api-reference Part 2) */
export const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "newest", label: "Newest First" },
];

/** Shop sidebar ki saari categories ek request mein (backend max limit) */
const CATEGORY_LIST_LIMIT = 100;

function FilterCard({
  title,
  summary,
  open,
  onToggle,
  children,
}: {
  title: string;
  summary?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center justify-between gap-2 px-4 py-3 transition-[padding] duration-300 ease-out",
          open && "border-b border-gray-100",
        )}
      >
        <span className="flex min-w-0 flex-col items-start text-left">
          <span className="text-sm leading-tight font-semibold text-gray-800">{title}</span>
          <span
            className={cn(
              "grid w-full transition-[grid-template-rows] duration-300 ease-out",
              summary ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <span className="overflow-hidden">
              <span className="mt-1.5 block max-w-full truncate text-xs leading-tight font-medium text-brand-green">
                {summary}
              </span>
            </span>
          </span>
        </span>
        <span className="flex shrink-0 items-center">
          <span
            className={cn(
              "h-1.5 rounded-full bg-brand-green transition-all duration-300 ease-out",
              summary ? "mr-2 w-1.5 opacity-100" : "mr-0 w-0 opacity-0",
            )}
          />
          <ChevronDown
            className={cn(
              "size-4 text-brand-green transition-transform duration-300 ease-out",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </span>
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function CategoryRow({
  node,
  depth,
  selected,
  onSelect,
}: {
  node: CategoryNode;
  depth: number;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children.length > 0;
  const active = selected === node.id;

  return (
    <div>
      <div
        className={cn(
          "flex items-center border-l-2 transition-colors hover:bg-gray-50",
          active ? "border-brand-green bg-gray-50" : "border-transparent",
        )}
      >
        <button
          type="button"
          aria-pressed={active}
          onClick={() => onSelect(node.id)}
          className={cn(
            "min-w-0 flex-1 truncate py-2.5 pr-2 text-left text-sm",
            depth === 0 ? "pl-4" : "pl-8",
            active ? "font-medium text-brand-green" : "text-gray-800",
          )}
        >
          {node.name}
        </button>
        {hasChildren && (
          <button
            type="button"
            aria-label={open ? `Collapse ${node.name}` : `Expand ${node.name}`}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-8 shrink-0 items-center justify-center text-gray-400 transition-colors hover:text-gray-700"
          >
            <ChevronRight
              className={cn("size-4 transition-transform duration-300 ease-out", open && "rotate-90")}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
      {hasChildren && (
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-out",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            {node.children.map((child) => (
              <CategoryRow key={child.id} node={child} depth={depth + 1} selected={selected} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryList({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const { data, isLoading, isError, refetch } = useGetCategories({ limit: CATEGORY_LIST_LIMIT });
  const tree = useMemo(() => buildCategoryTree(data?.data ?? []), [data]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-4" aria-label="Loading categories" aria-busy="true">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-4 w-3/4" />
        ))}
      </div>
    );
  }
  if (isError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-2 p-4 text-sm text-gray-500">
        Couldn&apos;t load categories.
        <button type="button" className="font-medium text-brand-green hover:underline" onClick={() => void refetch()}>
          Try again
        </button>
      </div>
    );
  }
  if (tree.length === 0) {
    return <p className="p-4 text-sm text-gray-500">No categories yet.</p>;
  }
  return (
    <div>
      {tree.map((node, i) => (
        <React.Fragment key={node.id}>
          <CategoryRow node={node} depth={0} selected={selected} onSelect={onSelect} />
          {i < tree.length - 1 && <div className="border-t border-gray-100" />}
        </React.Fragment>
      ))}
    </div>
  );
}

const PRICE_INPUT_CLASS =
  "h-8 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 md:text-xs/relaxed";

export interface ShopFilterState {
  categoryId: string | null;
  minPrice: number;
  maxPrice: number;
  sort: ProductSort | null;
}

export const PRICE_FLOOR = 0;
export const PRICE_CEILING = 1500;

const THUMB_CLASS =
  "absolute block size-(--thumb-size) shrink-0 -translate-x-1/2 rounded-full border-2 border-brand-green bg-white transition-[color,box-shadow] select-none after:absolute after:-inset-2";

const RANGE_INPUT_CLASS =
  "pointer-events-none absolute inset-x-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-(--thumb-size) [&::-webkit-slider-thumb]:w-(--thumb-size) [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:opacity-0";

/** Two-handle range control; the handles sit on a shared track like production. */
function PriceSlider({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}) {
  const pct = (v: number) => ((v - PRICE_FLOOR) / (PRICE_CEILING - PRICE_FLOOR)) * 100;

  return (
    <div data-slot="slider" className="mb-3">
      <div className="relative flex h-(--thumb-size) w-full items-center">
        <div className="absolute inset-x-0 h-1 rounded-full bg-track-bg" />
        <div
          className="absolute h-1 rounded-full bg-brand-green select-none"
          style={{ left: `${pct(min)}%`, right: `${100 - pct(max)}%` }}
        />
        <div className={THUMB_CLASS} style={{ left: `${pct(min)}%` }} />
        <div className={THUMB_CLASS} style={{ left: `${pct(max)}%` }} />
        <input
          type="range"
          aria-label="Minimum price"
          min={PRICE_FLOOR}
          max={PRICE_CEILING}
          value={min}
          onChange={(e) => onChange(Math.min(Number(e.target.value), max), max)}
          className={RANGE_INPUT_CLASS}
        />
        <input
          type="range"
          aria-label="Maximum price"
          min={PRICE_FLOOR}
          max={PRICE_CEILING}
          value={max}
          onChange={(e) => onChange(min, Math.max(Number(e.target.value), min))}
          className={RANGE_INPUT_CLASS}
        />
      </div>
    </div>
  );
}

/** Number input: khali/ghalat value floor/ceiling par clamp — min > max kabhi nahi (backend 400) */
function clampPrice(raw: string, fallback: number): number {
  const value = Number(raw);
  if (raw.trim() === "" || !Number.isFinite(value)) return fallback;
  return Math.min(PRICE_CEILING, Math.max(PRICE_FLOOR, value));
}

export default function ShopFilters({
  state,
  onChange,
}: {
  state: ShopFilterState;
  onChange: (next: Partial<ShopFilterState>) => void;
}) {
  const [closedCards, setClosedCards] = useState<Record<string, boolean>>({});
  const isOpen = (name: string) => !closedCards[name];
  const toggle = (name: string) => setClosedCards((cur) => ({ ...cur, [name]: !cur[name] }));

  const { data: categories } = useGetCategories({ limit: CATEGORY_LIST_LIMIT });
  const categorySummary = useMemo(
    () => findCategoryName(buildCategoryTree(categories?.data ?? []), state.categoryId),
    [categories, state.categoryId],
  );

  const priceSummary =
    state.minPrice !== PRICE_FLOOR || state.maxPrice !== PRICE_CEILING
      ? `£${state.minPrice} – £${state.maxPrice}`
      : undefined;
  const sortSummary = SORT_OPTIONS.find((o) => o.value === state.sort)?.label;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between rounded-xl bg-brand-green px-4 py-3">
          <span className="text-sm font-semibold text-white">Filters</span>
          <div className="rounded-md bg-brand-green-dark p-1.5">
            <Funnel className="size-4 text-white" aria-hidden="true" />
          </div>
        </div>
      </div>

      <FilterCard
        title="Categories"
        summary={categorySummary}
        open={isOpen("Categories")}
        onToggle={() => toggle("Categories")}
      >
        <CategoryList
          selected={state.categoryId}
          onSelect={(id) => onChange({ categoryId: state.categoryId === id ? null : id })}
        />
      </FilterCard>

      <FilterCard title="Price" summary={priceSummary} open={isOpen("Price")} onToggle={() => toggle("Price")}>
        <div className="p-4">
          <PriceSlider
            min={state.minPrice}
            max={state.maxPrice}
            onChange={(minPrice, maxPrice) => onChange({ minPrice, maxPrice })}
          />
          <div className="mb-3 flex items-center justify-between text-xs text-gray-600">
            <span>
              £{state.minPrice} – £{state.maxPrice}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              aria-label="Minimum price"
              className={PRICE_INPUT_CLASS}
              value={state.minPrice}
              min={PRICE_FLOOR}
              max={PRICE_CEILING}
              onChange={(e) => {
                const minPrice = clampPrice(e.target.value, PRICE_FLOOR);
                onChange({ minPrice, maxPrice: Math.max(minPrice, state.maxPrice) });
              }}
            />
            <input
              type="number"
              aria-label="Maximum price"
              className={PRICE_INPUT_CLASS}
              value={state.maxPrice}
              min={PRICE_FLOOR}
              max={PRICE_CEILING}
              onChange={(e) => {
                const maxPrice = clampPrice(e.target.value, PRICE_CEILING);
                onChange({ maxPrice, minPrice: Math.min(state.minPrice, maxPrice) });
              }}
            />
          </div>
        </div>
      </FilterCard>

      <FilterCard title="Sort By" summary={sortSummary} open={isOpen("Sort By")} onToggle={() => toggle("Sort By")}>
        <div className="flex flex-col py-2">
          {SORT_OPTIONS.map((o) => (
            <label
              key={o.value}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 transition-colors hover:bg-gray-50"
            >
              <input
                type="radio"
                name="sort"
                className="size-3.5 shrink-0 accent-brand-green"
                checked={state.sort === o.value}
                onChange={() => onChange({ sort: o.value })}
              />
              <span className="text-sm text-gray-700">{o.label}</span>
            </label>
          ))}
        </div>
      </FilterCard>
    </div>
  );
}

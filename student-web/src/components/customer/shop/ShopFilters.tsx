"use client";

import React, { useState } from "react";
import { CATEGORY_TREE, CategoryNode } from "@/data/products";

export const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "newest", label: "Newest First" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"] | null;

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-chevron-down text-brand-green transition-transform duration-300 ease-out ${
        open ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronRight({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-chevron-right transition-transform duration-300 ease-out ${
        open ? "rotate-90" : ""
      }`}
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

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
        className={`flex w-full items-center justify-between gap-2 px-4 py-3 transition-[padding] duration-300 ease-out ${
          open ? "border-b border-gray-100" : ""
        }`}
      >
        <span className="flex min-w-0 flex-col items-start text-left">
          <span className="text-sm font-semibold text-gray-800 leading-tight">{title}</span>
          <span
            className={`grid w-full transition-[grid-template-rows] duration-300 ease-out ${
              summary ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <span className="overflow-hidden">
              <span className="mt-1.5 block max-w-full truncate text-xs font-medium text-brand-green leading-tight">
                {summary}
              </span>
            </span>
          </span>
        </span>
        <span className="flex shrink-0 items-center">
          <span
            className={`h-1.5 rounded-full bg-brand-green transition-all duration-300 ease-out ${
              summary ? "mr-2 w-1.5 opacity-100" : "mr-0 w-0 opacity-0"
            }`}
          />
          <ChevronDown open={open} />
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
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
  onSelect: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!node.children?.length;
  const pad = depth === 0 ? "pl-4" : depth === 1 ? "pl-8" : "pl-12";
  const active = selected === node.name;

  return (
    <div>
      <div
        className={`flex items-center border-l-2 transition-colors hover:bg-gray-50 ${
          active ? "border-brand-green bg-gray-50" : "border-transparent"
        }`}
      >
        <button
          type="button"
          onClick={() => onSelect(node.name)}
          className={`flex-1 min-w-0 truncate py-2.5 pr-2 text-left text-sm ${pad} ${
            active ? "text-brand-green font-medium" : "text-gray-800"
          }`}
        >
          {node.name}
        </button>
        {hasChildren && (
          <button
            type="button"
            aria-label={open ? `Collapse ${node.name}` : `Expand ${node.name}`}
            onClick={() => setOpen((v) => !v)}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-gray-400 transition-colors hover:text-gray-700"
          >
            <ChevronRight open={open} />
          </button>
        )}
      </div>
      {hasChildren && (
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div>
              {node.children!.map((child) => (
                <CategoryRow
                  key={child.name}
                  node={child}
                  depth={depth + 1}
                  selected={selected}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const PRICE_INPUT_CLASS =
  "w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs/relaxed file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xs/relaxed dark:bg-input/30 h-8 text-xs";

export interface ShopFilterState {
  category: string | null;
  minPrice: number;
  maxPrice: number;
  sort: SortValue;
}

export const PRICE_FLOOR = 0;
export const PRICE_CEILING = 1500;

const THUMB_CLASS =
  "block after:absolute relative after:-inset-2 bg-white disabled:opacity-50 border-2 border-brand-green rounded-full focus-visible:outline-hidden hover:ring-2 focus-visible:ring-2 active:ring-2 transition-[color,box-shadow] disabled:pointer-events-none select-none w-(--thumb-size) h-(--thumb-size) shrink-0";

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
    <div data-slot="slider" className="data-horizontal:w-full data-vertical:h-full mb-3">
      <div className="relative flex w-full items-center h-(--thumb-size)">
        <div data-slot="slider-track" className="absolute inset-x-0 h-1 rounded-full bg-track-bg" />
        <div
          data-slot="slider-range"
          className="absolute h-1 rounded-full bg-brand-green select-none"
          style={{ left: `${pct(min)}%`, right: `${100 - pct(max)}%` }}
        />
        <div
          data-slot="slider-thumb"
          className={`${THUMB_CLASS} absolute -translate-x-1/2`}
          style={{ left: `${pct(min)}%` }}
        />
        <div
          data-slot="slider-thumb"
          className={`${THUMB_CLASS} absolute -translate-x-1/2`}
          style={{ left: `${pct(max)}%` }}
        />
        <input
          type="range"
          aria-label="Minimum price"
          min={PRICE_FLOOR}
          max={PRICE_CEILING}
          value={min}
          onChange={(e) => onChange(Math.min(Number(e.target.value), max), max)}
          className="absolute inset-x-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-(--thumb-size) [&::-webkit-slider-thumb]:w-(--thumb-size) [&::-webkit-slider-thumb]:opacity-0"
        />
        <input
          type="range"
          aria-label="Maximum price"
          min={PRICE_FLOOR}
          max={PRICE_CEILING}
          value={max}
          onChange={(e) => onChange(min, Math.max(Number(e.target.value), min))}
          className="absolute inset-x-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-(--thumb-size) [&::-webkit-slider-thumb]:w-(--thumb-size) [&::-webkit-slider-thumb]:opacity-0"
        />
      </div>
    </div>
  );
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

  const priceSummary =
    state.minPrice !== PRICE_FLOOR || state.maxPrice !== PRICE_CEILING
      ? `£${state.minPrice} – £${state.maxPrice}`
      : undefined;
  const sortSummary = SORT_OPTIONS.find((o) => o.value === state.sort)?.label;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between rounded-xl bg-brand-green px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Filters</span>
          </div>
          <div className="rounded-md bg-brand-green-dark p-1.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </div>
        </div>
      </div>

      <FilterCard
        title="Categories"
        summary={state.category || undefined}
        open={isOpen("Categories")}
        onToggle={() => toggle("Categories")}
      >
        <div>
          {CATEGORY_TREE.map((node, i) => (
            <React.Fragment key={node.name}>
              <CategoryRow
                node={node}
                depth={0}
                selected={state.category}
                onSelect={(name) => onChange({ category: state.category === name ? null : name })}
              />
              {i < CATEGORY_TREE.length - 1 && <div className="border-t border-gray-100" />}
            </React.Fragment>
          ))}
        </div>
      </FilterCard>

      <FilterCard
        title="Price"
        summary={priceSummary}
        open={isOpen("Price")}
        onToggle={() => toggle("Price")}
      >
        <div className="p-4">
          <PriceSlider
            min={state.minPrice}
            max={state.maxPrice}
            onChange={(minPrice, maxPrice) => onChange({ minPrice, maxPrice })}
          />
          <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
            <span>
              £{state.minPrice} – £{state.maxPrice}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              data-slot="input"
              type="number"
              className={PRICE_INPUT_CLASS}
              value={state.minPrice}
              min={PRICE_FLOOR}
              max={PRICE_CEILING}
              onChange={(e) => onChange({ minPrice: Number(e.target.value) })}
            />
            <input
              data-slot="input"
              type="number"
              className={PRICE_INPUT_CLASS}
              value={state.maxPrice}
              min={PRICE_FLOOR}
              max={PRICE_CEILING}
              onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
            />
          </div>
        </div>
      </FilterCard>

      <FilterCard
        title="Sort By"
        summary={sortSummary}
        open={isOpen("Sort By")}
        onToggle={() => toggle("Sort By")}
      >
        <div className="flex flex-col py-2">
          {SORT_OPTIONS.map((o) => (
            <label
              key={o.value}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="radio"
                name="sort"
                className="w-3.5 h-3.5 accent-brand-green shrink-0"
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

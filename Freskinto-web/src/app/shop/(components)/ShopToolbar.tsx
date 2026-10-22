"use client";

import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { SHOP_SORT_OPTIONS } from "@/constants/filters";
import { cn } from "@/lib/utils";
import type { ProductSort } from "@/services/products/types";
import type { ProductLayout } from "@/stores/shop-store";
import { ActiveFilters } from "./ActiveFilters";
import type { ShopParamsApi } from "./useShopParams";

/** Backend sirf yeh sorts support karta hai (api-reference Part 2); default newest */
export function SortSelect({ id, shop }: { id: string; shop: ShopParamsApi }) {
  return (
    <SelectField<ProductSort>
      id={id}
      aria-label="Sort products"
      options={SHOP_SORT_OPTIONS}
      value={shop.sort ?? "newest"}
      onValueChange={(sort) => shop.update({ sort: sort === "newest" ? null : sort })}
      containerClassName="w-full sm:w-52"
    />
  );
}

interface ShopToolbarProps {
  shop: ShopParamsApi;
  categoryName?: string;
  layout: ProductLayout;
  onLayoutChange: (layout: ProductLayout) => void;
  onOpenFilters: () => void;
}

/** Results ke upar: filters (phone), debounced search, sort, grid/list, aur lage hue filters */
export function ShopToolbar({ shop, categoryName, layout, onLayoutChange, onOpenFilters }: ShopToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className="lg:hidden" onClick={onOpenFilters}>
          <SlidersHorizontal aria-hidden="true" />
          Filters
        </Button>
        <div className="min-w-0 flex-1 basis-56">
          <SearchInput
            value={shop.q}
            onValueChange={(q) => shop.update({ q }, { replace: true })}
            placeholder="Search this shop…"
            aria-label="Search products in the shop"
          />
        </div>
        <div className="ml-auto hidden items-center gap-2 sm:flex">
          <SortSelect id="shop-sort" shop={shop} />
          <div role="group" aria-label="Layout" className="inline-flex rounded-xl border border-input bg-card p-0.5">
            {(
              [
                { value: "grid", label: "Grid view", icon: LayoutGrid },
                { value: "list", label: "List view", icon: List },
              ] as const
            ).map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={label}
                aria-pressed={layout === value}
                onClick={() => onLayoutChange(value)}
                className={cn("rounded-lg", layout === value && "bg-brand-soft text-brand-green-dark")}
              >
                <Icon aria-hidden="true" />
              </Button>
            ))}
          </div>
        </div>
      </div>
      <ActiveFilters shop={shop} categoryName={categoryName} />
    </div>
  );
}

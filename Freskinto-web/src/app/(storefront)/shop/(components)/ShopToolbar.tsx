"use client";

import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ActiveFilters } from "@/components/customer/shop/ActiveFilters";
import type { useShopParams } from "@/components/customer/shop/use-shop-params";
import { SelectField } from "@/components/shared/SelectField";
import { cn } from "@/lib/utils";
import type { ProductSort } from "@/services/products/types";

export type ShopLayout = "grid" | "list";

/** Backend sirf yeh sorts support karta hai (api-reference Part 2); default newest */
export const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "name_asc", label: "Name: A to Z" },
];

export function SortSelect({ id, shop }: { id: string; shop: ReturnType<typeof useShopParams> }) {
  return (
    <SelectField
      id={id}
      aria-label="Sort products"
      options={SORT_OPTIONS}
      value={shop.sort ?? "newest"}
      onValueChange={(sort) => shop.update({ sort: sort === "newest" ? null : sort })}
      containerClassName={cn("w-full sm:w-52")}
    />
  );
}

interface ShopToolbarProps {
  shop: ReturnType<typeof useShopParams>;
  categoryName?: string;
  layout: ShopLayout;
  onLayoutChange: (layout: ShopLayout) => void;
  onOpenFilters: () => void;
}

/** Results ke upar: filters (phone), lage hue filters, sort, grid/list */
export function ShopToolbar({ shop, categoryName, layout, onLayoutChange, onOpenFilters }: ShopToolbarProps) {
  return (
    <Flex wrap align="center" gap="3">
      <Button variant="outline" className={cn("lg:hidden")} onClick={onOpenFilters}>
        <SlidersHorizontal data-icon="inline-start" aria-hidden="true" />
        Filters
      </Button>
      <Flex className={cn("min-w-0 flex-1")}>
        <ActiveFilters params={shop} categoryName={categoryName} update={shop.update} clear={shop.clear} />
      </Flex>
      <Flex align="center" gap="2" className={cn("hidden sm:flex")}>
        <SortSelect id="shop-sort" shop={shop} />
        <ToggleGroup
          aria-label="Layout"
          variant="outline"
          spacing={0}
          value={[layout]}
          onValueChange={(next: string[]) => {
            if (next[0]) onLayoutChange(next[0] as ShopLayout);
          }}
        >
          <ToggleGroupItem value="grid" aria-label="Grid view" className={cn("h-10 w-10")}>
            <LayoutGrid aria-hidden="true" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view" className={cn("h-10 w-10")}>
            <List aria-hidden="true" />
          </ToggleGroupItem>
        </ToggleGroup>
      </Flex>
    </Flex>
  );
}

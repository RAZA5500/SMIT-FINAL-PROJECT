"use client";

import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { SHOP_SORT_OPTIONS } from "@/constants/filters";
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
      containerClassName="w-full sm:w-48"
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
    <Stack gap="3">
      <Flex wrap align="center" gap="3">
        <Button variant="outline" className="lg:hidden" onClick={onOpenFilters}>
          <SlidersHorizontal aria-hidden="true" />
          Filters
        </Button>
        <Box className="min-w-0 flex-1 basis-56">
          <SearchInput
            value={shop.q}
            onValueChange={(q) => shop.update({ q }, { replace: true })}
            placeholder="Search this shop…"
            aria-label="Search products in the shop"
          />
        </Box>
        <Flex align="center" gap="2" className="ml-auto hidden sm:flex">
          <SortSelect id="shop-sort" shop={shop} />
          <ToggleGroup
            aria-label="Layout"
            spacing={0}
            value={[layout]}
            onValueChange={(next) => next[0] && onLayoutChange(next[0] as ProductLayout)}
            className="rounded-lg border border-border p-0.5"
          >
            <ToggleGroupItem
              value="grid"
              aria-label="Grid view"
              className="size-8 px-0 aria-pressed:bg-muted aria-pressed:text-foreground"
            >
              <LayoutGrid aria-hidden="true" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="list"
              aria-label="List view"
              className="size-8 px-0 aria-pressed:bg-muted aria-pressed:text-foreground"
            >
              <List aria-hidden="true" />
            </ToggleGroupItem>
          </ToggleGroup>
        </Flex>
      </Flex>
      <ActiveFilters shop={shop} categoryName={categoryName} />
    </Stack>
  );
}

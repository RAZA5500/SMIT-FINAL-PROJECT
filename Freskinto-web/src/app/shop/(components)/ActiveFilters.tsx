"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
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
    <Flex wrap align="center" gap="2" role="group" aria-label="Active filters">
      {chips.map((chip) => (
        <Button
          key={chip.key}
          type="button"
          variant="secondary"
          size="sm"
          onClick={chip.remove}
          className="animate-fade-up pr-2 pl-2.5 font-normal"
        >
          {chip.label}
          <Text as="span" className="sr-only">
            — remove filter
          </Text>
          <X aria-hidden="true" className="size-3.5 text-muted-foreground" />
        </Button>
      ))}
      <Button type="button" variant="link" size="sm" onClick={shop.clear} className="px-1.5">
        Clear all
      </Button>
    </Flex>
  );
}

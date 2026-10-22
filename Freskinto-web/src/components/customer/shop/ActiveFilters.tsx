"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ShopParams } from "./use-shop-params";

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

/** Lage hue filters — har ek alag se hatane ka button */
export function ActiveFilters({ params, categoryName, update, clear }: ActiveFiltersProps) {
  const price = priceLabel(params.min, params.max);
  const chips = [
    params.q && { key: "q", label: `“${params.q}”`, remove: () => update({ q: "" }) },
    params.category && { key: "category", label: categoryName ?? "Category", remove: () => update({ category: null }) },
    price && { key: "price", label: price, remove: () => update({ min: null, max: null }) },
  ].filter(Boolean) as { key: string; label: string; remove: () => void }[];

  if (chips.length === 0) return null;

  return (
    <Flex wrap align="center" gap="2" aria-label="Active filters">
      {chips.map((chip) => (
        <Button key={chip.key} variant="outline" size="xs" onClick={chip.remove} className={cn("pr-2")}>
          {chip.label}
          <Text as="span" className={cn("sr-only")}>
            — remove filter
          </Text>
          <X data-icon="inline-end" aria-hidden="true" className={cn("text-muted-foreground")} />
        </Button>
      ))}
      <Button variant="link" size="xs" onClick={clear}>
        Clear all
      </Button>
    </Flex>
  );
}

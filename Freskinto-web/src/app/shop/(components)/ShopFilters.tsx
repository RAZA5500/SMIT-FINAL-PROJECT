"use client";

import type { ReactNode } from "react";
import { CheckboxField } from "@/components/shared/CheckboxField";
import { SHOP_AVAILABILITY_OPTIONS } from "@/constants/filters";
import { useGetProducts } from "@/services/products/queries";
import { AisleFilter } from "./AisleFilter";
import { PriceFilter } from "./PriceFilter";
import type { ShopParamsApi } from "./useShopParams";

/** Slider ki hadd: catalog ki sab se mehngi cheez, £5 tak round up (API down ho to 100) */
const FALLBACK_CEILING = 100;

export function usePriceCeiling(): number {
  const { data } = useGetProducts({ sortBy: "price_desc", limit: 1 });
  const top = Number(data?.data[0]?.price ?? 0);
  return top > 0 ? Math.max(10, Math.ceil(top / 5) * 5) : FALLBACK_CEILING;
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-b border-border py-5 first:pt-0 last:border-b-0 last:pb-0">
      <h3 className="text-fs-11 font-semibold tracking-widest text-foreground uppercase">{title}</h3>
      {children}
    </section>
  );
}

/** Filter sidebar (desktop) / drawer body (phone): aisles, price, availability */
export function ShopFilters({ shop }: { shop: ShopParamsApi }) {
  const ceiling = usePriceCeiling();

  return (
    <div className="flex flex-col">
      <FilterSection title="Aisles">
        <AisleFilter selected={shop.category} onSelect={(category) => shop.update({ category })} />
      </FilterSection>
      <FilterSection title="Price">
        {/* key — URL ya ceiling badle to slider naye sire se */}
        <PriceFilter
          key={`${shop.min}-${shop.max}-${ceiling}`}
          min={shop.min}
          max={shop.max}
          ceiling={ceiling}
          onCommit={(min, max) => shop.update({ min, max }, { replace: true })}
        />
      </FilterSection>
      <FilterSection title="Availability">
        <CheckboxField
          id="filter-in-stock"
          label={SHOP_AVAILABILITY_OPTIONS[1].label}
          description="Hide sold-out items on this page"
          checked={shop.inStock}
          onCheckedChange={(inStock) => shop.update({ inStock }, { replace: true })}
        />
      </FilterSection>
    </div>
  );
}

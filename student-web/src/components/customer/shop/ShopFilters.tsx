"use client";

import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { useGetProducts } from "@/services/products/queries";
import { CategoryFilter } from "./CategoryFilter";
import { PriceFilter } from "./PriceFilter";
import type { ShopParams } from "./use-shop-params";

/** Slider ki hadd: catalog ki sab se mehngi cheez, £5 tak round up (API down ho to 100) */
const FALLBACK_CEILING = 100;

export function usePriceCeiling(): number {
  const { data } = useGetProducts({ sortBy: "price_desc", limit: 1 });
  const top = Number(data?.data[0]?.price ?? 0);
  return top > 0 ? Math.max(10, Math.ceil(top / 5) * 5) : FALLBACK_CEILING;
}

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-sans text-xs font-semibold tracking-widest text-muted-foreground uppercase">{title}</h2>
      {children}
    </section>
  );
}

interface ShopFiltersProps {
  params: ShopParams;
  update: (patch: Partial<ShopParams>, options?: { replace?: boolean }) => void;
}

export function ShopFilters({ params, update }: ShopFiltersProps) {
  const ceiling = usePriceCeiling();

  return (
    <div className="flex flex-col gap-5">
      <FilterSection title="Categories">
        <CategoryFilter selected={params.category} onSelect={(category) => update({ category })} />
      </FilterSection>
      <Separator />
      <FilterSection title="Price">
        {/* key — URL ya ceiling badle to slider naye sire se */}
        <PriceFilter
          key={`${params.min}-${params.max}-${ceiling}`}
          min={params.min}
          max={params.max}
          ceiling={ceiling}
          onCommit={(min, max) => update({ min, max }, { replace: true })}
        />
      </FilterSection>
    </div>
  );
}

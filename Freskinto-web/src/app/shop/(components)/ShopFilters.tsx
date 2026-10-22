"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

const SECTIONS = ["aisles", "price", "availability"];

/** Filter sidebar (desktop) / drawer body (phone): aisles, price, availability — har ek accordion */
export function ShopFilters({ shop }: { shop: ShopParamsApi }) {
  const ceiling = usePriceCeiling();

  return (
    <Accordion multiple defaultValue={SECTIONS}>
      <AccordionItem value="aisles">
        <AccordionTrigger className="py-4 text-fs-11 font-bold tracking-widest uppercase hover:no-underline">Aisles</AccordionTrigger>
        <AccordionContent className="pb-4">
          <AisleFilter selected={shop.category} onSelect={(category) => shop.update({ category })} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="price">
        <AccordionTrigger className="py-4 text-fs-11 font-bold tracking-widest uppercase hover:no-underline">Price</AccordionTrigger>
        <AccordionContent className="pb-4">
          {/* key — URL ya ceiling badle to slider naye sire se */}
          <PriceFilter
            key={`${shop.min}-${shop.max}-${ceiling}`}
            min={shop.min}
            max={shop.max}
            ceiling={ceiling}
            onCommit={(min, max) => shop.update({ min, max }, { replace: true })}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="availability">
        <AccordionTrigger className="py-4 text-fs-11 font-bold tracking-widest uppercase hover:no-underline">
          Availability
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <CheckboxField
            id="filter-in-stock"
            label={SHOP_AVAILABILITY_OPTIONS[1].label}
            description="Hide sold-out items on this page"
            checked={shop.inStock}
            onCheckedChange={(inStock) => shop.update({ inStock }, { replace: true })}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

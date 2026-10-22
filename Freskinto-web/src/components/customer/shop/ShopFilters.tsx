"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useGetProducts } from "@/services/products/queries";
import { AisleFilter } from "./AisleFilter";
import { PriceFilter } from "./PriceFilter";
import type { ShopParams } from "./use-shop-params";

/** Slider ki hadd: catalog ki sab se mehngi cheez, £5 tak round up (API down ho to 100) */
const FALLBACK_CEILING = 100;

export function usePriceCeiling(): number {
  const { data } = useGetProducts({ sortBy: "price_desc", limit: 1 });
  const top = Number(data?.data[0]?.price ?? 0);
  return top > 0 ? Math.max(10, Math.ceil(top / 5) * 5) : FALLBACK_CEILING;
}

interface ShopFiltersProps {
  params: ShopParams;
  update: (patch: Partial<ShopParams>, options?: { replace?: boolean }) => void;
}

/** Aisles + price — dono sections shuru mein khule */
export function ShopFilters({ params, update }: ShopFiltersProps) {
  const ceiling = usePriceCeiling();

  return (
    <Accordion multiple defaultValue={["aisles", "price"]}>
      <AccordionItem value="aisles">
        <AccordionTrigger className={cn("py-3 hover:no-underline")}>
          <Text as="span" variant="eyebrow" className={cn("text-foreground")}>
            Aisles
          </Text>
        </AccordionTrigger>
        <AccordionContent className={cn("pb-4")}>
          <AisleFilter selected={params.category} onSelect={(category) => update({ category })} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="price">
        <AccordionTrigger className={cn("py-3 hover:no-underline")}>
          <Text as="span" variant="eyebrow" className={cn("text-foreground")}>
            Price
          </Text>
        </AccordionTrigger>
        <AccordionContent className={cn("px-1 pb-4")}>
          {/* key — URL ya ceiling badle to slider naye sire se */}
          <PriceFilter
            key={`${params.min}-${params.max}-${ceiling}`}
            min={params.min}
            max={params.max}
            ceiling={ceiling}
            onCommit={(min, max) => update({ min, max }, { replace: true })}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

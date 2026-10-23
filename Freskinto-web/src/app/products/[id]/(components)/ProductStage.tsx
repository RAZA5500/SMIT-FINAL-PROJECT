"use client";

import type { CSSProperties } from "react";
import { Box } from "@/components/ui/box";
import { Stack } from "@/components/ui/flex";
import { Tilt } from "@/components/ui/tilt";
import { Text } from "@/components/ui/typography";
import { ViewTransition } from "@/components/ui/view-transition";
import { ProductBadges, productMorphName } from "@/components/customer/product/ProductCard";
import { ProductImage } from "@/components/shared/ProductImage";
import { productVisual } from "@/lib/merchandising";
import type { IProduct } from "@/services/products/types";

/** Buy box ki "Add to basket" isi stage ki photo ko basket tak udati hai */
export const PRODUCT_STAGE_SELECTOR = "[data-product-stage] [data-product-image]";

/**
 * Product page ka "stage": product apne rang ki roshni mein tairta hai, peeche dheere ghoomte rings
 * aur aisle ka naam bade halke harfon mein; mouse ke saath poora stage jhukta hai aur roshni
 * cursor ke peeche chalti hai. Shop card se aate waqt photo wahin se ud kar yahan aati hai
 * (shared-element morph).
 */
export function ProductStage({ product }: { product: IProduct }) {
  const { aura } = productVisual(product.name, product.category.name);
  const words = product.category.name.split(/\s+/);
  const longest = Math.max(...words.map((word) => word.length));

  return (
    <Box data-product-stage="" className="relative lg:sticky lg:top-28">
      <Tilt
        max={4}
        data-product-image=""
        style={{ "--aura": aura } as CSSProperties}
        className="group/stage @container relative isolate aspect-square overflow-hidden rounded-[2.5rem] border border-border/70 aura-wash sm:aspect-5/4 lg:aspect-square dark:border-white/[0.06]"
      >
        <Stack
          aria-hidden="true"
          align="center"
          className="pointer-events-none absolute inset-x-0 top-[7%] font-display leading-[0.86] font-bold tracking-[-0.06em] text-[color-mix(in_oklab,var(--aura)_22%,transparent)] select-none"
          style={{ fontSize: `min(22cqi, ${150 / longest}cqi)` }}
        >
          {words.map((word, index) => (
            <Text key={index} as="span" tone="inherit" className="animate-fade-up" style={{ animationDelay: `${index * 90}ms` }}>
              {word}
            </Text>
          ))}
        </Stack>

        <Box
          aria-hidden="true"
          className="absolute top-[54%] left-1/2 size-[80%] -translate-1/2 animate-spin-slow rounded-full border border-dashed border-[color-mix(in_oklab,var(--aura)_50%,transparent)] [animation-duration:60s]"
        />
        <Box
          aria-hidden="true"
          className="absolute top-[54%] left-1/2 size-[60%] -translate-1/2 rounded-full border border-[color-mix(in_oklab,var(--aura)_28%,transparent)]"
        />
        <Box
          aria-hidden="true"
          className="absolute bottom-[13%] left-1/2 h-[6%] w-[44%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(12_26_20/0.26),transparent)] blur-md dark:bg-[radial-gradient(closest-side,rgb(0_0_0/0.7),transparent)]"
        />

        <ViewTransition name={productMorphName(product.id)} share="product-morph">
          <ProductImage
            name={product.name}
            categoryName={product.category.name}
            alt={product.name}
            eager
            stage="bare"
            sizes="(min-width: 1024px) 640px, 100vw"
            muted={product.stockStatus === "OUT_OF_STOCK"}
            className="absolute inset-x-0 top-[8%] bottom-0 aspect-auto animate-float-slow"
            imageClassName="p-[15%] group-hover/stage:scale-105"
          />
        </ViewTransition>

        <Box
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(28rem_circle_at_var(--glare-x,50%)_var(--glare-y,0%),rgb(255_255_255/0.4),transparent_45%)] opacity-0 transition-opacity duration-500 group-hover/stage:opacity-100 dark:bg-[radial-gradient(28rem_circle_at_var(--glare-x,50%)_var(--glare-y,0%),rgb(255_255_255/0.08),transparent_45%)]"
        />
      </Tilt>
      <ProductBadges product={product} className="absolute top-5 left-5" />
    </Box>
  );
}

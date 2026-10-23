"use client";

import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Tilt } from "@/components/ui/tilt";
import { Heading, Text } from "@/components/ui/typography";
import { ViewTransition } from "@/components/ui/view-transition";
import { Price } from "@/components/shared/Price";
import { ProductImage } from "@/components/shared/ProductImage";
import { TextLink } from "@/components/shared/TextLink";
import { isNewProduct } from "@/lib/merchandising";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/services/products/types";
import { ProductCartControl } from "./ProductCartControl";
import { ProductQuickView } from "./ProductQuickView";

interface ProductCardProps {
  product: IProduct;
  /** Pehli screen ke cards — image eager load */
  eager?: boolean;
  /**
   * Photo product page mein "morph" ho (View Transitions). Ek page par ek product ka sirf ek
   * card yeh naam le — duplicate naam transition rok dete hain.
   */
  morph?: boolean;
  className?: string;
}

/** Product photo ka shared-element naam — card aur product page dono yahi use karte hain */
export const productMorphName = (id: string) => `product-${id}`;

/** Stock / "new" labels over the packshot — sirf asli data (stockStatus, createdAt) */
export function ProductBadges({ product, className }: { product: IProduct; className?: string }) {
  const outOfStock = product.stockStatus === "OUT_OF_STOCK";
  const lowStock = product.stockStatus === "LOW_STOCK";
  const isNew = isNewProduct(product.createdAt);
  if (!outOfStock && !lowStock && !isNew) return null;

  return (
    <Stack align="start" gap="1" className={cn("pointer-events-none", className)}>
      {outOfStock ? (
        <Badge variant="glass">Sold out</Badge>
      ) : lowStock ? (
        <Badge variant="glass" className="text-warning-ink">
          Few left
        </Badge>
      ) : null}
      {isNew && !outOfStock && <Badge variant="fresh">New</Badge>}
    </Stack>
  );
}

/**
 * Shop shelf card — product apne rang ke glow par tairta hai, hover par card uthta hai, photo
 * jhuk kar upar aati hai (3D tilt), gol "+" se photo basket tak udti hai. Quick view kone mein.
 */
export function ProductCard({ product, eager = false, morph = false, className }: ProductCardProps) {
  const outOfStock = product.stockStatus === "OUT_OF_STOCK";
  const image = (
    <ProductImage
      name={product.name}
      categoryName={product.category.name}
      eager={eager}
      muted={outOfStock}
      className="rounded-[1.4rem]"
      imageClassName="group-hover/product:-translate-y-2.5 group-hover/product:-rotate-3 group-hover/product:scale-105"
    />
  );

  return (
    <Card
      render={<Box as="article" />}
      data-product-card=""
      className={cn(
        "group/product relative h-full gap-0 rounded-[1.9rem] p-2 transition-[translate,box-shadow] duration-500 ease-out-expo hover:-translate-y-1.5 hover:shadow-lift",
        className,
      )}
    >
      <Tilt max={5} data-product-image="" className="relative rounded-[1.4rem]">
        {morph ? (
          <ViewTransition name={productMorphName(product.id)} share="product-morph">
            {image}
          </ViewTransition>
        ) : (
          image
        )}
        <ProductBadges product={product} className="absolute top-3 left-3" />
        <ProductQuickView
          product={product}
          className="absolute top-3 right-3 z-20 sm:scale-75 sm:opacity-0 sm:group-hover/product:scale-100 sm:group-hover/product:opacity-100 sm:focus-visible:scale-100 sm:focus-visible:opacity-100"
        />
      </Tilt>

      <Stack gap="3" className="flex-1 px-2.5 pt-3.5 pb-2">
        <Stack gap="1.5">
          <Text variant="eyebrow" tone="muted" className="truncate">
            {product.category.name}
          </Text>
          <Heading as="h3" size="4" className="line-clamp-2 min-h-11 leading-snug">
            {/* Stretched link: poora card clickable, basket control + quick view upar (z-10/z-20) */}
            <TextLink
              href={publicRoutes.product(product.id)}
              tone="default"
              className="font-bold after:absolute after:inset-0 after:rounded-[1.9rem] hover:text-foreground hover:no-underline focus-visible:ring-0 focus-visible:after:ring-4 focus-visible:after:ring-ring/30"
            >
              {product.name}
            </TextLink>
          </Heading>
        </Stack>

        <Flex align="end" justify="between" gap="2" className="mt-auto">
          <Stack gap="0.5">
            <Price amount={product.price} size="lg" />
            <Text as="span" tone="muted" className="text-fs-11">
              {product.minimumOrderQuantity > 1 ? `Min. ${product.minimumOrderQuantity}` : "each"}
            </Text>
          </Stack>
          <Box className="relative z-10">
            <ProductCartControl product={product} variant="compact" />
          </Box>
        </Flex>
      </Stack>
    </Card>
  );
}

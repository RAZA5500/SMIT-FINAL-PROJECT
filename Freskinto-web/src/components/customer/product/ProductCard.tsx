"use client";

import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Heading, Text } from "@/components/ui/typography";
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
  className?: string;
}

/** Stock / "new" labels over the packshot — sirf asli data (stockStatus, createdAt) */
export function ProductBadges({ product, className }: { product: IProduct; className?: string }) {
  const outOfStock = product.stockStatus === "OUT_OF_STOCK";
  const lowStock = product.stockStatus === "LOW_STOCK";
  const isNew = isNewProduct(product.createdAt);
  if (!outOfStock && !lowStock && !isNew) return null;

  return (
    <Stack align="start" gap="1" className={cn("pointer-events-none", className)}>
      {outOfStock ? (
        <Badge variant="outline">Sold out</Badge>
      ) : lowStock ? (
        <Badge variant="outline">Low stock</Badge>
      ) : null}
      {isNew && !outOfStock && <Badge variant="brand">New</Badge>}
    </Stack>
  );
}

/** Shop shelf card — thin border, packshot on a grey well, quick view and basket control */
export function ProductCard({ product, eager = false, className }: ProductCardProps) {
  const outOfStock = product.stockStatus === "OUT_OF_STOCK";

  return (
    <Card
      render={<Box as="article" />}
      className={cn(
        "group/product relative h-full gap-0 py-0 transition-[border-color,box-shadow] duration-200 hover:border-foreground/15 hover:shadow-soft",
        className,
      )}
    >
      <Box className="relative p-2 pb-0">
        <ProductImage
          name={product.name}
          categoryName={product.category.name}
          eager={eager}
          muted={outOfStock}
          className="rounded-lg"
          imageClassName="transition-transform duration-300 group-hover/product:scale-105"
        />
        <ProductBadges product={product} className="absolute top-4 left-4" />
        <ProductQuickView
          product={product}
          className="absolute top-4 right-4 z-20 sm:opacity-0 sm:group-hover/product:opacity-100 sm:focus-visible:opacity-100"
        />
      </Box>

      <Stack gap="3" className="flex-1 p-3 sm:p-4">
        <Stack gap="1">
          <Text variant="small" tone="muted" className="truncate">
            {product.category.name}
          </Text>
          <Heading as="h3" size="5" className="line-clamp-2 min-h-10 font-medium">
            {/* Stretched link: poora card clickable, basket control + quick view upar (z-10/z-20) */}
            <TextLink
              href={publicRoutes.product(product.id)}
              tone="default"
              className="font-medium after:absolute after:inset-0 after:rounded-xl hover:text-foreground hover:no-underline focus-visible:ring-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/30"
            >
              {product.name}
            </TextLink>
          </Heading>
        </Stack>

        <Flex align="baseline" justify="between" gap="2" className="mt-auto">
          <Price amount={product.price} size="md" />
          <Text as="span" tone="muted" className="text-fs-12">
            {product.minimumOrderQuantity > 1 ? `Min. ${product.minimumOrderQuantity}` : "each"}
          </Text>
        </Flex>

        <Box className="relative z-10">
          <ProductCartControl product={product} />
        </Box>
      </Stack>
    </Card>
  );
}

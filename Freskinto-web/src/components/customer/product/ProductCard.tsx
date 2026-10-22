"use client";

import { Flame, Sparkles } from "lucide-react";
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

/** Stock / "new" stickers over the packshot — sirf asli data (stockStatus, createdAt) */
export function ProductBadges({ product, className }: { product: IProduct; className?: string }) {
  const outOfStock = product.stockStatus === "OUT_OF_STOCK";
  const lowStock = product.stockStatus === "LOW_STOCK";
  const isNew = isNewProduct(product.createdAt);
  if (!outOfStock && !lowStock && !isNew) return null;

  return (
    <Stack align="start" gap="1.5" className={cn("pointer-events-none", className)}>
      {outOfStock ? (
        <Badge variant="destructive">Sold out</Badge>
      ) : lowStock ? (
        <Badge variant="sticker-tangerine">
          <Flame aria-hidden="true" />
          Low stock
        </Badge>
      ) : null}
      {isNew && !outOfStock && (
        <Badge variant="sticker">
          <Sparkles aria-hidden="true" />
          New in
        </Badge>
      )}
    </Stack>
  );
}

/** Shop shelf card — "pop" lift onto an ink shadow, packshot in a pastel well, quick view, basket control */
export function ProductCard({ product, eager = false, className }: ProductCardProps) {
  const outOfStock = product.stockStatus === "OUT_OF_STOCK";

  return (
    <Card
      render={<Box as="article" />}
      className={cn(
        "group/product pop-hover relative h-full gap-0 rounded-3xl border-2 py-0 shadow-none",
        className,
      )}
    >
      <Box className="relative p-2">
        <ProductImage
          name={product.name}
          categoryName={product.category.name}
          eager={eager}
          muted={outOfStock}
          className="rounded-2xl"
          imageClassName="transition-transform duration-500 group-hover/product:scale-110 group-hover/product:-rotate-3"
        />
        <ProductBadges product={product} className="absolute top-4 left-4" />
        <ProductQuickView
          product={product}
          className="absolute top-4 right-4 z-20 sm:opacity-0 sm:group-hover/product:opacity-100 sm:focus-visible:opacity-100"
        />
      </Box>

      <Stack gap="3" className="flex-1 px-3.5 pt-1 pb-3.5 sm:px-4 sm:pb-4">
        <Stack gap="1">
          <Text variant="eyebrow" tone="muted" className="truncate">
            {product.category.name}
          </Text>
          <Heading as="h3" size="5" className="line-clamp-2 min-h-11 leading-snug">
            {/* Stretched link: poora card clickable, basket control + quick view upar (z-10/z-20) */}
            <TextLink
              href={publicRoutes.product(product.id)}
              tone="default"
              className="after:absolute after:inset-0 after:rounded-3xl hover:no-underline focus-visible:ring-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/40"
            >
              {product.name}
            </TextLink>
          </Heading>
        </Stack>

        <Flex align="baseline" justify="between" gap="2" className="mt-auto">
          <Price amount={product.price} size="lg" />
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

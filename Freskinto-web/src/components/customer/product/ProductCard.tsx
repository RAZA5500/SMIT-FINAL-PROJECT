"use client";

import { Flame, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Heading, Text } from "@/components/ui/typography";
import { ShelfLabel } from "@/components/shared/Price";
import { ProductImage } from "@/components/shared/ProductImage";
import { TextLink } from "@/components/shared/TextLink";
import { isNewProduct } from "@/lib/merchandising";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/services/products/types";
import { ProductCartControl } from "./ProductCartControl";

interface ProductCardProps {
  product: IProduct;
  /** Pehli screen ke cards — image eager load */
  eager?: boolean;
  className?: string;
}

/** Stock / "new" signals over the packshot — sirf asli data (stockStatus, createdAt) */
export function ProductBadges({ product, className }: { product: IProduct; className?: string }) {
  const outOfStock = product.stockStatus === "OUT_OF_STOCK";
  const lowStock = product.stockStatus === "LOW_STOCK";
  const isNew = isNewProduct(product.createdAt);
  if (!outOfStock && !lowStock && !isNew) return null;

  return (
    <Stack align="start" gap="1" className={cn("pointer-events-none", className)}>
      {outOfStock ? (
        <Badge variant="destructive">Sold out</Badge>
      ) : lowStock ? (
        <Badge variant="warning">
          <Flame aria-hidden="true" />
          Low stock
        </Badge>
      ) : null}
      {isNew && !outOfStock && (
        <Badge variant="brand" className={cn("text-xs font-semibold")}>
          <Sparkles aria-hidden="true" />
          New in
        </Badge>
      )}
    </Stack>
  );
}

/** Shop shelf card — packshot, aisle, name (stretched link), shelf-edge price, basket control */
export function ProductCard({ product, eager = false, className }: ProductCardProps) {
  return (
    <Card
      className={cn(
        "group/product relative h-full gap-0 py-0 rounded-2xl border-border/80 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lift hover:border-brand-green/40",
        className,
      )}
    >
      <Box className={cn("relative")}>
        <ProductImage
          name={product.name}
          categoryName={product.category.name}
          eager={eager}
          muted={product.stockStatus === "OUT_OF_STOCK"}
          imageClassName={cn("transition-transform duration-500 group-hover/product:scale-105")}
        />
        <ProductBadges product={product} className={cn("absolute top-3 left-3")} />
      </Box>

      <Stack gap="3" className={cn("flex-1 p-3.5")}>
        <Stack gap="1">
          <Text variant="small" tone="muted" className={cn("truncate")}>
            {product.category.name}
          </Text>
          <Heading as="h3" size="5" family="sans" className={cn("line-clamp-2 min-h-10 text-sm leading-5")}>
            {/* Stretched link: poora card clickable, basket control upar (z-10) */}
            <TextLink
              href={publicRoutes.product(product.id)}
              tone="default"
              className={cn(
                "font-semibold hover:no-underline after:absolute after:inset-0 after:rounded-2xl focus-visible:ring-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/40",
              )}
            >
              {product.name}
            </TextLink>
          </Heading>
        </Stack>
        <Flex align="end" justify="between" gap="2" className={cn("mt-auto")}>
          <ShelfLabel
            amount={product.price}
            caption={product.minimumOrderQuantity > 1 ? `Min. ${product.minimumOrderQuantity}` : "Each"}
          />
        </Flex>
        <Box className={cn("relative z-10")}>
          <ProductCartControl product={product} />
        </Box>
      </Stack>
    </Card>
  );
}

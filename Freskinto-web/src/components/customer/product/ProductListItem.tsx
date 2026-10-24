"use client";

import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Heading, Text } from "@/components/ui/typography";
import { ViewTransition } from "@/components/ui/view-transition";
import { Price } from "@/components/shared/Price";
import { ProductImage } from "@/components/shared/ProductImage";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TextLink } from "@/components/shared/TextLink";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/services/products/types";
import { ProductBadges, productMorphName } from "./ProductCard";
import { ProductCartControl } from "./ProductCartControl";

interface ProductListItemProps {
  product: IProduct;
  eager?: boolean;
  morph?: boolean;
  className?: string;
}

/** Shop ka list layout — ek product ek row, basket control right par */
export function ProductListItem({ product, eager = false, morph = false, className }: ProductListItemProps) {
  const image = (
    <ProductImage
      name={product.name}
      categoryName={product.category.name}
      eager={eager}
      sizes="112px"
      muted={product.stockStatus === "OUT_OF_STOCK"}
      className="size-20 rounded-[1.25rem] sm:size-28"
      imageClassName="p-[10%] group-hover/product:-translate-y-1 group-hover/product:-rotate-3 group-hover/product:scale-105"
    />
  );

  return (
    <Card
      render={<Box as="article" />}
      data-product-card=""
      className={cn(
        "group/product relative flex-row items-center gap-3 rounded-[1.75rem] p-2 pr-3 transition-[translate,box-shadow,border-color] duration-500 ease-out-expo hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-lift dark:hover:border-white/20 sm:gap-4 sm:pr-5",
        className,
      )}
    >
      <Box data-product-image="" className="relative shrink-0">
        {morph ? (
          <ViewTransition name={productMorphName(product.id)} share="product-morph">
            {image}
          </ViewTransition>
        ) : (
          image
        )}
        <ProductBadges product={product} className="absolute top-1.5 left-1.5 origin-top-left scale-75" />
      </Box>

      <Stack gap="1.5" className="min-w-0 flex-1">
        <Text variant="eyebrow" tone="muted" className="truncate">
          {product.category.name}
        </Text>
        <Heading as="h3" size="4" className="line-clamp-2">
          <TextLink
            href={publicRoutes.product(product.id)}
            transitionTypes={["nav-forward"]}
            tone="default"
            className="font-bold after:absolute after:inset-0 after:rounded-[1.75rem] hover:text-foreground hover:no-underline focus-visible:ring-0 focus-visible:after:ring-4 focus-visible:after:ring-ring/30"
          >
            {product.name}
          </TextLink>
        </Heading>
        <Flex wrap align="center" gap="2">
          <Price amount={product.price} size="lg" />
          <StatusBadge status={product.stockStatus} />
        </Flex>
      </Stack>

      <Box className="relative z-10 w-28 shrink-0 sm:w-44">
        <ProductCartControl product={product} />
      </Box>
    </Card>
  );
}

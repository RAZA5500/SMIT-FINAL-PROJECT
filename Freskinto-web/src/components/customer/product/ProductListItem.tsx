"use client";

import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Heading, Text } from "@/components/ui/typography";
import { Price } from "@/components/shared/Price";
import { ProductImage } from "@/components/shared/ProductImage";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TextLink } from "@/components/shared/TextLink";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/services/products/types";
import { ProductBadges } from "./ProductCard";
import { ProductCartControl } from "./ProductCartControl";

/** Shop ka list layout — ek product ek row, basket control right par */
export function ProductListItem({ product, className }: { product: IProduct; className?: string }) {
  return (
    <Card
      render={<Box as="article" />}
      className={cn(
        "group/product relative flex-row items-center gap-4 p-2 pr-4 transition-[border-color,box-shadow] duration-200 hover:border-foreground/15 hover:shadow-soft sm:pr-5",
        className,
      )}
    >
      <Box className="relative shrink-0">
        <ProductImage
          name={product.name}
          categoryName={product.category.name}
          sizes="112px"
          muted={product.stockStatus === "OUT_OF_STOCK"}
          className="size-24 rounded-lg sm:size-28"
          imageClassName="p-2 transition-transform duration-300 group-hover/product:scale-105"
        />
        <ProductBadges product={product} className="absolute top-1.5 left-1.5 origin-top-left scale-75" />
      </Box>

      <Stack gap="1.5" className="min-w-0 flex-1">
        <Text variant="small" tone="muted" className="truncate">
          {product.category.name}
        </Text>
        <Heading as="h3" size="5" className="line-clamp-2 font-medium">
          <TextLink
            href={publicRoutes.product(product.id)}
            tone="default"
            className="font-medium after:absolute after:inset-0 after:rounded-xl hover:text-foreground hover:no-underline focus-visible:ring-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/30"
          >
            {product.name}
          </TextLink>
        </Heading>
        <Flex wrap align="center" gap="2">
          <Price amount={product.price} size="md" />
          <StatusBadge status={product.stockStatus} />
        </Flex>
      </Stack>

      <Box className="relative z-10 w-32 shrink-0 sm:w-44">
        <ProductCartControl product={product} />
      </Box>
    </Card>
  );
}

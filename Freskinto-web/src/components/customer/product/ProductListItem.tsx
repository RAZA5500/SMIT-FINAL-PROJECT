"use client";

import { Box } from "@/components/ui/box";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { ShelfLabel } from "@/components/shared/Price";
import { ProductImage } from "@/components/shared/ProductImage";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TextLink } from "@/components/shared/TextLink";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/services/products/types";
import { ProductCartControl } from "./ProductCartControl";

/** Shop "list" view row — compact, scannable, same basket control as the card */
export function ProductListItem({ product }: { product: IProduct }) {
  return (
    <Item variant="outline" className={cn("relative flex-nowrap gap-4 rounded-2xl bg-card p-3 sm:p-4")}>
      <ItemMedia className={cn("size-20 shrink-0 overflow-hidden rounded-xl sm:size-24")}>
        <ProductImage
          name={product.name}
          categoryName={product.category.name}
          sizes="96px"
          muted={product.stockStatus === "OUT_OF_STOCK"}
          className={cn("size-full")}
          imageClassName={cn("p-2")}
        />
      </ItemMedia>
      <ItemContent className={cn("min-w-0 gap-2")}>
        <ItemDescription className={cn("truncate text-xs")}>{product.category.name}</ItemDescription>
        <ItemTitle className={cn("line-clamp-2 text-base font-semibold")}>
          <TextLink
            href={publicRoutes.product(product.id)}
            tone="default"
            className={cn("hover:no-underline after:absolute after:inset-0 after:rounded-2xl")}
          >
            {product.name}
          </TextLink>
        </ItemTitle>
        {product.stockStatus !== "IN_STOCK" && <StatusBadge status={product.stockStatus} />}
      </ItemContent>
      <ItemActions className={cn("shrink-0 flex-col items-end gap-3 sm:flex-row sm:items-center")}>
        <ShelfLabel
          amount={product.price}
          caption={product.minimumOrderQuantity > 1 ? `Min. ${product.minimumOrderQuantity}` : "Each"}
        />
        <Box className={cn("relative z-10 w-36 sm:w-40")}>
          <ProductCartControl product={product} />
        </Box>
      </ItemActions>
    </Item>
  );
}

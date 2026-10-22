"use client";

import { ArrowUpRight, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Price } from "@/components/shared/Price";
import { ProductImage } from "@/components/shared/ProductImage";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/services/products/types";
import { ProductCartControl } from "./ProductCartControl";

/** Card ke kone ka "quick view" — page chhore bina bara packshot, price aur basket control */
export function ProductQuickView({ product, className }: { product: IProduct; className?: string }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={`Quick view ${product.name}`}
            className={cn("bg-background/90 backdrop-blur transition-opacity", className)}
          />
        }
      >
        <Eye aria-hidden="true" />
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <Grid className="md:grid-cols-2">
          <ProductImage
            name={product.name}
            categoryName={product.category.name}
            alt={product.name}
            sizes="(min-width: 768px) 380px, 100vw"
            muted={product.stockStatus === "OUT_OF_STOCK"}
            imageClassName="p-10"
            className="max-md:aspect-video"
          />
          <Stack gap="5" className="p-6 sm:p-8">
            <Stack gap="2">
              <Badge variant="secondary">{product.category.name}</Badge>
              <DialogTitle className="text-2xl">{product.name}</DialogTitle>
              <DialogDescription>
                <Text as="span" tone="inherit" family="mono" className="text-fs-12">
                  SKU {product.sku}
                </Text>
              </DialogDescription>
            </Stack>
            <Flex wrap align="center" gap="3">
              <Price amount={product.price} size="xl" />
              <StatusBadge status={product.stockStatus} />
            </Flex>
            <Text tone="muted" className="text-fs-13">
              {product.minimumOrderQuantity > 1
                ? `Minimum ${product.minimumOrderQuantity} per order · up to ${product.maximumOrderQuantity}`
                : `Up to ${product.maximumOrderQuantity} per order`}
            </Text>
            <Stack gap="2.5" className="mt-auto">
              <ProductCartControl product={product} size="md" />
              <ButtonLink href={publicRoutes.product(product.id)} variant="ghost">
                See full details
                <ArrowUpRight aria-hidden="true" />
              </ButtonLink>
            </Stack>
          </Stack>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

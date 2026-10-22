"use client";

import { ExternalLink, Package, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Text } from "@/components/ui/typography";
import { AppModal } from "@/components/shared/AppModal";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { ProductImage } from "@/components/shared/ProductImage";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDateTime, formatMoney } from "@/lib/format";
import { adminRoutes, publicRoutes } from "@/lib/routes/routes";
import type { IAdminProduct } from "@/services/products/types";

export interface ProductViewModalProps {
  product: IAdminProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductViewModal({ product, open, onOpenChange }: ProductViewModalProps) {
  const router = useRouter();

  if (!product) return null;

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title={
        <Flex align="center" gap="2.5">
          <Package className="size-5 text-brand-green" aria-hidden="true" />
          <span>Product details</span>
        </Flex>
      }
      description={`SKU: ${product.sku} · ${product.category.name}`}
      footer={
        <Flex align="center" justify="between" className="w-full">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Flex align="center" gap="2">
            {product.isActive && (
              <ButtonLink
                href={publicRoutes.product(product.id)}
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                <ExternalLink data-icon="inline-start" aria-hidden="true" />
                View in store
              </ButtonLink>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                router.push(adminRoutes.productEdit(product.id));
              }}
            >
              <Pencil data-icon="inline-start" aria-hidden="true" />
              Edit product
            </Button>
          </Flex>
        </Flex>
      }
    >
      <Stack gap="5" className="py-1">
        <Flex gap="4" align="start">
          <div className="size-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
            <ProductImage name={product.name} categoryName={product.category.name} />
          </div>
          <Stack gap="1.5" className="min-w-0 flex-1">
            <Flex wrap align="center" gap="2">
              <StatusBadge status={product.isActive ? "ACTIVE" : "INACTIVE"} />
              {product.inventoryId ? (
                <StatusBadge status={product.stockStatus} />
              ) : (
                <Text variant="small" tone="muted">
                  No inventory tracked
                </Text>
              )}
            </Flex>
            <Text weight="bold" size="lg" className="truncate text-foreground font-semibold">
              {product.name}
            </Text>
            <Text variant="code" tone="muted">
              /{product.slug}
            </Text>
          </Stack>
        </Flex>

        <Grid cols="2" gap="3">
          <Item variant="muted" size="sm" className="rounded-xl">
            <ItemContent className="gap-0.5">
              <ItemDescription className="text-xs">Selling price</ItemDescription>
              <ItemTitle className="font-semibold tabular-nums text-brand-green">
                {formatMoney(product.price)}
              </ItemTitle>
            </ItemContent>
          </Item>

          <Item variant="muted" size="sm" className="rounded-xl">
            <ItemContent className="gap-0.5">
              <ItemDescription className="text-xs">Category</ItemDescription>
              <ItemTitle className="truncate font-semibold">{product.category.name}</ItemTitle>
            </ItemContent>
          </Item>

          <Item variant="muted" size="sm" className="rounded-xl">
            <ItemContent className="gap-0.5">
              <ItemDescription className="text-xs">Order limits (Min / Max)</ItemDescription>
              <ItemTitle className="font-semibold tabular-nums">
                {product.minimumOrderQuantity} / {product.maximumOrderQuantity}
              </ItemTitle>
            </ItemContent>
          </Item>

          <Item variant="muted" size="sm" className="rounded-xl">
            <ItemContent className="gap-0.5">
              <ItemDescription className="text-xs">Quantity on hand</ItemDescription>
              <ItemTitle className="font-semibold tabular-nums">
                {product.qtyOnHand ?? 0} units
              </ItemTitle>
            </ItemContent>
          </Item>
        </Grid>

        <Flex justify="between" className="border-t border-border/80 pt-3 text-xs text-muted-foreground">
          <span>Created: {formatDateTime(product.createdAt)}</span>
          <span>Updated: {formatDateTime(product.updatedAt)}</span>
        </Flex>
      </Stack>
    </AppModal>
  );
}

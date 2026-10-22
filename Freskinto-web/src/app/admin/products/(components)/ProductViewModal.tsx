"use client";

import { ExternalLink, Package, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/typography";
import { AppModal } from "@/components/shared/AppModal";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { ProductImage } from "@/components/shared/ProductImage";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { adminRoutes, publicRoutes } from "@/lib/routes/routes";
import { formatDateTime, formatMoney } from "@/lib/utils";
import type { IAdminProduct } from "@/services/products/types";
import { ReviewItem } from "./ProductReviewTab";

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
        <Flex as="span" align="center" gap="2.5">
          <Package className="size-5 text-primary" aria-hidden="true" />
          Product details
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
        <Flex align="start" gap="4">
          <ProductImage
            name={product.name}
            categoryName={product.category.name}
            sizes="96px"
            className="size-24 shrink-0 rounded-xl border border-border"
            imageClassName="p-2"
          />
          <Stack gap="1.5" className="min-w-0 flex-1">
            <Flex wrap align="center" gap="2">
              <StatusBadge status={product.isActive ? "ACTIVE" : "INACTIVE"} />
              {product.inventoryId ? (
                <StatusBadge status={product.stockStatus} />
              ) : (
                <Text as="span" tone="muted" className="text-fs-12">
                  No inventory tracked
                </Text>
              )}
            </Flex>
            <Text weight="semibold" className="truncate text-lg">
              {product.name}
            </Text>
            <Text tone="muted" family="mono" className="text-fs-12">
              /{product.slug}
            </Text>
          </Stack>
        </Flex>

        <Grid cols="2" gap="3">
          <ReviewItem
            label="Selling price"
            value={
              <Text as="span" tone="primary" numeric>
                {formatMoney(product.price)}
              </Text>
            }
          />
          <ReviewItem label="Category" value={product.category.name} />
          <ReviewItem label="Order limits (Min / Max)" value={`${product.minimumOrderQuantity} / ${product.maximumOrderQuantity}`} />
          <ReviewItem label="Quantity on hand" value={`${product.qtyOnHand ?? 0} units`} />
        </Grid>

        <Separator />
        <Flex align="center" justify="between" className="text-xs text-muted-foreground">
          <Text as="span" tone="inherit">
            Created: {formatDateTime(product.createdAt)}
          </Text>
          <Text as="span" tone="inherit">
            Updated: {formatDateTime(product.updatedAt)}
          </Text>
        </Flex>
      </Stack>
    </AppModal>
  );
}

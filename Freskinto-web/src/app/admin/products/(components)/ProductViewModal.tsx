"use client";

import { ExternalLink, Package, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AppModal } from "@/components/shared/AppModal";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { ProductImage } from "@/components/shared/ProductImage";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { adminRoutes, publicRoutes } from "@/lib/routes/routes";
import { formatDateTime, formatMoney } from "@/lib/utils";
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
        <div className="flex items-center gap-2.5">
          <Package className="size-5 text-brand-green" aria-hidden="true" />
          <span>Product details</span>
        </div>
      }
      description={`SKU: ${product.sku} · ${product.category.name}`}
      footer={
        <div className="flex w-full items-center justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex items-center gap-2">
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
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-5 py-1">
        <div className="flex items-start gap-4">
          <div className="size-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
            <ProductImage name={product.name} categoryName={product.category.name} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={product.isActive ? "ACTIVE" : "INACTIVE"} />
              {product.inventoryId ? (
                <StatusBadge status={product.stockStatus} />
              ) : (
                <span className="text-fs-12 text-muted-foreground">
                  No inventory tracked
                </span>
              )}
            </div>
            <p className="truncate font-semibold text-foreground text-lg">
              {product.name}
            </p>
            <p className="font-mono text-fs-12 text-muted-foreground">
              /{product.slug}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-muted/60 p-3">
            <p className="text-xs text-muted-foreground">Selling price</p>
            <p className="font-semibold tabular-nums text-brand-green">
              {formatMoney(product.price)}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-muted/60 p-3">
            <p className="text-xs text-muted-foreground">Category</p>
            <p className="truncate font-semibold text-foreground">{product.category.name}</p>
          </div>

          <div className="rounded-xl border border-border bg-muted/60 p-3">
            <p className="text-xs text-muted-foreground">Order limits (Min / Max)</p>
            <p className="font-semibold tabular-nums text-foreground">
              {product.minimumOrderQuantity} / {product.maximumOrderQuantity}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-muted/60 p-3">
            <p className="text-xs text-muted-foreground">Quantity on hand</p>
            <p className="font-semibold tabular-nums text-foreground">
              {product.qtyOnHand ?? 0} units
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border/80 pt-3 text-xs text-muted-foreground">
          <span>Created: {formatDateTime(product.createdAt)}</span>
          <span>Updated: {formatDateTime(product.updatedAt)}</span>
        </div>
      </div>
    </AppModal>
  );
}

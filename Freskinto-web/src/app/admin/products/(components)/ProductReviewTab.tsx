"use client";

import type { ReactNode } from "react";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from "@/components/ui/item";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { IAdminProduct } from "@/services/products/types";
import type { ProductFormInput } from "@/modules/zod/product.model";

export function ReviewItem({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <Item variant="muted" size="sm" className={cn("rounded-xl")}>
      <ItemContent className={cn("gap-0.5")}>
        <ItemDescription className={cn("text-xs")}>{label}</ItemDescription>
        <ItemTitle className={cn("font-semibold")}>{value || "—"}</ItemTitle>
      </ItemContent>
    </Item>
  );
}

export interface ProductReviewTabProps {
  values: Partial<ProductFormInput>;
  categoryLabel?: string;
  product?: IAdminProduct;
}

export function ProductReviewTab({ values, categoryLabel, product }: ProductReviewTabProps) {
  return (
    <FieldGroup>
      <ItemGroup className={cn("grid gap-3 sm:grid-cols-2")}>
        <ReviewItem label="Product name" value={values.name} />
        <ReviewItem label="Category" value={categoryLabel} />
        <ReviewItem label="Price" value={values.price ? formatMoney(String(values.price)) : undefined} />
        <ReviewItem
          label="Order quantity"
          value={`${String(values.minimumOrderQuantity ?? "")} – ${String(values.maximumOrderQuantity ?? "")}`}
        />
        {product && <ReviewItem label="SKU" value={product.sku} />}
        <ReviewItem label="Status" value={<StatusBadge status={values.isActive ? "ACTIVE" : "INACTIVE"} />} />
      </ItemGroup>
      {!product && (
        <FieldDescription>
          The SKU and URL slug are generated automatically. Add stock from Stock levels after creating the product.
        </FieldDescription>
      )}
    </FieldGroup>
  );
}

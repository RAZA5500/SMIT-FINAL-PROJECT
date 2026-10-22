"use client";

import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/typography";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatMoney } from "@/lib/utils";
import type { IAdminProduct } from "@/services/products/types";
import type { ProductFormInput } from "@/modules/zod/product.model";

export function ReviewItem({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <Box className="rounded-xl border border-border bg-muted/60 p-3">
      <Text tone="muted" className="text-xs">
        {label}
      </Text>
      <Text as="div" weight="semibold">
        {value || "—"}
      </Text>
    </Box>
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
      <Grid gap="3" className="sm:grid-cols-2">
        <ReviewItem label="Product name" value={values.name} />
        <ReviewItem label="Category" value={categoryLabel} />
        <ReviewItem label="Price" value={values.price ? formatMoney(String(values.price)) : undefined} />
        <ReviewItem
          label="Order quantity"
          value={`${String(values.minimumOrderQuantity ?? "")} – ${String(values.maximumOrderQuantity ?? "")}`}
        />
        {product && <ReviewItem label="SKU" value={product.sku} />}
        <ReviewItem label="Status" value={<StatusBadge status={values.isActive ? "ACTIVE" : "INACTIVE"} />} />
      </Grid>
      {!product && (
        <FieldDescription>
          The SKU and URL slug are generated automatically. Add stock from Stock levels after creating the product.
        </FieldDescription>
      )}
    </FieldGroup>
  );
}

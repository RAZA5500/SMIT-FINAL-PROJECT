"use client";

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
    <article
      className={cn(
        "group/product relative flex items-center gap-4 rounded-15 border border-border bg-card p-3 shadow-soft transition duration-300 hover:border-brand-green/30 hover:shadow-lift sm:p-4",
        className,
      )}
    >
      <div className="relative shrink-0">
        <ProductImage
          name={product.name}
          categoryName={product.category.name}
          sizes="112px"
          muted={product.stockStatus === "OUT_OF_STOCK"}
          className="size-24 rounded-xl sm:size-28"
          imageClassName="p-2"
        />
        <ProductBadges product={product} className="absolute top-1.5 left-1.5 scale-90" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="truncate text-fs-11 font-semibold tracking-wider text-muted-foreground uppercase">
          {product.category.name}
        </p>
        <h3 className="line-clamp-2 font-heading text-fs-16 leading-snug font-semibold">
          <TextLink
            href={publicRoutes.product(product.id)}
            tone="default"
            className="after:absolute after:inset-0 after:rounded-15 hover:no-underline focus-visible:ring-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/40"
          >
            {product.name}
          </TextLink>
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <Price amount={product.price} size="md" tone="brand" />
          <StatusBadge status={product.stockStatus} />
        </div>
      </div>

      <div className="relative z-10 w-32 shrink-0 sm:w-44">
        <ProductCartControl product={product} />
      </div>
    </article>
  );
}

"use client";

import { Flame, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/shared/Price";
import { ProductImage } from "@/components/shared/ProductImage";
import { TextLink } from "@/components/shared/TextLink";
import { isNewProduct } from "@/lib/merchandising";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/services/products/types";
import { ProductCartControl } from "./ProductCartControl";

interface ProductCardProps {
  product: IProduct;
  /** Pehli screen ke cards — image eager load */
  eager?: boolean;
  className?: string;
}

/** Stock / "new" signals over the packshot — sirf asli data (stockStatus, createdAt) */
export function ProductBadges({ product, className }: { product: IProduct; className?: string }) {
  const outOfStock = product.stockStatus === "OUT_OF_STOCK";
  const lowStock = product.stockStatus === "LOW_STOCK";
  const isNew = isNewProduct(product.createdAt);
  if (!outOfStock && !lowStock && !isNew) return null;

  return (
    <div className={cn("pointer-events-none flex flex-col items-start gap-1.5", className)}>
      {outOfStock ? (
        <Badge variant="destructive">Sold out</Badge>
      ) : lowStock ? (
        <Badge variant="warning">
          <Flame aria-hidden="true" />
          Low stock
        </Badge>
      ) : null}
      {isNew && !outOfStock && (
        <Badge variant="marigold">
          <Sparkles aria-hidden="true" />
          New in
        </Badge>
      )}
    </div>
  );
}

/** Shop shelf card — tactile lift on hover, packshot on a warm aisle tile, stretched name link, basket control */
export function ProductCard({ product, eager = false, className }: ProductCardProps) {
  return (
    <article
      className={cn(
        "group/product relative flex h-full flex-col overflow-hidden rounded-15 border border-border bg-card shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-green/30 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative">
        <ProductImage
          name={product.name}
          categoryName={product.category.name}
          eager={eager}
          muted={product.stockStatus === "OUT_OF_STOCK"}
          imageClassName="transition-transform duration-500 group-hover/product:scale-105"
        />
        <ProductBadges product={product} className="absolute top-3 left-3" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3.5 sm:p-4">
        <div className="flex flex-col gap-1">
          <p className="truncate text-fs-11 font-semibold tracking-wider text-muted-foreground uppercase">
            {product.category.name}
          </p>
          <h3 className="line-clamp-2 min-h-11 font-heading text-fs-16 leading-snug font-semibold">
            {/* Stretched link: poora card clickable, basket control upar (z-10) */}
            <TextLink
              href={publicRoutes.product(product.id)}
              tone="default"
              className="after:absolute after:inset-0 after:rounded-15 hover:no-underline focus-visible:ring-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/40"
            >
              {product.name}
            </TextLink>
          </h3>
        </div>

        <div className="mt-auto flex items-baseline justify-between gap-2">
          <Price amount={product.price} size="lg" tone="brand" />
          <span className="text-fs-12 text-muted-foreground">
            {product.minimumOrderQuantity > 1 ? `Min. ${product.minimumOrderQuantity}` : "each"}
          </span>
        </div>

        <div className="relative z-10">
          <ProductCartControl product={product} />
        </div>
      </div>
    </article>
  );
}

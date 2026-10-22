"use client";

import { Flame, Sparkles } from "lucide-react";
import Link from "next/link";
import { ProductImage } from "@/components/shared/ProductImage";
import { formatMoney } from "@/lib/format";
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

export function ProductCard({ product, eager = false, className }: ProductCardProps) {
  const outOfStock = product.stockStatus === "OUT_OF_STOCK";
  const lowStock = product.stockStatus === "LOW_STOCK";
  const isNew = isNewProduct(product.createdAt);

  return (
    <article
      className={cn(
        "group/card relative flex h-full flex-col rounded-2xl bg-card p-2 shadow-soft ring-1 ring-border transition duration-300 hover:-translate-y-0.5 hover:shadow-lift hover:ring-brand",
        className,
      )}
    >
      <div className="relative">
        <ProductImage
          name={product.name}
          categoryName={product.category.name}
          eager={eager}
          muted={outOfStock}
          className="rounded-xl transition duration-500 group-hover/card:[&_img]:scale-105"
          imageClassName="transition-transform duration-500"
        />
        <div className="pointer-events-none absolute top-2 left-2 flex flex-col items-start gap-1">
          {outOfStock ? (
            <span className="rounded-full bg-foreground/85 px-2.5 py-1 text-xs font-semibold text-background">
              Sold out
            </span>
          ) : lowStock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-tomato px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
              <Flame className="size-3.5" aria-hidden="true" />
              Low stock
            </span>
          ) : null}
          {isNew && !outOfStock && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-brand shadow-sm ring-1 ring-border">
              <Sparkles className="size-3.5" aria-hidden="true" />
              New
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-1.5 pt-3 pb-1">
        <p className="truncate text-xs font-medium text-muted-foreground">{product.category.name}</p>
        <h3 className="mt-0.5 line-clamp-2 min-h-10 text-sm leading-5 font-semibold text-foreground">
          {/* Stretched link: poora card clickable, button upar (z-10) */}
          <Link
            href={publicRoutes.product(product.id)}
            className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-3 focus-visible:after:ring-ring/40"
          >
            {product.name}
          </Link>
        </h3>
        <div className="mt-2 flex items-end justify-between gap-2">
          <p className="numeric font-heading text-lg leading-none font-bold text-brand">
            {formatMoney(product.price)}
          </p>
          {product.minimumOrderQuantity > 1 && (
            <p className="text-xs text-muted-foreground">Min. {product.minimumOrderQuantity}</p>
          )}
        </div>
        <div className="relative z-10 mt-3">
          <ProductCartControl product={product} />
        </div>
      </div>
    </article>
  );
}

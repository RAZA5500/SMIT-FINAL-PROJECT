"use client";

import { Check, Flame, Sparkles, Store, Truck } from "lucide-react";
import { AisleTag } from "@/components/shared/AisleTag";
import { PageBreadcrumbs, type Crumb } from "@/components/shared/PageBreadcrumbs";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { pluralize } from "@/lib/utils";
import type { CategoryNode } from "@/components/customer/shop/category-tree";
import type { ShopParamsApi } from "./useShopParams";

interface ShopHeaderProps {
  shop: ShopParamsApi;
  category: CategoryNode | undefined;
  parent: CategoryNode | undefined;
  aisleIndex: number | undefined;
  totalCount: number | undefined;
}

export function ShopHeader({ shop, category, parent, aisleIndex, totalCount }: ShopHeaderProps) {
  const crumbs: Crumb[] = [{ label: "Shop", href: shopUrl() }];
  if (parent) crumbs.push({ label: parent.name, href: shopUrl({ category: parent.id }) });
  if (category) crumbs.push({ label: category.name });

  const title = shop.q
    ? category
      ? `“${shop.q}” in ${category.name}`
      : `Search results for “${shop.q}”`
    : (category?.name ?? "Market Catalogue");

  const eyebrow = aisleIndex !== undefined
    ? <AisleTag index={aisleIndex} label={parent?.name ?? category?.name} />
    : "Freskinto Whole Market";

  return (
    <header className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card p-6 shadow-soft sm:p-8">
      <div className="flex flex-col gap-2">
        <PageBreadcrumbs root={{ label: "Home", href: publicRoutes.home }} items={crumbs} />

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <span className="text-fs-12 font-bold tracking-wider text-brand-green uppercase">
            {eyebrow}
          </span>
          <span className="hidden text-muted-foreground/60 sm:inline">·</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-0.5 text-fs-12 font-semibold text-brand-green-dark">
            <Truck className="size-3.5" />
            Free delivery on every order
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-0.5 text-fs-12 font-semibold text-emerald-700">
            <Store className="size-3.5" />
            Click &amp; collect in 1hr
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h1 className="font-heading text-fs-32 font-extrabold tracking-tight text-foreground sm:text-fs-40">
            {title}
          </h1>
          {totalCount !== undefined && (
            <span aria-live="polite" className="text-fs-13 font-semibold text-muted-foreground">
              Showing {pluralize(totalCount, "fresh item")}
            </span>
          )}
        </div>
      </div>

      {/* Quick 1-Tap Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
        <span className="text-fs-11 font-bold tracking-wider text-muted-foreground uppercase pr-1">
          Quick filters:
        </span>

        {/* All Items (reset min/max/stock) */}
        <button
          type="button"
          onClick={() => shop.update({ min: null, max: null, inStock: false })}
          className={`rounded-full px-3 py-1 text-fs-12 font-semibold transition-all ${
            !shop.min && !shop.max && !shop.inStock
              ? "bg-brand-green text-white shadow-soft"
              : "border border-border bg-card text-muted-foreground hover:border-brand-green/30 hover:text-foreground"
          }`}
        >
          All
        </button>

        {/* Under £5 */}
        <button
          type="button"
          onClick={() => shop.update({ min: null, max: 5 })}
          className={`rounded-full px-3 py-1 text-fs-12 font-semibold transition-all ${
            shop.max === 5 && !shop.min
              ? "bg-brand-green text-white shadow-soft"
              : "border border-border bg-card text-muted-foreground hover:border-brand-green/30 hover:text-foreground"
          }`}
        >
          Under £5
        </button>

        {/* Under £10 */}
        <button
          type="button"
          onClick={() => shop.update({ min: null, max: 10 })}
          className={`rounded-full px-3 py-1 text-fs-12 font-semibold transition-all ${
            shop.max === 10 && !shop.min
              ? "bg-brand-green text-white shadow-soft"
              : "border border-border bg-card text-muted-foreground hover:border-brand-green/30 hover:text-foreground"
          }`}
        >
          Under £10
        </button>

        {/* In Stock Only */}
        <button
          type="button"
          onClick={() => shop.update({ inStock: !shop.inStock })}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-fs-12 font-semibold transition-all ${
            shop.inStock
              ? "bg-emerald-600 text-white shadow-soft"
              : "border border-border bg-card text-muted-foreground hover:border-emerald-500/40 hover:text-foreground"
          }`}
        >
          <Check className={`size-3.5 ${shop.inStock ? "text-white" : "text-muted-foreground"}`} />
          In Stock Only
        </button>

        {/* Sort: Low to High */}
        <button
          type="button"
          onClick={() => shop.update({ sort: shop.sort === "price_asc" ? null : "price_asc" })}
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-fs-12 font-semibold transition-all ${
            shop.sort === "price_asc"
              ? "bg-brand-green text-white shadow-soft"
              : "border border-border bg-card text-muted-foreground hover:border-brand-green/30 hover:text-foreground"
          }`}
        >
          <Sparkles className="size-3 text-amber-500" />
          Price: Low to High
        </button>

        {/* Hot Deals / Newest */}
        <button
          type="button"
          onClick={() => shop.update({ sort: shop.sort === "newest" ? null : "newest" })}
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-fs-12 font-semibold transition-all ${
            shop.sort === "newest" || !shop.sort
              ? "bg-brand-green text-white shadow-soft"
              : "border border-border bg-card text-muted-foreground hover:border-brand-green/30 hover:text-foreground"
          }`}
        >
          <Flame className="size-3 text-amber-500" />
          Newest Harvest
        </button>
      </div>
    </header>
  );
}

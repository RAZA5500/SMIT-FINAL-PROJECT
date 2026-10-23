"use client";

import { ArrowDownWideNarrow, Check, Sparkles } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Toggle } from "@/components/ui/toggle";
import { Heading } from "@/components/ui/typography";
import { PageBreadcrumbs, type Crumb } from "@/components/shared/PageBreadcrumbs";
import { ProductImage } from "@/components/shared/ProductImage";
import type { CategoryNode } from "@/components/customer/shop/category-tree";
import { categoryTheme, productVisual } from "@/lib/merchandising";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { cn, pluralize } from "@/lib/utils";
import type { IProduct } from "@/services/products/types";
import type { ShopParamsApi } from "./useShopParams";

interface ShopHeaderProps {
  shop: ShopParamsApi;
  category: CategoryNode | undefined;
  parent: CategoryNode | undefined;
  totalCount: number | undefined;
  /** Abhi screen par jo products hain — unhi mein se teen banner mein tairte hain */
  products?: IProduct[];
}

/** Banner ke teen tairte products: bara beech mein, do chhote peeche (position + float delay) */
const SHOWCASE_SLOTS = [
  "right-[30%] -top-[6%] z-10 size-44",
  "right-[62%] top-[22%] size-30",
  "right-0 top-[26%] size-32",
];

/** Asli results ki teen photos (sirf woh jinki photo hai) — filter badalte hi nayi photos ubharti hain */
function Showcase({ products }: { products: IProduct[] }) {
  const picks = products.filter((product) => productVisual(product.name, product.category.name).image).slice(0, 3);
  if (picks.length === 0) return null;

  return (
    <Box aria-hidden="true" className="relative hidden h-44 w-96 shrink-0 md:block">
      {picks.map((product, index) => (
        <Box key={product.id} className={cn("absolute animate-pop-in", SHOWCASE_SLOTS[index])} style={{ animationDelay: `${index * 90}ms` }}>
          <Box className="size-full animate-float" style={{ animationDelay: `${index * -2.3}s` }}>
            <ProductImage
              name={product.name}
              categoryName={product.category.name}
              stage="bare"
              sizes="176px"
              eager
              className={cn("size-full", index > 0 && "opacity-90")}
              imageClassName="p-[8%]"
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function QuickFilter({
  pressed,
  onPress,
  children,
}: {
  pressed: boolean;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <Toggle variant="chip" size="sm" pressed={pressed} onPressedChange={onPress} className="h-8 shrink-0">
      {children}
    </Toggle>
  );
}

/** Shop ka sar: aisle ke rang ka banner (breadcrumbs, bari title, count, tairte products) + 1-tap quick filters */
export function ShopHeader({ shop, category, parent, totalCount, products = [] }: ShopHeaderProps) {
  const crumbs: Crumb[] = [{ label: "Shop", href: shopUrl() }];
  if (parent) crumbs.push({ label: parent.name, href: shopUrl({ category: parent.id }) });
  if (category) crumbs.push({ label: category.name });

  const title = shop.q
    ? category
      ? `“${shop.q}” in ${category.name}`
      : `Search results for “${shop.q}”`
    : (category?.name ?? "All products");

  const noPriceOrStock = shop.min === null && shop.max === null && !shop.inStock;
  const aura = categoryTheme(parent?.name ?? category?.name).aura;

  return (
    <Stack as="header" gap="5">
      <Card
        style={{ "--aura": aura } as CSSProperties}
        className="relative isolate flex-row items-center justify-between gap-6 rounded-[2.25rem] bg-[color-mix(in_oklab,var(--aura)_9%,var(--card))] px-6 py-7 sm:px-9 sm:py-6 dark:bg-[color-mix(in_oklab,var(--aura)_7%,var(--card))]"
      >
        <Box aria-hidden="true" className="aura absolute -top-1/2 right-[-8%] -z-10 size-[34rem] animate-drift-slow" />
        <Box aria-hidden="true" className="grain absolute inset-0 -z-10 opacity-[0.12] mix-blend-overlay" />
        <Stack gap="4" className="min-w-0">
          <PageBreadcrumbs root={{ label: "Home", href: publicRoutes.home }} items={crumbs} />
          <Heading as="h1" size="display" className="animate-fade-up">
            {title}
          </Heading>
          {totalCount !== undefined && (
            <Badge aria-live="polite" variant="brand" className="h-7 w-fit animate-fade-up px-3 text-fs-13 [animation-delay:90ms]">
              {pluralize(totalCount, "product")}
            </Badge>
          )}
        </Stack>
        <Showcase products={products} />
      </Card>

      <Flex align="center" gap="2" className="no-scrollbar -mx-1 overflow-x-auto px-1 py-0.5">
        <QuickFilter pressed={noPriceOrStock} onPress={() => shop.update({ min: null, max: null, inStock: false })}>
          All
        </QuickFilter>
        <QuickFilter pressed={shop.max === 5 && !shop.min} onPress={() => shop.update({ min: null, max: 5 })}>
          Under £5
        </QuickFilter>
        <QuickFilter pressed={shop.max === 10 && !shop.min} onPress={() => shop.update({ min: null, max: 10 })}>
          Under £10
        </QuickFilter>
        <QuickFilter pressed={shop.inStock} onPress={() => shop.update({ inStock: !shop.inStock })}>
          <Check aria-hidden="true" />
          In stock only
        </QuickFilter>
        <QuickFilter
          pressed={shop.sort === "price_asc"}
          onPress={() => shop.update({ sort: shop.sort === "price_asc" ? null : "price_asc" })}
        >
          <ArrowDownWideNarrow aria-hidden="true" />
          Price: low to high
        </QuickFilter>
        <QuickFilter
          pressed={shop.sort === "newest" || !shop.sort}
          onPress={() => shop.update({ sort: shop.sort === "newest" ? null : "newest" })}
        >
          <Sparkles aria-hidden="true" />
          Newest
        </QuickFilter>
      </Flex>
    </Stack>
  );
}

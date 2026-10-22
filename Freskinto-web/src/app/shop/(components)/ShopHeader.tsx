"use client";

import { ArrowDownWideNarrow, Check, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Flex, Stack } from "@/components/ui/flex";
import { Toggle } from "@/components/ui/toggle";
import { Heading, Text } from "@/components/ui/typography";
import { PageBreadcrumbs, type Crumb } from "@/components/shared/PageBreadcrumbs";
import type { CategoryNode } from "@/components/customer/shop/category-tree";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { pluralize } from "@/lib/utils";
import type { ShopParamsApi } from "./useShopParams";

interface ShopHeaderProps {
  shop: ShopParamsApi;
  category: CategoryNode | undefined;
  parent: CategoryNode | undefined;
  totalCount: number | undefined;
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

/** Shop ka sar: breadcrumbs, title + count, aur 1-tap quick filters */
export function ShopHeader({ shop, category, parent, totalCount }: ShopHeaderProps) {
  const crumbs: Crumb[] = [{ label: "Shop", href: shopUrl() }];
  if (parent) crumbs.push({ label: parent.name, href: shopUrl({ category: parent.id }) });
  if (category) crumbs.push({ label: category.name });

  const title = shop.q
    ? category
      ? `“${shop.q}” in ${category.name}`
      : `Search results for “${shop.q}”`
    : (category?.name ?? "All products");

  const noPriceOrStock = shop.min === null && shop.max === null && !shop.inStock;

  return (
    <Stack as="header" gap="5">
      <Stack gap="3">
        <PageBreadcrumbs root={{ label: "Home", href: publicRoutes.home }} items={crumbs} />
        <Flex direction="col" gap="1" className="sm:flex-row sm:items-end sm:justify-between">
          <Heading as="h1" size="1">
            {title}
          </Heading>
          {totalCount !== undefined && (
            <Text aria-live="polite" tone="muted" className="text-fs-13">
              {pluralize(totalCount, "product")}
            </Text>
          )}
        </Flex>
      </Stack>

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

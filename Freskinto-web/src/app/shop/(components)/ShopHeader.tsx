"use client";

import { ArrowDownWideNarrow, Check, Sparkles, Store, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { Heading, Text } from "@/components/ui/typography";
import { AisleTag } from "@/components/shared/AisleTag";
import { PageBreadcrumbs, type Crumb } from "@/components/shared/PageBreadcrumbs";
import type { CategoryNode } from "@/components/customer/shop/category-tree";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { pluralize } from "@/lib/utils";
import type { ShopParamsApi } from "./useShopParams";

interface ShopHeaderProps {
  shop: ShopParamsApi;
  category: CategoryNode | undefined;
  parent: CategoryNode | undefined;
  aisleIndex: number | undefined;
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

/** Shop ka sar: breadcrumbs, aisle sticker, bara title + count, aur 1-tap quick filters */
export function ShopHeader({ shop, category, parent, aisleIndex, totalCount }: ShopHeaderProps) {
  const crumbs: Crumb[] = [{ label: "Shop", href: shopUrl() }];
  if (parent) crumbs.push({ label: parent.name, href: shopUrl({ category: parent.id }) });
  if (category) crumbs.push({ label: category.name });

  const title = shop.q
    ? category
      ? `“${shop.q}” in ${category.name}`
      : `Search results for “${shop.q}”`
    : (category?.name ?? "Market Catalogue");

  const noPriceOrStock = shop.min === null && shop.max === null && !shop.inStock;

  return (
    <Stack
      as="header"
      gap="5"
      className="relative isolate overflow-hidden rounded-4xl border-2 border-border bg-card p-6 sm:p-8"
    >
      <Box aria-hidden="true" className="absolute -top-20 -right-16 -z-10 size-64 rounded-full bg-lime/40 blur-3xl" />
      <Box aria-hidden="true" className="absolute -bottom-24 left-1/3 -z-10 size-64 rounded-full bg-primary/15 blur-3xl" />

      <Stack gap="3">
        <PageBreadcrumbs root={{ label: "Home", href: publicRoutes.home }} items={crumbs} />
        <Flex wrap align="center" gap="2">
          {aisleIndex !== undefined ? (
            <AisleTag index={aisleIndex} label={parent?.name ?? category?.name} />
          ) : (
            <Badge variant="sticker">Freskinto whole market</Badge>
          )}
          <Badge variant="lime">
            <Truck aria-hidden="true" />
            Free delivery on every order
          </Badge>
          <Badge variant="outline">
            <Store aria-hidden="true" />
            Click &amp; collect
          </Badge>
        </Flex>
        <Flex direction="col" gap="2" className="sm:flex-row sm:items-end sm:justify-between">
          <Heading as="h1" size="display">
            {title}
          </Heading>
          {totalCount !== undefined && (
            <Text aria-live="polite" tone="muted" weight="semibold" className="text-fs-13">
              Showing {pluralize(totalCount, "fresh item")}
            </Text>
          )}
        </Flex>
      </Stack>

      <Separator />

      <Flex align="center" gap="2" className="no-scrollbar -mx-1 overflow-x-auto px-1 py-0.5">
        <Text as="span" variant="eyebrow" tone="muted" className="shrink-0 pr-1">
          Quick filters:
        </Text>
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
          In Stock Only
        </QuickFilter>
        <QuickFilter
          pressed={shop.sort === "price_asc"}
          onPress={() => shop.update({ sort: shop.sort === "price_asc" ? null : "price_asc" })}
        >
          <ArrowDownWideNarrow aria-hidden="true" />
          Price: Low to High
        </QuickFilter>
        <QuickFilter
          pressed={shop.sort === "newest" || !shop.sort}
          onPress={() => shop.update({ sort: shop.sort === "newest" ? null : "newest" })}
        >
          <Sparkles aria-hidden="true" />
          Newest Harvest
        </QuickFilter>
      </Flex>
    </Stack>
  );
}

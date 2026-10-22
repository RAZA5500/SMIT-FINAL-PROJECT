"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
import { categoryTheme, TILE_CLASSES } from "@/lib/merchandising";
import { customerRoutes, publicRoutes, shopUrl } from "@/lib/routes/routes";
import { cn, pluralize } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useAisles } from "../shop/use-aisles";

const MENU_AISLE_LIMIT = 10;
const NAV_LINK = "h-9 px-3 font-medium";

/** Desktop primary nav — "Aisles" dropdown (shadcn NavigationMenu) + Shop / Orders links */
export function AislesMenu({ pathname }: { pathname: string }) {
  const { aisles, isLoading } = useAisles();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isCustomer = useAuthStore((state) => state.user?.role === "CUSTOMER");
  const onShop = pathname.startsWith(publicRoutes.shop) || pathname.startsWith("/products");
  const onOrders = pathname.startsWith(customerRoutes.orders);

  return (
    <NavigationMenu aria-label="Primary" className="hidden lg:flex">
      <NavigationMenuList className="gap-0.5">
        <NavigationMenuItem>
          <NavigationMenuTrigger className={NAV_LINK}>Aisles</NavigationMenuTrigger>
          <NavigationMenuContent className="w-lg p-2">
            <Grid as="ul" cols="2" gap="0.5">
              {isLoading &&
                Array.from({ length: 6 }, (_, index) => (
                  <Box as="li" key={index} className="p-2">
                    <Skeleton className="h-8 w-full" />
                  </Box>
                ))}
              {aisles.slice(0, MENU_AISLE_LIMIT).map((aisle) => {
                const Icon = categoryTheme(aisle.name).icon;
                return (
                  <Box as="li" key={aisle.id}>
                    <NavigationMenuLink render={<Link href={shopUrl({ category: aisle.id })} />} className="gap-3 p-2">
                      <Flex
                        as="span"
                        align="center"
                        justify="center"
                        aria-hidden="true"
                        className={cn("size-8 shrink-0 rounded-md", TILE_CLASSES.chip)}
                      >
                        <Icon className="size-4" />
                      </Flex>
                      <Stack as="span" gap="0.5" className="min-w-0">
                        <Text as="span" weight="medium" className="truncate">
                          {aisle.name}
                        </Text>
                        {aisle.children.length > 0 && (
                          <Text as="span" tone="muted" className="text-fs-12">
                            {pluralize(aisle.children.length, "sub-aisle")}
                          </Text>
                        )}
                      </Stack>
                    </NavigationMenuLink>
                  </Box>
                );
              })}
            </Grid>
            <Separator className="my-2" />
            <NavigationMenuLink render={<Link href={publicRoutes.shop} />} className="justify-between p-2 font-medium">
              Browse all products
              <ArrowRight aria-hidden="true" />
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            render={<Link href={publicRoutes.shop} />}
            active={onShop}
            className={cn(navigationMenuTriggerStyle(), NAV_LINK)}
          >
            Shop
          </NavigationMenuLink>
        </NavigationMenuItem>
        {hasHydrated && isCustomer && (
          <NavigationMenuItem>
            <NavigationMenuLink
              render={<Link href={customerRoutes.orders} />}
              active={onOrders}
              className={cn(navigationMenuTriggerStyle(), NAV_LINK)}
            >
              Orders
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

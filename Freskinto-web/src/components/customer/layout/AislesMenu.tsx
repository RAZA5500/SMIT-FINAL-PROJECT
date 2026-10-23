"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Box } from "@/components/ui/box";
import { Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { HoverIndicator } from "@/components/ui/hover-indicator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
import { AisleBadge } from "@/components/shared/AisleBadge";
import { customerRoutes, publicRoutes, shopUrl } from "@/lib/routes/routes";
import { cn, pluralize } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useAisles } from "../shop/use-aisles";

const MENU_AISLE_LIMIT = 9;
const NAV_LINK = "h-10 bg-transparent px-4 font-semibold hover:bg-transparent focus:bg-transparent data-active:bg-transparent data-popup-open:bg-transparent";

/**
 * Desktop primary nav — links ke peeche hover par ek pill slide karti hai (HoverIndicator);
 * "Aisles" mega menu mein har aisle apni photo aur rang ke saath.
 */
export function AislesMenu({ pathname, className }: { pathname: string; className?: string }) {
  const { aisles, isLoading } = useAisles();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isCustomer = useAuthStore((state) => state.user?.role === "CUSTOMER");
  const onHome = pathname === publicRoutes.home;
  const onShop = pathname.startsWith(publicRoutes.shop) || pathname.startsWith("/products");
  const onOrders = pathname.startsWith(customerRoutes.orders);

  const links = [
    { label: "Home", href: publicRoutes.home, active: onHome },
    { label: "Shop", href: publicRoutes.shop, active: onShop },
    ...(hasHydrated && isCustomer ? [{ label: "Orders", href: customerRoutes.orders, active: onOrders }] : []),
  ];

  return (
    <NavigationMenu aria-label="Primary" className={cn("hidden lg:flex", className)}>
      <HoverIndicator activeKey={pathname} indicatorClassName="bg-foreground/[0.07]">
        <NavigationMenuList className="gap-0.5">
          {links.slice(0, 2).map((link) => (
            <NavigationMenuItem key={link.href} data-indicator-item="">
              <NavigationMenuLink
                render={<Link href={link.href} aria-current={link.active ? "page" : undefined} />}
                active={link.active}
                className={cn(navigationMenuTriggerStyle(), NAV_LINK, !link.active && "text-muted-foreground hover:text-foreground")}
              >
                {link.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem data-indicator-item="">
            <NavigationMenuTrigger className={cn(NAV_LINK, "text-muted-foreground hover:text-foreground data-popup-open:text-foreground")}>
              Aisles
            </NavigationMenuTrigger>
            <NavigationMenuContent className="w-[42rem] p-3">
              <Grid as="ul" cols="3" gap="1">
                {isLoading &&
                  Array.from({ length: 6 }, (_, index) => (
                    <Box as="li" key={index} className="p-2">
                      <Skeleton className="h-11 w-full" />
                    </Box>
                  ))}
                {aisles.slice(0, MENU_AISLE_LIMIT).map((aisle) => (
                  <Box as="li" key={aisle.id}>
                    <NavigationMenuLink
                      render={<Link href={shopUrl({ category: aisle.id })} />}
                      className="group/aisle gap-3 p-2.5"
                    >
                      <AisleBadge
                        name={aisle.name}
                        className="transition-transform duration-500 ease-spring group-hover/aisle:scale-110 group-hover/aisle:-rotate-6"
                      />
                      <Stack as="span" gap="0.5" className="min-w-0">
                        <Text as="span" weight="semibold" className="truncate">
                          {aisle.name}
                        </Text>
                        <Text as="span" tone="muted" className="text-fs-12">
                          {aisle.children.length > 0 ? pluralize(aisle.children.length, "sub-aisle") : "Shop the aisle"}
                        </Text>
                      </Stack>
                    </NavigationMenuLink>
                  </Box>
                ))}
              </Grid>
              <NavigationMenuLink
                render={<Link href={publicRoutes.shop} />}
                className="group/all mt-2 justify-between rounded-2xl bg-fresh-soft px-4 py-3 font-semibold"
              >
                Browse every product
                <ArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover/all:translate-x-1" />
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {links.slice(2).map((link) => (
            <NavigationMenuItem key={link.href} data-indicator-item="">
              <NavigationMenuLink
                render={<Link href={link.href} aria-current={link.active ? "page" : undefined} />}
                active={link.active}
                className={cn(navigationMenuTriggerStyle(), NAV_LINK, !link.active && "text-muted-foreground hover:text-foreground")}
              >
                {link.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </HoverIndicator>
    </NavigationMenu>
  );
}

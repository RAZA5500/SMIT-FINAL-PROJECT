"use client";

import { ArrowUpRight } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Heading, Text } from "@/components/ui/typography";
import { categoryTheme, TONE_CLASSES } from "@/lib/merchandising";
import { customerRoutes, publicRoutes, shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { aisleNumber } from "@/components/shared/AisleTag";
import { useAisles } from "../shop/use-aisles";

const MENU_AISLE_LIMIT = 9;

/** Desktop primary nav — "Aisles" mega menu (shadcn NavigationMenu) + Shop / Orders links */
export function AislesMenu({ pathname }: { pathname: string }) {
  const { aisles, isLoading } = useAisles();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isCustomer = useAuthStore((state) => state.user?.role === "CUSTOMER");
  const onShop = pathname.startsWith(publicRoutes.shop) || pathname.startsWith("/products");
  const onOrders = pathname.startsWith(customerRoutes.orders);

  return (
    <NavigationMenu aria-label="Primary" className="hidden lg:flex">
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-10 rounded-full px-4 font-semibold">Aisles</NavigationMenuTrigger>
          <NavigationMenuContent className="w-2xl p-3">
            <Grid cols="12" gap="3">
              <Stack
                justify="between"
                gap="4"
                className="col-span-4 rounded-xl bg-night p-5 text-night-foreground"
              >
                <Stack gap="2">
                  <Text variant="eyebrow" tone="inherit" className="text-lime">
                    Today at the market
                  </Text>
                  <Heading as="p" size="3" tone="night">
                    Every aisle, delivered free.
                  </Heading>
                </Stack>
                <NavigationMenuLink
                  render={<Link href={publicRoutes.shop} />}
                  className="w-fit rounded-full bg-lime px-4 py-2 font-bold text-lime-foreground hover:bg-lime/90 focus:bg-lime/90"
                >
                  Shop everything
                  <ArrowUpRight aria-hidden="true" />
                </NavigationMenuLink>
              </Stack>
              <Grid as="ul" cols="2" gap="1" className="col-span-8 content-start">
                {isLoading &&
                  Array.from({ length: 6 }, (_, index) => (
                    <Box as="li" key={index} className="p-2">
                      <Skeleton className="h-9 w-full" />
                    </Box>
                  ))}
                {aisles.slice(0, MENU_AISLE_LIMIT).map((aisle, index) => {
                  const visual = categoryTheme(aisle.name);
                  const Icon = visual.icon;
                  return (
                    <Box as="li" key={aisle.id}>
                      <NavigationMenuLink
                        render={<Link href={shopUrl({ category: aisle.id })} />}
                        className="group/aisle gap-3 rounded-xl p-2"
                      >
                        <Flex
                          as="span"
                          align="center"
                          justify="center"
                          aria-hidden="true"
                          className={cn(
                            "size-10 shrink-0 rounded-xl transition-transform group-hover/aisle:-rotate-6",
                            TONE_CLASSES[visual.tone].chip,
                          )}
                        >
                          <Icon className="size-5" />
                        </Flex>
                        <Stack as="span" gap="0.5" className="min-w-0">
                          <Text as="span" weight="semibold" className="truncate">
                            {aisle.name}
                          </Text>
                          <Text as="span" tone="muted" family="mono" className="text-fs-11">
                            Aisle {aisleNumber(index)}
                            {aisle.children.length > 0 && ` · ${aisle.children.length} sub-aisles`}
                          </Text>
                        </Stack>
                      </NavigationMenuLink>
                    </Box>
                  );
                })}
              </Grid>
            </Grid>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            render={<Link href={publicRoutes.shop} />}
            active={onShop}
            className={cn(navigationMenuTriggerStyle(), "h-10 rounded-full px-4 font-semibold")}
          >
            Shop
          </NavigationMenuLink>
        </NavigationMenuItem>
        {hasHydrated && isCustomer && (
          <NavigationMenuItem>
            <NavigationMenuLink
              render={<Link href={customerRoutes.orders} />}
              active={onOrders}
              className={cn(navigationMenuTriggerStyle(), "h-10 rounded-full px-4 font-semibold")}
            >
              Orders
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

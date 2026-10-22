"use client";

import { ArrowRight, LayoutGrid } from "lucide-react";
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
} from "@/components/ui/navigation-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
import { aisleNumber } from "@/components/shared/AisleTag";
import { categoryTheme } from "@/lib/merchandising";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useAisles } from "../shop/use-aisles";

/** Header "Aisles" mega menu — store directory board ki tarah numbered aisles */
export function AislesMenu({ className }: { className?: string }) {
  const { aisles, isLoading } = useAisles();

  return (
    <NavigationMenu className={cn(className)}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={cn("h-10 rounded-xl px-4 font-semibold text-foreground hover:text-brand-green hover:bg-brand-soft transition-colors")}>
            <LayoutGrid aria-hidden="true" className={cn("mr-1.5 size-4 text-brand-green")} />
            Aisles
          </NavigationMenuTrigger>
          <NavigationMenuContent className={cn("w-screen max-w-2xl p-3")}>
            <Stack gap="3">
              <Flex align="center" justify="between" gap="3" className={cn("px-2 pt-1")}>
                <Text variant="eyebrow">Store directory</Text>
                <NavigationMenuLink
                  closeOnClick
                  render={<Link href={shopUrl()} />}
                  className={cn("gap-1.5 px-2 py-1 font-semibold text-brand-green hover:text-brand-green-dark")}
                >
                  All products
                  <ArrowRight aria-hidden="true" />
                </NavigationMenuLink>
              </Flex>
              {isLoading ? (
                <Grid cols="2" gap="2">
                  {Array.from({ length: 6 }, (_, i) => (
                    <Skeleton key={i} className={cn("h-14 rounded-xl")} />
                  ))}
                </Grid>
              ) : aisles.length === 0 ? (
                <Text tone="muted" className={cn("px-2 pb-2")}>
                  Aisles are being stocked — check back soon.
                </Text>
              ) : (
                <Grid as="ul" cols="2" gap="1">
                  {aisles.map((aisle, index) => {
                    const Icon = categoryTheme(aisle.name).icon;
                    return (
                      <Box as="li" key={aisle.id}>
                        <NavigationMenuLink
                          closeOnClick
                          render={<Link href={shopUrl({ category: aisle.id })} />}
                          className={cn("items-start gap-3 rounded-xl p-2.5")}
                        >
                          <Flex
                            as="span"
                            align="center"
                            justify="center"
                            className={cn("size-10 shrink-0 rounded-lg border border-primary/20 bg-icon-green text-brand-green [&_svg]:size-5")}
                          >
                            <Icon aria-hidden="true" />
                          </Flex>
                          <Stack as="span" gap="1" className={cn("min-w-0")}>
                            <Flex as="span" align="baseline" gap="2">
                              <Text as="span" variant="small" tone="muted" className={cn("font-medium")}>
                                {aisleNumber(index)}
                              </Text>
                              <Text as="span" weight="semibold" className={cn("truncate")}>
                                {aisle.name}
                              </Text>
                            </Flex>
                            {aisle.children.length > 0 && (
                              <Text as="span" variant="small" tone="muted" className={cn("line-clamp-1")}>
                                {aisle.children.map((child) => child.name).join(" · ")}
                              </Text>
                            )}
                          </Stack>
                        </NavigationMenuLink>
                      </Box>
                    );
                  })}
                </Grid>
              )}
            </Stack>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

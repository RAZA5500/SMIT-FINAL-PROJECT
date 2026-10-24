"use client";

import { Home, Package, ShoppingBag, Store, UserRound, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { HoverIndicator } from "@/components/ui/hover-indicator";
import { Text } from "@/components/ui/typography";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn, pluralize } from "@/lib/utils";
import { useGetCart } from "@/services/cart/queries";
import { useAuthStore } from "@/stores/auth-store";
import { useShopStore } from "@/stores/shop-store";

/** Page transitions mein mobile tab bar apni jagah tiki rehti hai */
const ANCHOR = { viewTransitionName: "mobile-tab-bar" } as CSSProperties;

const TAB_CLASS =
  "relative z-10 h-14 flex-col gap-0.5 rounded-full px-0 text-fs-11 font-semibold hover:bg-transparent active:scale-90";

function TabLink({ href, icon: Icon, label, active }: { href: string; icon: LucideIcon; label: string; active: boolean }) {
  return (
    <Box data-indicator-item="" className="rounded-full">
      <Button
        variant="ghost"
        nativeButton={false}
        render={<Link href={href} aria-current={active ? "page" : undefined} />}
        className={cn(TAB_CLASS, "w-full", active ? "text-[#06100b]" : "text-muted-foreground")}
      >
        <Icon aria-hidden="true" className="size-5" strokeWidth={active ? 2.4 : 2} />
        {label}
      </Button>
    </Box>
  );
}

/**
 * Phone par tairti glass tab bar — active tab ke peeche gradient pill slide karti hai, basket ka
 * count uchhalta hai (lg se upar hidden). `data-basket-target`: udti hui products yahan aati hain.
 */
export function MobileTabBar() {
  const pathname = usePathname();
  const setCartOpen = useShopStore((state) => state.setCartOpen);
  const token = useAuthStore((state) => state.token);
  const { data: cart } = useGetCart();
  const count = cart?.itemCount ?? 0;

  return (
    <Box as="nav" aria-label="Quick navigation" style={ANCHOR} className="pb-safe fixed inset-x-3 bottom-3 z-40 lg:hidden">
      <HoverIndicator
        activeKey={pathname}
        className="glass rounded-full border border-glass-border p-1"
        indicatorClassName="bg-fresh shadow-glow"
      >
        <Grid cols="5" align="center">
          <TabLink href={publicRoutes.home} icon={Home} label="Home" active={pathname === publicRoutes.home} />
          <TabLink
            href={publicRoutes.shop}
            icon={Store}
            label="Shop"
            active={pathname.startsWith(publicRoutes.shop) || pathname.startsWith("/products")}
          />
          <Box className="rounded-full">
            <Button
              variant="ghost"
              data-basket-target=""
              onClick={() => setCartOpen(true)}
              aria-label={`Basket, ${pluralize(count, "item")}`}
              className={cn(TAB_CLASS, "w-full text-muted-foreground")}
            >
              <Box as="span" className="relative">
                <ShoppingBag aria-hidden="true" className="size-5" />
                {count > 0 && (
                  <Flex
                    as="span"
                    key={count}
                    align="center"
                    justify="center"
                    className="absolute -top-1.5 -right-2.5 h-4.5 min-w-4.5 animate-bump rounded-full bg-[#06100b] px-1 text-[0.625rem] font-bold text-white tabular-nums dark:bg-brand dark:text-[#06100b]"
                  >
                    {count}
                  </Flex>
                )}
              </Box>
              <Text as="span" tone="inherit" aria-hidden="true">
                Basket
              </Text>
            </Button>
          </Box>
          <TabLink href={customerRoutes.orders} icon={Package} label="Orders" active={pathname.startsWith(customerRoutes.orders)} />
          <TabLink
            href={token ? customerRoutes.profile : publicRoutes.login}
            icon={UserRound}
            label={token ? "Account" : "Sign in"}
            active={pathname.startsWith(customerRoutes.profile) || pathname.startsWith(customerRoutes.addresses)}
          />
        </Grid>
      </HoverIndicator>
    </Box>
  );
}

"use client";

import { Home, Package, ShoppingBag, Store, UserRound, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/typography";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn, pluralize } from "@/lib/utils";
import { useGetCart } from "@/services/cart/queries";
import { useAuthStore } from "@/stores/auth-store";
import { useShopStore } from "@/stores/shop-store";

const TAB_CLASS = "relative h-14 flex-col gap-1 rounded-none px-0 text-fs-11 font-medium hover:bg-transparent";

function TabIcon({ icon: Icon, children }: { icon: LucideIcon; children?: ReactNode }) {
  return (
    <Box as="span" className="relative">
      <Icon aria-hidden="true" className="size-5" />
      {children}
    </Box>
  );
}

function TabLink({ href, icon, label, active }: { href: string; icon: LucideIcon; label: string; active: boolean }) {
  return (
    <Button
      variant="ghost"
      nativeButton={false}
      render={<Link href={href} aria-current={active ? "page" : undefined} />}
      className={cn(TAB_CLASS, active ? "text-primary hover:text-primary" : "text-muted-foreground")}
    >
      <TabIcon icon={icon} />
      {label}
    </Button>
  );
}

/** Phone par bottom tab bar — hairline border, indigo active tab (lg se upar hidden) */
export function MobileTabBar() {
  const pathname = usePathname();
  const setCartOpen = useShopStore((state) => state.setCartOpen);
  const token = useAuthStore((state) => state.token);
  const { data: cart } = useGetCart();
  const count = cart?.itemCount ?? 0;

  return (
    <Box as="nav" aria-label="Quick navigation" className="glass pb-safe fixed inset-x-0 bottom-0 z-40 border-t lg:hidden">
      <Grid cols="5" align="center">
        <TabLink href={publicRoutes.home} icon={Home} label="Home" active={pathname === publicRoutes.home} />
        <TabLink
          href={publicRoutes.shop}
          icon={Store}
          label="Shop"
          active={pathname.startsWith(publicRoutes.shop) || pathname.startsWith("/products")}
        />
        <Button
          variant="ghost"
          onClick={() => setCartOpen(true)}
          aria-label={`Basket, ${pluralize(count, "item")}`}
          className={cn(TAB_CLASS, "text-muted-foreground")}
        >
          <TabIcon icon={ShoppingBag}>
            {count > 0 && (
              <Badge
                key={count}
                className="absolute -top-2 -right-3 h-4.5 min-w-4.5 animate-bump rounded-full px-1 text-fs-11 tabular-nums"
              >
                {count}
              </Badge>
            )}
          </TabIcon>
          <Text as="span" tone="inherit" aria-hidden="true">
            Basket
          </Text>
        </Button>
        <TabLink
          href={customerRoutes.orders}
          icon={Package}
          label="Orders"
          active={pathname.startsWith(customerRoutes.orders)}
        />
        <TabLink
          href={token ? customerRoutes.profile : publicRoutes.login}
          icon={UserRound}
          label={token ? "Account" : "Sign in"}
          active={pathname.startsWith(customerRoutes.profile) || pathname.startsWith(customerRoutes.addresses)}
        />
      </Grid>
    </Box>
  );
}

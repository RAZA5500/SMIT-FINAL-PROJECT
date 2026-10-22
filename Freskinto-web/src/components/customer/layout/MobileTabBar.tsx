"use client";

import { Home, Package, ShoppingBasket, Store, UserRound, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn, pluralize } from "@/lib/utils";
import { useGetCart } from "@/services/cart/queries";
import { useAuthStore } from "@/stores/auth-store";
import { useShopStore } from "@/stores/shop-store";

const TAB_CLASS = "h-14 flex-col gap-0.5 rounded-xl px-0 text-fs-11 font-medium hover:bg-transparent";

function TabLink({ href, icon: Icon, label, active }: { href: string; icon: LucideIcon; label: string; active: boolean }) {
  return (
    <Button
      variant="ghost"
      nativeButton={false}
      render={<Link href={href} aria-current={active ? "page" : undefined} />}
      className={cn(TAB_CLASS, active ? "font-bold text-primary" : "text-muted-foreground")}
    >
      <Icon aria-hidden="true" strokeWidth={active ? 2.4 : 2} className="size-5" />
      {label}
      <Box
        as="span"
        aria-hidden="true"
        className={cn("size-1 rounded-full bg-tangerine transition-opacity", active ? "opacity-100" : "opacity-0")}
      />
    </Button>
  );
}

/** Phone par floating pill navigation — beech mein uthi hui tangerine basket (lg se upar hidden) */
export function MobileTabBar() {
  const pathname = usePathname();
  const setCartOpen = useShopStore((state) => state.setCartOpen);
  const token = useAuthStore((state) => state.token);
  const { data: cart } = useGetCart();
  const count = cart?.itemCount ?? 0;

  return (
    <Box as="nav" aria-label="Quick navigation" className="pb-safe fixed inset-x-3 bottom-3 z-40 lg:hidden">
      <Grid cols="5" align="center" className="glass rounded-3xl border border-border/70 px-1 shadow-lift">
        <TabLink href={publicRoutes.home} icon={Home} label="Home" active={pathname === publicRoutes.home} />
        <TabLink
          href={publicRoutes.shop}
          icon={Store}
          label="Shop"
          active={pathname.startsWith(publicRoutes.shop) || pathname.startsWith("/products")}
        />
        <Flex justify="center">
          <Button
            variant="cta"
            size="icon-lg"
            onClick={() => setCartOpen(true)}
            aria-label={`Basket, ${pluralize(count, "item")}`}
            className="relative -mt-7 size-14"
          >
            <ShoppingBasket aria-hidden="true" className="size-6" />
            {count > 0 && (
              <Badge
                key={count}
                variant="night"
                className="absolute -top-1.5 -right-1.5 h-5 min-w-5 animate-bump px-1 text-fs-11 tabular-nums ring-2 ring-background"
              >
                {count}
              </Badge>
            )}
          </Button>
        </Flex>
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

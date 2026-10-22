"use client";

import { House, LayoutGrid, Package, ShoppingBasket, UserRound, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { pluralize } from "@/lib/format";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetCart } from "@/services/cart/queries";
import { useUiStore } from "@/stores/ui-store";
import { isCheckoutPath } from "./checkout-path";

const TAB_CLASS = "h-auto flex-col gap-1 rounded-none py-2 text-xs font-medium hover:bg-transparent";

function TabLink({ href, icon: Icon, label, active }: { href: string; icon: LucideIcon; label: string; active: boolean }) {
  return (
    <ButtonLink
      href={href}
      variant="ghost"
      aria-current={active ? "page" : undefined}
      className={cn(TAB_CLASS, active ? "text-brand hover:text-brand" : "text-muted-foreground")}
    >
      <Icon aria-hidden="true" strokeWidth={active ? 2.4 : 2} className={cn("size-5")} />
      {label}
    </ButtonLink>
  );
}

/** Phone par app jaisa bottom navigation — basket hamesha ek tap door */
export function MobileTabBar() {
  const pathname = usePathname();
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const setMenuOpen = useUiStore((state) => state.setMenuOpen);
  const { data: cart } = useGetCart();
  const count = cart?.itemCount ?? 0;

  // Checkout band rehta hai (header/footer bhi checkout mode mein) — bahar jaane ke raste nahi
  if (isCheckoutPath(pathname)) return null;

  return (
    <Box
      as="nav"
      aria-label="Quick navigation"
      className={cn("fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-safe backdrop-blur md:hidden")}
    >
      <Grid cols="5">
        <TabLink href={publicRoutes.home} icon={House} label="Home" active={pathname === publicRoutes.home} />
        <TabLink href={publicRoutes.shop} icon={LayoutGrid} label="Shop" active={pathname === publicRoutes.shop} />
        <Button
          variant="ghost"
          onClick={() => setCartOpen(true)}
          aria-label={`Basket, ${pluralize(count, "item")}`}
          className={cn(TAB_CLASS, "text-muted-foreground")}
        >
          <Box as="span" className={cn("relative inline-flex")}>
            <ShoppingBasket aria-hidden="true" className={cn("size-5")} />
            {count > 0 && (
              <Badge key={count} className={cn("absolute -top-2 -right-3 h-4.5 min-w-4.5 animate-bump px-1 tabular-nums")}>
                {count}
              </Badge>
            )}
          </Box>
          <Text as="span" variant="small" weight="medium">
            Basket
          </Text>
        </Button>
        <TabLink
          href={customerRoutes.orders}
          icon={Package}
          label="Orders"
          active={pathname.startsWith(customerRoutes.orders)}
        />
        <Button variant="ghost" onClick={() => setMenuOpen(true)} className={cn(TAB_CLASS, "text-muted-foreground")}>
          <UserRound aria-hidden="true" className={cn("size-5")} />
          Account
        </Button>
      </Grid>
    </Box>
  );
}

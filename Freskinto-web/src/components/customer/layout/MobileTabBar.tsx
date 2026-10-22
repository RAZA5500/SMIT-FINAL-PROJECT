"use client";

import { Home, Package, ShoppingBasket, Store, UserRound, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn, pluralize } from "@/lib/utils";
import { useGetCart } from "@/services/cart/queries";
import { useAuthStore } from "@/stores/auth-store";
import { useShopStore } from "@/stores/shop-store";

const TAB_CLASS =
  "flex flex-col items-center justify-center gap-1 py-2.5 text-fs-11 font-medium outline-none transition-colors focus-visible:bg-muted";

function TabLink({ href, icon: Icon, label, active }: { href: string; icon: LucideIcon; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(TAB_CLASS, active ? "font-semibold text-brand-green" : "text-muted-foreground")}
    >
      <Icon aria-hidden="true" strokeWidth={active ? 2.4 : 2} className="size-5" />
      {label}
    </Link>
  );
}

/** Phone par app jaisa bottom navigation — basket hamesha ek tap door (lg se upar hidden) */
export function MobileTabBar() {
  const pathname = usePathname();
  const setCartOpen = useShopStore((state) => state.setCartOpen);
  const token = useAuthStore((state) => state.token);
  const { data: cart } = useGetCart();
  const count = cart?.itemCount ?? 0;

  return (
    <nav
      aria-label="Quick navigation"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur lg:hidden"
    >
      <div className="grid grid-cols-5">
        <TabLink
          href={publicRoutes.home}
          icon={Home}
          label="Home"
          active={pathname === publicRoutes.home}
        />
        <TabLink
          href={publicRoutes.shop}
          icon={Store}
          label="Shop"
          active={pathname.startsWith(publicRoutes.shop) || pathname.startsWith("/products")}
        />
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          aria-label={`Basket, ${pluralize(count, "item")}`}
          className={cn(TAB_CLASS, "text-muted-foreground")}
        >
          <span className="relative inline-flex">
            <ShoppingBasket aria-hidden="true" className="size-5" />
            {count > 0 && (
              <Badge key={count} variant="sale" className="absolute -top-2 -right-3 h-4 min-w-4 animate-bump px-1 text-fs-11 tabular-nums">
                {count}
              </Badge>
            )}
          </span>
          Basket
        </button>
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
      </div>
    </nav>
  );
}

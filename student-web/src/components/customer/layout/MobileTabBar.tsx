"use client";

import { House, LayoutGrid, Package, ShoppingBasket, UserRound, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetCart } from "@/services/cart/queries";
import { useUiStore } from "@/stores/ui-store";

const ITEM_CLASS =
  "relative flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors";

function TabLink({ href, icon: Icon, label, active }: { href: string; icon: LucideIcon; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(ITEM_CLASS, active ? "text-brand" : "text-muted-foreground")}
    >
      <Icon className="size-5" strokeWidth={active ? 2.4 : 2} aria-hidden="true" />
      {label}
    </Link>
  );
}

/** Phone par app jaisa bottom navigation — basket hamesha ek tap door */
export function MobileTabBar() {
  const pathname = usePathname();
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const setMenuOpen = useUiStore((state) => state.setMenuOpen);
  const { data: cart } = useGetCart();
  const count = cart?.itemCount ?? 0;

  return (
    // pb-[env(...)]: iPhone home indicator ke neeche content na chhupe — koi token nahi
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <div className="flex items-stretch">
        <TabLink href={publicRoutes.home} icon={House} label="Home" active={pathname === publicRoutes.home} />
        <TabLink href={publicRoutes.shop} icon={LayoutGrid} label="Shop" active={pathname === publicRoutes.shop} />
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          aria-label={`Basket, ${count} ${count === 1 ? "item" : "items"}`}
          className={cn(ITEM_CLASS, "text-muted-foreground")}
        >
          <span className="relative">
            <ShoppingBasket className="size-5" aria-hidden="true" />
            {count > 0 && (
              <span
                key={count}
                className="numeric absolute -top-2 -right-3 flex h-4.5 min-w-4.5 animate-bump items-center justify-center rounded-full bg-primary px-1 text-xs leading-none font-bold text-primary-foreground"
              >
                {count}
              </span>
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
        <button type="button" onClick={() => setMenuOpen(true)} className={cn(ITEM_CLASS, "text-muted-foreground")}>
          <UserRound className="size-5" aria-hidden="true" />
          Account
        </button>
      </div>
    </nav>
  );
}

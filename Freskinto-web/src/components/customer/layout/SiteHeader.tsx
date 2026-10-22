"use client";

import { ArrowLeft, Lock, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { STORE } from "@/constants/store";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { AccountMenu } from "./AccountMenu";
import { BasketButton } from "./BasketButton";
import { HeaderSearch, HeaderSearchFallback } from "./HeaderSearch";
import { MobileNav } from "./MobileNav";

function SkipLink() {
  return (
    <a
      href="#content"
      className="sr-only z-50 rounded-full bg-brand-green-forest px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Skip to content
    </a>
  );
}

function HomeLink() {
  return (
    <Link
      href={publicRoutes.home}
      aria-label={`${STORE.name} home`}
      className="shrink-0 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
    >
      <Logo size="md" />
    </Link>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-lg px-4 py-2 text-sm font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40",
        active ? "bg-brand-soft text-brand-green-dark" : "text-foreground/80",
      )}
    >
      {label}
    </Link>
  );
}

/** Floating glassmorphic navigation — shop pages ke liye; checkout par distraction-free variant */
export function SiteHeader({ variant = "default" }: { variant?: "default" | "checkout" }) {
  return variant === "checkout" ? <CheckoutHeader /> : <MarketHeader />;
}

function MarketHeader() {
  const pathname = usePathname();
  const hidden = useHideOnScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const isCustomer = useAuthStore((state) => state.user?.role === "CUSTOMER");

  const onShop = pathname.startsWith(publicRoutes.shop) || pathname.startsWith("/products");
  const onOrders = pathname.startsWith(customerRoutes.orders);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 px-3 pt-3 transition-transform duration-300 sm:px-4 lg:px-6",
        hidden && "max-lg:-translate-y-full",
      )}
    >
      <SkipLink />
      <div className="glass mx-auto flex h-14 max-w-page items-center gap-2 rounded-2xl border border-border/60 px-2 shadow-float sm:h-16 sm:gap-3 sm:px-3 lg:gap-5 lg:px-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full lg:hidden"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu aria-hidden="true" className="size-5" />
        </Button>
        <HomeLink />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          <NavLink href={publicRoutes.shop} label="Shop" active={onShop} />
          {hasHydrated && isCustomer && <NavLink href={customerRoutes.orders} label="Orders" active={onOrders} />}
        </nav>

        <div className="hidden min-w-0 flex-1 md:block lg:max-w-xl lg:flex-1">
          <Suspense fallback={<HeaderSearchFallback />}>
            <HeaderSearch />
          </Suspense>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <AccountMenu />
          <BasketButton />
        </div>
      </div>

      <div className="mx-auto mt-2 max-w-page md:hidden">
        <Suspense fallback={<HeaderSearchFallback />}>
          <HeaderSearch />
        </Suspense>
      </div>

      <MobileNav open={menuOpen} onOpenChange={setMenuOpen} />
    </header>
  );
}

/** Checkout par distraction-free header — sirf logo, "Secure checkout" aur basket par wapsi */
function CheckoutHeader() {
  return (
    <header className="px-3 pt-3 sm:px-4 lg:px-6">
      <SkipLink />
      <div className="glass mx-auto flex h-14 max-w-page items-center justify-between gap-4 rounded-2xl border border-border/60 px-3 shadow-float sm:h-16 sm:px-4">
        <HomeLink />
        <p className="hidden items-center gap-2 text-fs-12 font-semibold tracking-wider text-muted-foreground uppercase sm:flex">
          <Lock aria-hidden="true" className="size-4 text-brand-green" />
          Secure checkout
        </p>
        <ButtonLink
          href={customerRoutes.cart}
          variant="ghost"
          size="sm"
          className="rounded-full text-brand-green hover:text-brand-green-dark"
        >
          <ArrowLeft aria-hidden="true" />
          Back to basket
        </ButtonLink>
      </div>
    </header>
  );
}

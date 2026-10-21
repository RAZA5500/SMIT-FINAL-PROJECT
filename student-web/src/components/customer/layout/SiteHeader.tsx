"use client";

import { ArrowLeft, Lock, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";
import { AccountMenu } from "./AccountMenu";
import { AnnouncementBar } from "./AnnouncementBar";
import { CartButton } from "./CartButton";
import { CategoryBar, CategoryBarSkeleton } from "./CategoryBar";
import { HeaderSearch, HeaderSearchFallback } from "./HeaderSearch";

/** Checkout par distraction-free header — sirf logo, "Checkout" aur basket par wapsi */
export function isCheckoutPath(pathname: string): boolean {
  return pathname.startsWith(customerRoutes.checkout);
}

function SkipLink() {
  return (
    <a
      href="#content"
      className="sr-only z-50 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
      Skip to content
    </a>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const hidden = useHideOnScroll();
  const setMenuOpen = useUiStore((state) => state.setMenuOpen);

  if (isCheckoutPath(pathname)) return <CheckoutHeader />;

  return (
    <>
      <SkipLink />
      <AnnouncementBar />
      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-card/90 backdrop-blur-md transition-transform duration-300",
          hidden && "max-md:-translate-y-full",
        )}
      >
        <div className="container-page flex flex-wrap items-center gap-x-1.5 gap-y-2.5 py-2.5 md:flex-nowrap md:gap-6 md:py-3">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2 md:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <Link href={publicRoutes.home} aria-label="Freskinto home" className="shrink-0 rounded-lg">
            <Logo />
          </Link>
          <div className="order-last basis-full md:order-none md:max-w-2xl md:flex-1 md:basis-auto">
            <Suspense fallback={<HeaderSearchFallback />}>
              <HeaderSearch />
            </Suspense>
          </div>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <AccountMenu />
            <CartButton />
          </div>
        </div>
      </header>
      <Suspense fallback={<CategoryBarSkeleton />}>
        <CategoryBar />
      </Suspense>
    </>
  );
}

function CheckoutHeader() {
  return (
    <header className="border-b bg-card">
      <SkipLink />
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href={publicRoutes.home} aria-label="Freskinto home" className="shrink-0 rounded-lg">
          <Logo />
        </Link>
        <span className="hidden items-center gap-2 text-sm font-semibold text-muted-foreground sm:inline-flex">
          <Lock className="size-4 text-brand" aria-hidden="true" />
          Checkout
        </span>
        <Link
          href={customerRoutes.cart}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-brand hover:bg-brand-soft"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to basket
        </Link>
      </div>
    </header>
  );
}

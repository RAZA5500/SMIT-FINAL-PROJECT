import type { ReactNode } from "react";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { CartPanel } from "./CartPanel";
import { MobileTabBar } from "./layout/MobileTabBar";
import { SiteFooter } from "./layout/SiteFooter";
import { SiteHeader } from "./layout/SiteHeader";

interface CustomerShellProps {
  children: ReactNode;
  /** Sirf signed-in CUSTOMER ke liye (basket, checkout, orders, addresses, profile) */
  requireAuth?: boolean;
  /** `checkout`: distraction-free header/footer, tab bar nahi */
  variant?: "default" | "checkout";
}

/** Storefront chrome: floating header → content → footer, plus slide-over basket aur phone tab bar */
export function CustomerShell({ children, requireAuth = false, variant = "default" }: CustomerShellProps) {
  const checkout = variant === "checkout";

  return (
    <>
      <SiteHeader variant={variant} />
      {/* pb-24: phone par bottom tab bar ke neeche content na chhupe */}
      <main id="content" className="flex flex-1 flex-col pb-24 lg:pb-0">
        {requireAuth ? <AuthGuard expectedRole="CUSTOMER">{children}</AuthGuard> : children}
      </main>
      <SiteFooter compact={checkout} />
      {!checkout && <MobileTabBar />}
      <CartPanel />
    </>
  );
}

import type { ReactNode } from "react";
import { Aurora } from "@/components/ui/aurora";
import { Flex } from "@/components/ui/flex";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { CartPanel } from "./CartPanel";
import { MobileTabBar } from "./layout/MobileTabBar";
import { PageTransition } from "./layout/PageTransition";
import { SiteFooter } from "./layout/SiteFooter";
import { SiteHeader } from "./layout/SiteHeader";

interface CustomerShellProps {
  children: ReactNode;
  /** Sirf signed-in CUSTOMER ke liye (basket, checkout, orders, addresses, profile) */
  requireAuth?: boolean;
  /** `checkout`: distraction-free header/footer, tab bar nahi */
  variant?: "default" | "checkout";
}

/**
 * Storefront chrome: tairti aurora → floating glass header → content (route change par page
 * transition) → footer, slide-over basket aur phone ka floating tab bar
 */
export function CustomerShell({ children, requireAuth = false, variant = "default" }: CustomerShellProps) {
  const checkout = variant === "checkout";

  return (
    <>
      <Aurora />
      <SiteHeader variant={variant} />
      <PageTransition>
        <Flex as="main" id="content" direction="col" className="flex-1">
          {requireAuth ? <AuthGuard expectedRole="CUSTOMER">{children}</AuthGuard> : children}
        </Flex>
      </PageTransition>
      <SiteFooter compact={checkout} />
      {!checkout && <MobileTabBar />}
      <CartPanel />
    </>
  );
}

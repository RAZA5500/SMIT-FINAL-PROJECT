import type { ReactNode } from "react";
import { Flex } from "@/components/ui/flex";
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

/** Storefront chrome: sticky header → content → light footer, slide-over basket aur phone tab bar */
export function CustomerShell({ children, requireAuth = false, variant = "default" }: CustomerShellProps) {
  const checkout = variant === "checkout";

  return (
    <>
      <SiteHeader variant={variant} />
      <Flex as="main" id="content" direction="col" className="flex-1">
        {requireAuth ? <AuthGuard expectedRole="CUSTOMER">{children}</AuthGuard> : children}
      </Flex>
      <SiteFooter compact={checkout} />
      {!checkout && <MobileTabBar />}
      <CartPanel />
    </>
  );
}

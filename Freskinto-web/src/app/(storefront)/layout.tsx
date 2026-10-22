import { CartSheet } from "@/components/customer/cart/CartSheet";
import { MobileNav } from "@/components/customer/layout/MobileNav";
import { MobileTabBar } from "@/components/customer/layout/MobileTabBar";
import { SiteFooter } from "@/components/customer/layout/SiteFooter";
import { SiteHeader } from "@/components/customer/layout/SiteHeader";
import { Stack } from "@/components/ui/flex";
import { cn } from "@/lib/utils";

/** Storefront pages (home, shop, product, basket, checkout, orders, addresses) */
export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {/* pb-20: phone par bottom tab bar ke neeche content na chhupe */}
      <Stack as="main" id="content" className={cn("flex-1 pb-20 md:pb-0")}>
        {children}
      </Stack>
      <SiteFooter />
      <MobileTabBar />
      <CartSheet />
      <MobileNav />
    </>
  );
}

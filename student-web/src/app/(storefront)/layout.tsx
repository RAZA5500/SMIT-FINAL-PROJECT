import { CartSheet } from "@/components/customer/cart/CartSheet";
import { MobileMenu } from "@/components/customer/layout/MobileMenu";
import { MobileTabBar } from "@/components/customer/layout/MobileTabBar";
import { SiteFooter } from "@/components/customer/layout/SiteFooter";
import { SiteHeader } from "@/components/customer/layout/SiteHeader";

/** Storefront pages (home, shop, product, basket, checkout, orders, addresses) */
export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {/* pb-20: phone par bottom tab bar ke neeche content na chhupe */}
      <main id="content" className="flex flex-1 flex-col pb-20 md:pb-0">
        {children}
      </main>
      <SiteFooter />
      <MobileTabBar />
      <CartSheet />
      <MobileMenu />
    </>
  );
}

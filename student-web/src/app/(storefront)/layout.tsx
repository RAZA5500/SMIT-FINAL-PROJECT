import SiteFooter from "@/components/customer/SiteFooter";
import SiteHeader from "@/components/customer/SiteHeader";

/** Storefront pages (home, shop, cart, checkout, orders, addresses) — header + footer ke saath */
export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}

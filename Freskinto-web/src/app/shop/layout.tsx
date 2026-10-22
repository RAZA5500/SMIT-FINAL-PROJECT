import { CustomerShell } from "@/components/customer/CustomerShell";

/** Public storefront — guests bhi browse kar sakte hain */
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <CustomerShell>{children}</CustomerShell>;
}

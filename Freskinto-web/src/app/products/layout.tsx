import { CustomerShell } from "@/components/customer/CustomerShell";

/** Product pages bhi public storefront ka hissa hain */
export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <CustomerShell>{children}</CustomerShell>;
}

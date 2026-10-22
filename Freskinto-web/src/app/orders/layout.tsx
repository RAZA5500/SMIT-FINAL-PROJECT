import { CustomerShell } from "@/components/customer/CustomerShell";

/** Sirf signed-in CUSTOMER ke orders */
export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <CustomerShell requireAuth>{children}</CustomerShell>;
}

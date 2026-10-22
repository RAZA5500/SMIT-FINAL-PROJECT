import { CustomerShell } from "@/components/customer/CustomerShell";

/** Sirf signed-in CUSTOMER ka order summary */
export default function CartSummaryLayout({ children }: { children: React.ReactNode }) {
  return <CustomerShell requireAuth>{children}</CustomerShell>;
}

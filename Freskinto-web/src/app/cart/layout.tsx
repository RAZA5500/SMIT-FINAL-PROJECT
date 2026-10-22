import { CustomerShell } from "@/components/customer/CustomerShell";

/** Sirf signed-in CUSTOMER ka basket */
export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <CustomerShell requireAuth>{children}</CustomerShell>;
}

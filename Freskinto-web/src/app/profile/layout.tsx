import { CustomerShell } from "@/components/customer/CustomerShell";

/** Sirf signed-in CUSTOMER ka profile */
export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <CustomerShell requireAuth>{children}</CustomerShell>;
}

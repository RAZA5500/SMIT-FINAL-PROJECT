import { CustomerShell } from "@/components/customer/CustomerShell";

/** Sirf signed-in CUSTOMER ka address book */
export default function AddressesLayout({ children }: { children: React.ReactNode }) {
  return <CustomerShell requireAuth>{children}</CustomerShell>;
}

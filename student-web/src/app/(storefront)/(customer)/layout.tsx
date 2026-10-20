import { AuthGuard } from "@/components/shared/AuthGuard";

/** Sirf CUSTOMER ke pages (cart, checkout, orders, addresses) */
export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard expectedRole="CUSTOMER">{children}</AuthGuard>;
}

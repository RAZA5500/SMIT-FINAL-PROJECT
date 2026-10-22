import { CustomerShell } from "@/components/customer/CustomerShell";

/** Checkout + payment: sirf signed-in CUSTOMER, distraction-free header */
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <CustomerShell requireAuth variant="checkout">
      {children}
    </CustomerShell>
  );
}

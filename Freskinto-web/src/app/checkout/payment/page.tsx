import type { Metadata } from "next";
import { CheckoutPaymentView } from "./(components)/CheckoutPaymentView";

export const metadata: Metadata = { title: "Payment" };

export default function CheckoutPaymentPage() {
  return <CheckoutPaymentView />;
}

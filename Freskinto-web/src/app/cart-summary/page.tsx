import type { Metadata } from "next";
import { CartSummaryView } from "./(components)/CartSummaryView";

export const metadata: Metadata = { title: "Order summary" };

export default function CartSummaryPage() {
  return <CartSummaryView />;
}

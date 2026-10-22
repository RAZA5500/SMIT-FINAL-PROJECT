import type { Metadata } from "next";
import { CartSummaryView } from "./(components)/CartSummaryView";

export const metadata: Metadata = {
  title: "Cart summary",
  description: "Review your grocery basket totals and delivery options.",
};

export default function CartSummaryPage() {
  return <CartSummaryView />;
}

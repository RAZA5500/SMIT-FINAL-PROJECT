import type { Metadata } from "next";
import { CartView } from "./(components)/CartView";

export const metadata: Metadata = { title: "Basket" };

export default function CartPage() {
  return <CartView />;
}

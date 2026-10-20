import type { Metadata } from "next";
import { OrdersView } from "./(components)/OrdersView";

export const metadata: Metadata = {
  title: "My Orders",
};

export default function OrdersPage() {
  return <OrdersView />;
}

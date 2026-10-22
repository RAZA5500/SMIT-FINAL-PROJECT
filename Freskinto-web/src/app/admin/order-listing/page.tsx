import type { Metadata } from "next";
import { OrderBoardView } from "./(components)/OrderBoardView";

export const metadata: Metadata = {
  title: "Order board",
};

/** Static mock screen (user decision) — sample orders, real kaam Orders screen par */
export default function AdminOrderListingPage() {
  return <OrderBoardView />;
}

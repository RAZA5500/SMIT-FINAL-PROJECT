import type { Metadata } from "next";
import { AdminOrdersView } from "./(components)/AdminOrdersView";

export const metadata: Metadata = { title: "Orders" };

export default function AdminOrdersPage() {
  return <AdminOrdersView />;
}

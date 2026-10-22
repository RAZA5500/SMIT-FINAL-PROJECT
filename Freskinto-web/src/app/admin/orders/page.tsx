import type { Metadata } from "next";
import { AdminOrdersView } from "./(components)/AdminOrdersView";

// Title page par (layout mein string title child routes ka "· Freskinto Admin" template mita deta hai)
export const metadata: Metadata = {
  title: "Orders",
};

export default function AdminOrdersPage() {
  return <AdminOrdersView />;
}

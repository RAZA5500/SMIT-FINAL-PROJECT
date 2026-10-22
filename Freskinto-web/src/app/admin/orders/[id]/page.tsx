import type { Metadata } from "next";
import { AdminOrderDetailView } from "../(components)/AdminOrderDetailView";

export const metadata: Metadata = { title: "Order details" };

export default async function AdminOrderDetailPage({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  return <AdminOrderDetailView id={id} />;
}

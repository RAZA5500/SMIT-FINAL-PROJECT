import type { Metadata } from "next";
import { OrderDetailView } from "./(components)/OrderDetailView";

export const metadata: Metadata = {
  title: "Order details",
};

export default async function OrderDetailPage({ params }: PageProps<"/orders/[id]">) {
  const { id } = await params;
  return <OrderDetailView id={id} />;
}

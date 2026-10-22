import type { Metadata } from "next";
import { InventoryView } from "./(components)/InventoryView";

export const metadata: Metadata = {
  title: "Stock levels",
};

export default function AdminInventoryPage() {
  return <InventoryView />;
}

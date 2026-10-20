import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory Transactions",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

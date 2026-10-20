import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Fresh Produce",
  description: "Browse fresh fruits, vegetables, seafood, and groceries from Freshes.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

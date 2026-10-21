import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stock movements",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stock levels",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

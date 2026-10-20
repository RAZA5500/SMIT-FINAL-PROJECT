import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Category Management",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

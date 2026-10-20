import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coupon Management",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

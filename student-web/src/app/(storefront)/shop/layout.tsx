import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse fresh fruit & veg, poultry, dairy and everyday essentials — free delivery on every order.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

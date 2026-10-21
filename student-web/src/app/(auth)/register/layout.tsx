import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a free Freskinto account and start shopping fresh groceries with free delivery.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

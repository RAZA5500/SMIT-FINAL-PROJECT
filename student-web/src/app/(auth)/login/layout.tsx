import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Freskinto account to shop fresh groceries with free delivery.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

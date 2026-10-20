import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new account to start shopping for fresh produce.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

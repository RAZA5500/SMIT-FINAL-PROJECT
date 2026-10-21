import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Get help signing back in to your Freskinto account.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

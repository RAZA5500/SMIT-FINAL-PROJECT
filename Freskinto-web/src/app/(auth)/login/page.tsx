import type { Metadata } from "next";
import { AuthHeading } from "@/components/customer/auth/AuthHeading";
import { LoginForm } from "./components/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { redirect } = await searchParams;

  return (
    <>
      <AuthHeading
        eyebrow="Welcome back"
        title="Sign in to your basket"
        subtitle="Pick up where you left off — your basket and orders are waiting."
      />
      <LoginForm redirectTo={typeof redirect === "string" ? redirect : null} />
    </>
  );
}

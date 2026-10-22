import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/customer/auth/AuthShell";
import { LoginForm } from "./(components)/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Freskinto account to shop fresh groceries with free delivery.",
};

export default function LoginPage() {
  return (
    <AuthShell eyebrow="Welcome back" title="Sign in to your basket" subtitle="Pick up your shop exactly where you left it.">
      {/* useSearchParams (redirect param) ko Suspense boundary chahiye */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}

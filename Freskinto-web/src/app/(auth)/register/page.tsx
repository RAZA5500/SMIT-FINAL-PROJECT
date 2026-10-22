import type { Metadata } from "next";
import { AuthShell } from "@/components/customer/auth/AuthShell";
import { RegisterForm } from "./(components)/RegisterForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a free Freskinto account and start shopping fresh groceries with free delivery.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Join the market"
      title="Create your account"
      subtitle="It takes under a minute — and delivery is always free."
    >
      <RegisterForm />
    </AuthShell>
  );
}

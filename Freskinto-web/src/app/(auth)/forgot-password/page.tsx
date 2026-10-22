import type { Metadata } from "next";
import { AuthShell } from "@/components/customer/auth/AuthShell";
import { ForgotPasswordForm } from "./(components)/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Get help signing back in to your Freskinto account.",
};

/** Static screen (user decision) — password reset backend scope mein nahi */
export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account help"
      title="Forgot your password?"
      subtitle="Enter the email you signed up with and we'll help you get back in."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}

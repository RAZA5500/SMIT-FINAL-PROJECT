import type { Metadata } from "next";
import { AuthHeading } from "@/components/customer/auth/AuthHeading";
import { ForgotPasswordForm } from "./(components)/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Get help signing back in to your Freskinto account.",
};

/** Static screen (README §Scope) — password reset assistance */
export default function ForgotPasswordPage() {
  return (
    <>
      <AuthHeading
        eyebrow="Account help"
        title="Forgot your password?"
        subtitle="Enter the email you signed up with and we'll help you get back in."
      />
      <ForgotPasswordForm />
    </>
  );
}

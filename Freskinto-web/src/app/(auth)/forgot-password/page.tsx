import { AuthShell } from "@/components/customer/auth/AuthShell";
import { ForgotPasswordForm } from "./components/ForgotPasswordForm";

/** Static screen (user decision) — password reset backend scope mein nahi */
export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Forgot your password?" subtitle="Enter the email you signed up with and we'll help you get back in.">
      <ForgotPasswordForm />
    </AuthShell>
  );
}

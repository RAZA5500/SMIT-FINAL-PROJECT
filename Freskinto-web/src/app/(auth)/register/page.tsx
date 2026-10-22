import { AuthShell } from "@/components/customer/auth/AuthShell";
import { RegisterForm } from "./components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell title="Create your account" subtitle="It takes under a minute — and delivery is always free.">
      <RegisterForm />
    </AuthShell>
  );
}

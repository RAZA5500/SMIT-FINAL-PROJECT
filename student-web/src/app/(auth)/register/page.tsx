import { AuthShell } from "@/components/customer/AuthShell";
import { RegisterForm } from "./components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell title="Create Account" subtitle="Enter your personal details">
      <RegisterForm />
    </AuthShell>
  );
}

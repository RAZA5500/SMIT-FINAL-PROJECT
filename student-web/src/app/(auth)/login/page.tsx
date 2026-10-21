import { Suspense } from "react";
import { AuthShell } from "@/components/customer/auth/AuthShell";
import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to pick up your basket where you left off.">
      {/* useSearchParams (redirect param) ko Suspense boundary chahiye */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}

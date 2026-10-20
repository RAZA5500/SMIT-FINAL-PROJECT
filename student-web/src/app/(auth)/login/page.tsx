import { Suspense } from "react";
import { AuthShell } from "@/components/customer/AuthShell";
import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell title="Welcome Back!" subtitle="Sign in to continue to FreshStock">
      {/* useSearchParams (redirect param) ko Suspense boundary chahiye */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}

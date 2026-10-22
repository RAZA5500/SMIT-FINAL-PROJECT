import { AuthShell } from "@/components/customer/auth/AuthShell";

/** /login aur /register ka split-screen frame */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthShell>{children}</AuthShell>;
}

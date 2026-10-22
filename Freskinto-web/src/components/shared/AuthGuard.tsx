"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { ApiError } from "@/lib/api";
import { homeForRole, loginUrl } from "@/lib/routes/routes";
import { toastError } from "@/lib/toast";
import { useGetMe } from "@/services/auth/queries";
import type { UserRole } from "@/services/auth/types";
import { useAuthStore } from "@/stores/auth-store";
import { ErrorState } from "./ErrorState";
import { PageLoader } from "./PageLoader";

interface AuthGuardProps {
  expectedRole: UserRole;
  children: ReactNode;
}

/**
 * Layouts ki route protection (FLOW-MD 06 §9). Sirf UX hai — asli security backend
 * guard + ownership checks hain.
 */
export function AuthGuard({ expectedRole, children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const { data: me, error, refetch } = useGetMe(hasHydrated && Boolean(token));
  const sessionEnded = error instanceof ApiError && (error.status === 401 || error.status === 403);

  // Token hi nahi → login (aur kaam ke baad wapas yahin)
  useEffect(() => {
    if (hasHydrated && !token) router.replace(loginUrl(pathname));
  }, [hasHydrated, token, pathname, router]);

  // 401 (expired/invalid) ya 403 (deactivated) → session khatam
  useEffect(() => {
    if (!sessionEnded) return;
    toastError(
      error.status === 403 ? "Account deactivated" : "Session expired",
      error.status === 403 ? error.message : "Please sign in again.",
    );
    logout();
  }, [sessionEnded, error, logout]);

  // Role hamesha backend wala; ghalat role → apna area
  useEffect(() => {
    if (!me) return;
    setUser(me);
    if (me.role !== expectedRole) router.replace(homeForRole(me.role));
  }, [me, expectedRole, router, setUser]);

  if (!hasHydrated || !token || sessionEnded) return <PageLoader />;

  // Network / 5xx — transient; user ko bahar nahi nikalte (FLOW-MD 06 §9)
  if (error) {
    return (
      <Container className="py-16">
        <ErrorState title="We couldn't verify your session" message={error.message} onRetry={() => void refetch()} />
      </Container>
    );
  }

  if (!me || me.role !== expectedRole) return <PageLoader />;
  return <>{children}</>;
}

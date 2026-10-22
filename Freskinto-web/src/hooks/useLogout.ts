"use client";

import { useRouter } from "next/navigation";
import { publicRoutes } from "@/lib/routes/routes";
import { toastSuccess } from "@/lib/toast";
import { useAuthStore } from "@/stores/auth-store";

/** Logout: token + user + local cart state + query cache saaf → login (FLOW-MD 08 §13) */
export function useLogout() {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.logout);

  return () => {
    clearSession();
    toastSuccess("You're signed out", "See you soon — your basket will be waiting.");
    router.push(publicRoutes.login);
  };
}

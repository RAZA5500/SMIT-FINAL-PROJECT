import { useQuery } from "@tanstack/react-query";
import { authService } from "./index";

export const authKeys = {
  me: ["auth", "me"] as const,
};

/** AuthGuard mount par role verify karta hai (FLOW-MD 06 §9) */
export function useGetMe(enabled: boolean) {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: ({ signal }) => authService.me(signal),
    enabled,
    // 401/403 ka matlab session khatam — retry ka faida nahi
    retry: false,
  });
}

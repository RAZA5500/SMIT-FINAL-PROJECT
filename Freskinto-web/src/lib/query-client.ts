import { QueryClient } from "@tanstack/react-query";

/**
 * Ek hi QueryClient — same query key ki parallel requests ek ban jati hain (dedup),
 * aur 5 minute tak cache se dikhti hain (FLOW-MD 08 §8). Logout par `clear()`.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

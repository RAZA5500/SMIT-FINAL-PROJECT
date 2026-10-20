"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { CartProvider } from "@/context/CartContext";
import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/stores/auth-store";

/** Server state (TanStack Query) + toasts — poori app ke liye ek jagah */
export function Providers({ children }: { children: React.ReactNode }) {
  // Persisted session mount ke baad load — server aur pehle client render ka HTML same rahe
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>{children}</CartProvider>
      {/* Matches the live site: sonner, top-right, rich colours, 12px gap. */}
      <Toaster position="top-right" richColors closeButton expand gap={12} visibleToasts={3} />
    </QueryClientProvider>
  );
}

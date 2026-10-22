"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/stores/auth-store";
import { useShopStore } from "@/stores/shop-store";

/** Server state (TanStack Query) + toasts + tooltips — poori app ke liye ek jagah */
export function Providers({ children }: { children: React.ReactNode }) {
  // Persisted state mount ke baad load — server aur pehle client render ka HTML same rahe
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
    void useShopStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delay={250}>{children}</TooltipProvider>
      {/* Bottom-right header se door; phone par tab bar ke upar */}
      <Toaster position="bottom-right" mobileOffset={{ bottom: 88 }} gap={10} visibleToasts={3} closeButton />
    </QueryClientProvider>
  );
}

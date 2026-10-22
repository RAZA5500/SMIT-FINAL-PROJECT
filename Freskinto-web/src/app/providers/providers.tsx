"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { CircleAlert, CircleCheck, Info, LoaderCircle, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/query-client";
import { useAuthStore } from "@/stores/auth-store";

/** Server state (TanStack Query) + toasts + tooltips — poori app ke liye ek jagah */
export function Providers({ children }: { children: React.ReactNode }) {
  // Persisted session mount ke baad load — server aur pehle client render ka HTML same rahe
  useEffect(() => {
    void useAuthStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delay={250}>{children}</TooltipProvider>
      {/* Bottom-right stays clear of the sticky header; on phones it sits above the tab bar */}
      <Toaster
        position="bottom-right"
        mobileOffset={{ bottom: 84 }}
        gap={10}
        visibleToasts={3}
        closeButton
        icons={{
          success: <CircleCheck className="size-5 text-success" />,
          error: <CircleAlert className="size-5 text-destructive" />,
          warning: <TriangleAlert className="size-5 text-warning" />,
          info: <Info className="size-5 text-info" />,
          loading: <LoaderCircle className="size-5 animate-spin text-muted-foreground" />,
        }}
        toastOptions={{
          // `!` — sonner ki apni styles ki specificity zyada hai
          classNames: {
            toast:
              "items-start! gap-3! rounded-2xl! border! border-border! bg-card! p-4! font-sans! text-foreground! shadow-lift!",
            title: "text-sm! font-semibold!",
            description: "text-sm! text-muted-foreground!",
            icon: "mt-0.5!",
            closeButton: "border-border! bg-card! text-muted-foreground! hover:text-foreground!",
          },
        }}
      />
    </QueryClientProvider>
  );
}

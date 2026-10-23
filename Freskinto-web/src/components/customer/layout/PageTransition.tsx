"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ViewTransition } from "@/components/ui/view-transition";

/**
 * Route badalne par page content halka sa neeche utarta aur naya upar ubharta hai (View
 * Transitions, CSS `.page-exit` / `.page-enter` in globals.css). Header apni jagah tika rehta hai.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition key={pathname} enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}

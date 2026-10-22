"use client";

import { useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { AppNavbar } from "./AppNavbar";
import { AppSidebar } from "./AppSidebar";

/**
 * Admin layout — sirf ADMIN (AuthGuard backend se role verify karta hai). shadcn `SidebarProvider`
 * + `SidebarInset`; `data-surface="admin"` headings ko Inter par rakhta hai (body par bhi, taake
 * portals — modals, sheets — match karein).
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.dataset.surface = "admin";
    return () => {
      delete document.body.dataset.surface;
    };
  }, []);

  return (
    <AuthGuard expectedRole="ADMIN">
      <SidebarProvider data-surface="admin" className="bg-sidebar">
        <AppSidebar />
        <SidebarInset id="content" className="min-w-0 bg-workspace md:peer-data-[variant=inset]:rounded-3xl">
          <AppNavbar />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}

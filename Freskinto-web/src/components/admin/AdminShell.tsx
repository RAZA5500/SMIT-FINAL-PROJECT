"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { AppNavbar } from "./AppNavbar";
import { AppSidebar } from "./AppSidebar";

/**
 * Admin layout — sirf ADMIN (AuthGuard backend se role verify karta hai). shadcn `SidebarProvider`
 * + `SidebarInset`: halka grey sidebar, us ke saath safed inset canvas.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard expectedRole="ADMIN">
      <SidebarProvider className="bg-sidebar">
        <AppSidebar />
        <SidebarInset
          id="content"
          className="min-w-0 bg-background md:peer-data-[variant=inset]:rounded-3xl md:peer-data-[variant=inset]:border md:peer-data-[variant=inset]:shadow-none"
        >
          <AppNavbar />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}

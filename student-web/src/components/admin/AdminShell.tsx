"use client";

import { AuthGuard } from "@/components/shared/AuthGuard";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

/** Admin layout — sirf ADMIN (AuthGuard backend se role verify karta hai) */
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard expectedRole="ADMIN">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="min-w-0 bg-background">
          <AdminTopbar />
          <div id="content" className="flex flex-1 flex-col">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}

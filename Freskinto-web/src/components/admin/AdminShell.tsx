"use client";

import { Stack } from "@/components/ui/flex";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

/** Admin layout — sirf ADMIN (AuthGuard backend se role verify karta hai) */
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard expectedRole="ADMIN">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className={cn("min-w-0 md:peer-data-[variant=inset]:ring-1 md:peer-data-[variant=inset]:ring-border")}>
          <AdminTopbar />
          <Stack id="content" className={cn("flex-1")}>
            {children}
          </Stack>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}

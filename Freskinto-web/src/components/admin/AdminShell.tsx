"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { cn } from "@/lib/utils";
import { AppNavbar } from "./AppNavbar";
import { AppSidebar } from "./AppSidebar";

/**
 * Admin layout — sirf ADMIN (AuthGuard backend se role verify karta hai). `data-surface="admin"`
 * headings ko Inter par rakhta hai; body par bhi lagta hai taake portals (modals, sheets) match karein.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.dataset.surface = "admin";
    return () => {
      delete document.body.dataset.surface;
    };
  }, []);

  return (
    <AuthGuard expectedRole="ADMIN">
      <div data-surface="admin" className="flex min-h-dvh flex-1 bg-workspace">
        <aside
          className={cn(
            "sticky top-0 hidden h-dvh shrink-0 border-r border-sidebar-border transition-all duration-200 lg:block",
            collapsed ? "w-sidebar-rail" : "w-sidebar",
          )}
        >
          <AppSidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed((value) => !value)} />
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" showCloseButton={false} className="gap-0 border-sidebar-border bg-sidebar p-0 data-[side=left]:w-72">
            <SheetTitle className="sr-only">Admin navigation</SheetTitle>
            <SheetDescription className="sr-only">Move between the Freskinto admin sections.</SheetDescription>
            <AppSidebar onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col">
          <AppNavbar onOpenMenu={() => setMobileOpen(true)} onToggleSidebar={() => setCollapsed((value) => !value)} />
          <main id="content" className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

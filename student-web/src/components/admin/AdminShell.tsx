"use client";

import React, { useState } from "react";
import { AuthGuard } from "@/components/shared/AuthGuard";
import AdminSidebar, { AdminNavbar } from "./AdminSidebar";

/** Admin layout — sirf ADMIN (AuthGuard backend se role verify karta hai) */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AuthGuard expectedRole="ADMIN">
      <div
        data-slot="sidebar-wrapper"
        style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "5rem" } as React.CSSProperties}
        className="group/sidebar-wrapper flex has-data-[variant=inset]:bg-sidebar w-full min-h-svh"
      >
        <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <div className="transition-opacity duration-150 admin-scope flex flex-1 flex-col min-w-0 overflow-x-clip h-dvh">
          <AdminNavbar onMenuClick={() => setMobileOpen(true)} />
          {/* Each page supplies its own <main>: list screens need a different
              overflow behaviour from the dashboard. */}
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}

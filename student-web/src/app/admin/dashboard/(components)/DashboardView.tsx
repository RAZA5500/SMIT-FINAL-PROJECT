"use client";

import {
  ArrowUpRight,
  Boxes,
  FolderTree,
  Package,
  PackagePlus,
  ReceiptText,
  ShoppingBag,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { adminRoutes } from "@/lib/routes/routes";
import { useAuthStore } from "@/stores/auth-store";
import { ACTIVITY, KPIS, PERIOD_LABEL } from "./dashboard-data";
import { CategorySalesChart, RevenueChart } from "./DashboardCharts";
import { StatTile } from "./StatTile";

const ACTIVITY_ICONS: Record<(typeof ACTIVITY)[number]["kind"], LucideIcon> = {
  order: ShoppingBag,
  stock: Boxes,
  customer: UserPlus,
  product: Package,
};

/** Asli admin tools ke shortcuts (yeh links live pages par jaate hain) */
const QUICK_ACTIONS: { label: string; text: string; href: string; icon: LucideIcon }[] = [
  { label: "New product", text: "Add to a category", href: adminRoutes.productNew, icon: PackagePlus },
  { label: "Stock levels", text: "Adjust and restock", href: adminRoutes.inventory, icon: Boxes },
  { label: "Orders", text: "Process paid orders", href: adminRoutes.orders, icon: ReceiptText },
  { label: "Categories", text: "Organise the aisles", href: adminRoutes.categories, icon: FolderTree },
  { label: "Customers", text: "Manage accounts", href: adminRoutes.customers, icon: Users },
];

function greetingFor(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardView() {
  const user = useAuthStore((state) => state.user);
  // Ek dafa mount par — render ke dauran Date nahi
  const [greeting] = useState(() => greetingFor(new Date().getHours()));

  return (
    <AdminPage
      demo
      title={`${greeting}, ${user?.name?.split(" ")[0] ?? "there"}`}
      description={`Here's how the store is doing — ${PERIOD_LABEL.toLowerCase()}. Charts on this screen use sample data.`}
    >
      <section aria-label="Key figures" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((kpi) => (
          <StatTile key={kpi.key} kpi={kpi} />
        ))}
      </section>

      <div className="grid items-start gap-4 lg:grid-cols-3">
        <RevenueChart className="lg:col-span-2" />
        <CategorySalesChart />
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-3">
        <section className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border sm:p-6 lg:col-span-2">
          <h2 className="font-sans text-base font-semibold">Recent activity</h2>
          <ol className="flex flex-col">
            {ACTIVITY.map((event, index) => {
              const Icon = ACTIVITY_ICONS[event.kind];
              return (
                <li key={`${event.title}-${index}`} className="relative flex gap-3.5 pb-5 last:pb-0">
                  {index < ACTIVITY.length - 1 && (
                    <span className="absolute top-10 bottom-0 left-4.5 w-px bg-border" aria-hidden="true" />
                  )}
                  <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="flex min-w-0 flex-1 items-start justify-between gap-3 pt-1">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.detail}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{event.time}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="flex flex-col gap-3 rounded-2xl bg-brand-strong p-5 text-white shadow-soft sm:p-6">
          <h2 className="font-sans text-base font-semibold">Quick actions</h2>
          <ul className="flex flex-col gap-2">
            {QUICK_ACTIONS.map(({ label, text, href, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group/action flex items-center gap-3 rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-lime text-lime-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-sm font-semibold">{label}</span>
                    <span className="text-xs text-white/60">{text}</span>
                  </span>
                  <ArrowUpRight
                    className="size-4 text-white/50 transition-transform group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AdminPage>
  );
}

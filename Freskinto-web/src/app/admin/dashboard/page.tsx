import type { Metadata } from "next";
import { DashboardView } from "./(components)/DashboardView";

// Title page par (layout mein string title child routes ka "· Freskinto Admin" template mita deta hai)
export const metadata: Metadata = {
  title: "Dashboard",
};

/** Static mock screen (user decision) — charts sample data par */
export default function AdminDashboardPage() {
  return <DashboardView />;
}

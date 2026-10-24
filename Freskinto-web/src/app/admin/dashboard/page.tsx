import { redirect } from "next/navigation";
import { adminRoutes } from "@/lib/routes/routes";

/** /admin/dashboard redirects directly to the admin overview page */
export default function AdminDashboardPage() {
  redirect(adminRoutes.home);
}

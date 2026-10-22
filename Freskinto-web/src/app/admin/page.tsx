import { redirect } from "next/navigation";
import { adminRoutes } from "@/lib/routes/routes";

/** Admin ka front door: orders (operations queue) */
export default function AdminHomePage() {
  redirect(adminRoutes.orders);
}

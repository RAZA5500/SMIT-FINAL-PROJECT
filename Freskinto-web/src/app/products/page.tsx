import { redirect } from "next/navigation";
import { publicRoutes } from "@/lib/routes/routes";

/** /products root redirects directly to /shop catalog */
export default function ProductsPage() {
  redirect(publicRoutes.shop);
}

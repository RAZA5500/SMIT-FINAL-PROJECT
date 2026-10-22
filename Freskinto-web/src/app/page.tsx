import { redirect } from "next/navigation";
import { publicRoutes } from "@/lib/routes/routes";

/** Storefront ka front door `/shop` hai (hero wahin hai) */
export default function HomePage() {
  redirect(publicRoutes.shop);
}

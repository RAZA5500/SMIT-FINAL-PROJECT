import { customerRoutes } from "@/lib/routes/routes";

/** Checkout par distraction-free shell — header, footer aur tab bar sab "checkout mode" mein */
export function isCheckoutPath(pathname: string): boolean {
  return pathname.startsWith(customerRoutes.checkout);
}

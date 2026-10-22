import { LayoutDashboard, MapPin, Package, ShoppingBasket, type LucideIcon } from "lucide-react";
import { adminRoutes, customerRoutes } from "@/lib/routes/routes";
import type { IUser } from "@/services/auth/types";

export interface AccountLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Har role ke apne account links (header menu, mobile nav, footer) */
export function accountLinks(user: IUser): AccountLink[] {
  return user.role === "ADMIN"
    ? [{ label: "Admin dashboard", href: adminRoutes.dashboard, icon: LayoutDashboard }]
    : [
        { label: "My orders", href: customerRoutes.orders, icon: Package },
        { label: "Addresses", href: customerRoutes.addresses, icon: MapPin },
        { label: "Basket", href: customerRoutes.cart, icon: ShoppingBasket },
      ];
}

import { Info, ShoppingBag, TriangleAlert, UserPlus, type LucideIcon } from "lucide-react";
import type { NotificationKind } from "@/data/admin";

/** Notification ki qism — icon, rang aur screen-reader label (topbar bell + Notifications screen) */
export const NOTIFICATION_KINDS: Record<NotificationKind, { icon: LucideIcon; label: string; tone: string }> = {
  order: { icon: ShoppingBag, label: "Order", tone: "text-brand" },
  inventory: { icon: TriangleAlert, label: "Stock", tone: "text-tomato" },
  customer: { icon: UserPlus, label: "Customer", tone: "text-info" },
  system: { icon: Info, label: "System", tone: "text-muted-foreground" },
};

import {
  BadgePercent,
  Bell,
  Boxes,
  FolderTree,
  History,
  LayoutDashboard,
  LayoutGrid,
  Megaphone,
  Package,
  Quote,
  ReceiptText,
  Settings,
  ShieldAlert,
  Star,
  Tags,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { adminMockRoutes, adminRoutes } from "@/lib/routes/routes";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Static mock screen (user decision) — backend se connected nahi */
  demo?: boolean;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

/** Sidebar, command menu, page titles aur breadcrumbs — sab isi ek list se */
export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: adminRoutes.dashboard, icon: LayoutDashboard, demo: true }],
  },
  {
    label: "Catalogue",
    items: [
      { label: "Categories", href: adminRoutes.categories, icon: FolderTree },
      { label: "Products", href: adminRoutes.products, icon: Package },
      { label: "Brands", href: adminMockRoutes.brands, icon: Tags, demo: true },
      { label: "Allergens", href: adminMockRoutes.allergens, icon: ShieldAlert, demo: true },
    ],
  },
  {
    label: "Inventory",
    items: [
      { label: "Stock levels", href: adminRoutes.inventory, icon: Boxes },
      { label: "Stock movements", href: adminMockRoutes.inventoryTransactions, icon: History, demo: true },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Orders", href: adminRoutes.orders, icon: ReceiptText },
      { label: "Order board", href: adminMockRoutes.orderListing, icon: LayoutGrid, demo: true },
      { label: "Customers", href: adminRoutes.customers, icon: Users },
    ],
  },
  {
    label: "Marketing",
    items: [
      { label: "Promotions", href: adminMockRoutes.promotions, icon: Megaphone, demo: true },
      { label: "Coupons", href: adminMockRoutes.coupons, icon: BadgePercent, demo: true },
      { label: "Reviews", href: adminMockRoutes.reviews, icon: Star, demo: true },
      { label: "Testimonials", href: adminMockRoutes.testimonials, icon: Quote, demo: true },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Notifications", href: adminMockRoutes.notifications, icon: Bell, demo: true },
      { label: "Settings", href: adminMockRoutes.settings, icon: Settings, demo: true },
      { label: "Profile", href: adminMockRoutes.profile, icon: UserRound },
    ],
  },
];

const ALL_ITEMS = ADMIN_NAV.flatMap((group) => group.items);

/** `/admin/products/abc/edit` → Products item (sab se lamba matching href) */
export function activeNavItem(pathname: string): AdminNavItem | undefined {
  return ALL_ITEMS.filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)).sort(
    (a, b) => b.href.length - a.href.length,
  )[0];
}

/** Nested screens ka label (breadcrumb ka aakhri hissa) */
const SUB_PAGES: { pattern: RegExp; label: string }[] = [
  { pattern: /^\/admin\/products\/new$/, label: "New product" },
  { pattern: /^\/admin\/products\/[^/]+\/edit$/, label: "Edit product" },
  { pattern: /^\/admin\/orders\/[^/]+$/, label: "Order details" },
  { pattern: /^\/admin\/brands\/create$/, label: "New brand" },
];

export function adminSubPage(pathname: string): string | undefined {
  return SUB_PAGES.find(({ pattern }) => pattern.test(pathname))?.label;
}

import {
  Boxes,
  FolderTree,
  Home,
  MapPin,
  Package,
  ReceiptText,
  ShoppingBasket,
  Store,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { adminRoutes, customerRoutes, publicRoutes } from "@/lib/routes/routes";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Storefront header / mobile nav / footer ke primary links */
export const CUSTOMER_NAV: NavItem[] = [
  { label: "Home", href: publicRoutes.home, icon: Home },
  { label: "Shop", href: publicRoutes.shop, icon: Store },
  { label: "Basket", href: customerRoutes.cart, icon: ShoppingBasket },
  { label: "Orders", href: customerRoutes.orders, icon: Package },
  { label: "Addresses", href: customerRoutes.addresses, icon: MapPin },
  { label: "Profile", href: customerRoutes.profile, icon: UserRound },
];

/** Signed-in customer ke account menu links */
export const CUSTOMER_ACCOUNT_LINKS: NavItem[] = [
  { label: "My orders", href: customerRoutes.orders, icon: Package },
  { label: "Addresses", href: customerRoutes.addresses, icon: MapPin },
  { label: "Basket", href: customerRoutes.cart, icon: ShoppingBasket },
  { label: "Profile", href: customerRoutes.profile, icon: UserRound },
];

/** Admin sidebar, navbar breadcrumbs aur page titles — sab isi ek list se */
export const ADMIN_NAV: NavGroup[] = [
  {
    label: "Operations",
    items: [
      { label: "Orders", href: adminRoutes.orders, icon: ReceiptText },
      { label: "Customers", href: adminRoutes.customers, icon: Users },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { label: "Products", href: adminRoutes.products, icon: Package },
      { label: "Categories", href: adminRoutes.categories, icon: FolderTree },
      { label: "Inventory", href: adminRoutes.inventory, icon: Boxes },
    ],
  },
];

const ADMIN_ITEMS = ADMIN_NAV.flatMap((group) => group.items);

/** `/admin/products/abc/edit` → Products item (sab se lamba matching href) */
export function activeAdminNavItem(pathname: string): NavItem | undefined {
  return ADMIN_ITEMS.filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)).sort(
    (a, b) => b.href.length - a.href.length,
  )[0];
}

/** Nested screens ka label (breadcrumb ka aakhri hissa) */
const ADMIN_SUB_PAGES: { pattern: RegExp; label: string }[] = [
  { pattern: /^\/admin\/products\/new$/, label: "New product" },
  { pattern: /^\/admin\/products\/[^/]+\/edit$/, label: "Edit product" },
  { pattern: /^\/admin\/orders\/[^/]+$/, label: "Order details" },
];

export function adminSubPageLabel(pathname: string): string | undefined {
  return ADMIN_SUB_PAGES.find(({ pattern }) => pattern.test(pathname))?.label;
}

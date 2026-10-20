"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Archive,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  Database,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  Package,
  Quote,
  Search,
  Settings,
  ShieldAlert,
  ShoppingCart,
  Sparkles,
  Tag,
  Users,
  UserStar,
} from "lucide-react";
import { toast } from "sonner";
import { publicRoutes } from "@/lib/routes/routes";
import { useAuthStore } from "@/stores/auth-store";

/* ------------------------------------------------------------------ */
/* Class strings lifted from the production build                      */
/* ------------------------------------------------------------------ */

const MENU_BUTTON_CLASS =
  "group/menu-button peer/menu-button flex items-center gap-2 data-open:hover:bg-sidebar-accent active:bg-sidebar-accent aria-disabled:opacity-50 disabled:opacity-50 group-data-[collapsible=icon]:[&>span:last-child]:opacity-0 group-data-[collapsible=icon]:[&>span:last-child]:w-0 group-data-[collapsible=icon]:[&>span:last-child]:overflow-hidden p-2 group-data-[collapsible=icon]:p-2! group-has-data-[sidebar=menu-action]/menu-item:pr-8 rounded-[10px] group-data-[collapsible=icon]:rounded-[10px]! outline-hidden ring-sidebar-ring focus-visible:ring-2 w-full [&_svg]:size-4 group-data-[collapsible=icon]:size-9! overflow-hidden data-active:font-medium text-left [&>span:last-child]:truncate transition-[width,height,padding] [&>span:last-child]:transition-opacity duration-[50ms] [&>span:last-child]:duration-[50ms] data-active:text-sidebar-accent-foreground data-open:hover:text-sidebar-accent-foreground active:text-sidebar-accent-foreground aria-disabled:pointer-events-none disabled:pointer-events-none [&_svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm";

const MENU_ITEM_CLASS =
  "group/menu-item relative group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:px-0";

const MENU_CLASS = "flex flex-col gap-1 w-full min-w-0";

const GROUP_LABEL_CLASS =
  "group-data-[collapsible=icon]:hidden opacity-40 px-2 py-2 font-semibold text-fs-10 text-muted-foreground text-xs uppercase tracking-widest";

const SUB_BUTTON_CLASS =
  "flex items-center gap-2 px-2 py-1.5 rounded-[10px] w-full text-left text-sm text-white/70 hover:bg-sidebar-accent hover:text-white transition-colors data-active:bg-sidebar-accent data-active:text-white";

function CouponIcon() {
  return (
    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.53333 5.66667L10.3333 6.46667L5.8 11L5 10.2L9.53333 5.66667ZM2.33333 3H13C13.74 3 14.3333 3.59333 14.3333 4.33333V7C13.9797 7 13.6406 7.14048 13.3905 7.39052C13.1405 7.64057 13 7.97971 13 8.33333C13 8.68696 13.1405 9.02609 13.3905 9.27614C13.6406 9.52619 13.9797 9.66667 14.3333 9.66667V12.3333C14.3333 13.0733 13.74 13.6667 13 13.6667H2.33333C1.97971 13.6667 1.64057 13.5262 1.39052 13.2761C1.14048 13.0261 1 12.687 1 12.3333V9.66667C1.74 9.66667 2.33333 9.07333 2.33333 8.33333C2.33333 7.97971 2.19286 7.64057 1.94281 7.39052C1.69276 7.14048 1.35362 7 1 7V4.33333C1 3.97971 1.14048 3.64057 1.39052 3.39052C1.64057 3.14048 1.97971 3 2.33333 3ZM2.33333 4.33333V6.02667C2.73845 6.26027 3.0749 6.59644 3.30884 7.00137C3.54277 7.40629 3.66593 7.86569 3.66593 8.33333C3.66593 8.80098 3.54277 9.26037 3.30884 9.6653C3.0749 10.0702 2.73845 10.4064 2.33333 10.64V12.3333H13V10.64C12.5949 10.4064 12.2584 10.0702 12.0245 9.6653C11.7906 9.26037 11.6674 8.80098 11.6674 8.33333C11.6674 7.86569 11.7906 7.40629 12.0245 7.00137C12.2584 6.59644 12.5949 6.26027 13 6.02667V4.33333H2.33333ZM6 5.66667C6.55333 5.66667 7 6.11333 7 6.66667C7 7.22 6.55333 7.66667 6 7.66667C5.44667 7.66667 5 7.22 5 6.66667C5 6.11333 5.44667 5.66667 6 5.66667ZM9.33333 9C9.88667 9 10.3333 9.44667 10.3333 10C10.3333 10.5533 9.88667 11 9.33333 11C8.78 11 8.33333 10.5533 8.33333 10C8.33333 9.44667 8.78 9 9.33333 9Z"
        fill="currentColor"
      />
    </svg>
  );
}

type Leafish = { label: string; href: string };
type NavEntry =
  | { kind: "link"; label: string; href: string; icon: React.ReactNode }
  | { kind: "group"; label: string; icon: React.ReactNode; children: Leafish[] };

const NAV: { group: string; entries: NavEntry[] }[] = [
  {
    group: "Main",
    entries: [
      { kind: "link", label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard /> },
    ],
  },
  {
    group: "Management",
    entries: [
      { kind: "link", label: "Categories", href: "/admin/categories", icon: <Database /> },
      { kind: "link", label: "Products", href: "/admin/products", icon: <Archive /> },
      { kind: "link", label: "Brands", href: "/admin/brands", icon: <Tag /> },
      { kind: "link", label: "Allergens", href: "/admin/allergens", icon: <ShieldAlert /> },
      {
        kind: "group",
        label: "Inventory",
        icon: <Package />,
        children: [
          { label: "Inventory Management", href: "/admin/inventory" },
          { label: "Inventory Transactions", href: "/admin/inventory-transactions" },
        ],
      },
      { kind: "link", label: "Users", href: "/admin/customers", icon: <Users /> },
      { kind: "link", label: "Coupons", href: "/admin/coupons", icon: <CouponIcon /> },
      { kind: "link", label: "Promotions", href: "/admin/promotions", icon: <Sparkles /> },
      { kind: "link", label: "Reviews", href: "/admin/reviews", icon: <UserStar /> },
      { kind: "link", label: "Testimonials", href: "/admin/testimonials", icon: <Quote /> },
    ],
  },
  {
    group: "Operations",
    entries: [
      {
        kind: "group",
        label: "Orders",
        icon: <ShoppingCart />,
        children: [
          { label: "Order Management", href: "/admin/orders" },
          { label: "Order Listing", href: "/admin/order-listing" },
        ],
      },
    ],
  },
  {
    group: "Settings",
    entries: [
      {
        kind: "group",
        label: "Settings",
        icon: <Settings />,
        children: [
          { label: "Notification", href: "/admin/settings" },
          { label: "Profile", href: "/admin/profile" },
        ],
      },
    ],
  },
];

function CollapsibleEntry({ entry, pathname }: { entry: Extract<NavEntry, { kind: "group" }>; pathname: string }) {
  const containsActive = entry.children.some((c) => c.href === pathname);
  const [open, setOpen] = useState(containsActive);

  return (
    <li data-slot="sidebar-menu-item" data-sidebar="menu-item" className={MENU_ITEM_CLASS}>
      <button
        type="button"
        data-slot="sidebar-menu-button"
        data-sidebar="menu-button"
        data-size="default"
        {...(containsActive ? { "data-active": "" } : {})}
        className={MENU_BUTTON_CLASS}
        onClick={() => setOpen((v) => !v)}
      >
        {entry.icon}
        <span>{entry.label}</span>
        <ChevronDown
          className={`ml-auto w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul data-sidebar="menu-sub" className="flex flex-col gap-1 mt-1 ml-3">
          {entry.children.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                data-slot="sidebar-menu-sub-button"
                {...(pathname === c.href ? { "data-active": "" } : {})}
                className={SUB_BUTTON_CLASS}
              >
                <span>{c.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function SidebarBody({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const router = useRouter();
  const clearSession = useAuthStore((state) => state.logout);

  const logout = () => {
    clearSession();
    toast.success("Signed Out Successfully", {
      description: "You have been logged out. See you soon!",
    });
    router.push(publicRoutes.login);
  };

  return (
    <div data-sidebar="sidebar" data-slot="sidebar-inner" className="flex flex-col bg-sidebar size-full">
      <div data-slot="sidebar-header" data-sidebar="header" className="flex flex-col gap-2 p-2 relative px-3 py-3">
        <ul data-slot="sidebar-menu" data-sidebar="menu" className={MENU_CLASS}>
          <li data-slot="sidebar-menu-item" data-sidebar="menu-item" className={MENU_ITEM_CLASS}>
            <div className="flex items-center gap-2 w-full">
              <div className="flex justify-center items-center group-data-[collapsible=icon]:mx-auto rounded-18 w-8 h-8 [background:var(--gradient-brand-green)] shrink-0">
                <Leaf className="text-black" />
              </div>
              <div className="group-data-[collapsible=icon]:hidden flex flex-col flex-1 overflow-hidden">
                <span className="font-semibold text-base truncate leading-tight tracking-tight">Freshes</span>
                <span className="opacity-50 text-white text-xs truncate">UK · Fresh delivery</span>
              </div>
              <div className="group-data-[collapsible=icon]:hidden shrink-0">
                <button className="flex justify-center items-center rounded-full w-5 h-5 text-white/60 hover:text-white transition-colors shrink-0">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div
        data-slot="sidebar-content"
        data-sidebar="content"
        className="flex flex-col flex-1 gap-0 min-h-0 overflow-auto no-scrollbar px-3 py-2"
      >
        {NAV.map((section, i) => (
          <div key={section.group} className={i === 0 ? "mb-1" : "mt-3 mb-1"}>
            <p className={GROUP_LABEL_CLASS}>{section.group}</p>
            <ul data-slot="sidebar-menu" data-sidebar="menu" className={MENU_CLASS}>
              {section.entries.map((entry) =>
                entry.kind === "group" ? (
                  <CollapsibleEntry key={entry.label} entry={entry} pathname={pathname} />
                ) : (
                  <li
                    key={entry.href}
                    data-slot="sidebar-menu-item"
                    data-sidebar="menu-item"
                    className={MENU_ITEM_CLASS}
                  >
                    <Link
                      href={entry.href}
                      onClick={onNavigate}
                      data-slot="sidebar-menu-button"
                      data-sidebar="menu-button"
                      data-size="default"
                      {...(pathname === entry.href ? { "data-active": "" } : {})}
                      className={MENU_BUTTON_CLASS}
                    >
                      {entry.icon}
                      <span>{entry.label}</span>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>

      <div data-slot="sidebar-footer" data-sidebar="footer" className="flex flex-col gap-2 p-2 px-3 py-3">
        <button
          onClick={logout}
          className="flex items-center gap-2 hover:opacity-85 p-4 rounded-18 w-full [&_svg]:size-4 text-white [&_svg]:text-white text-sm transition-opacity cursor-pointer [background:var(--gradient-sidebar-logout)] [&_svg]:shrink-0"
        >
          <LogOut />
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className="group peer hidden md:block text-sidebar-foreground"
        data-state="expanded"
        data-collapsible=""
        data-variant="sidebar"
        data-side="left"
        data-slot="sidebar"
      >
        <div
          data-slot="sidebar-gap"
          className="relative w-(--sidebar-width) bg-transparent transition-[width] duration-300 ease-in-out group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180 group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        />
        <div
          data-slot="sidebar-container"
          data-side="left"
          className="fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) overflow-hidden transition-[left,right,width] duration-300 ease-in-out data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l border-r"
        >
          <SidebarBody pathname={pathname} />
        </div>
      </div>

      {/* Off-canvas copy for narrow viewports */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative w-(--sidebar-width) text-sidebar-foreground">
            <SidebarBody pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Top bar                                                             */
/* ------------------------------------------------------------------ */

const UNREAD_NOTIFICATIONS = 1;

/* Every admin route except the dashboard swaps the search field for a title
   and drops the date-range button, matching production. */
export const ADMIN_PAGE_TITLES: Record<string, string> = {
  "/admin/categories": "Category Management",
  "/admin/products": "Product Management",
  "/admin/products/new": "Create Product",
  "/admin/brands": "Brand Management",
  "/admin/brands/create": "Create Brand",
  "/admin/allergens": "Allergen Management",
  "/admin/inventory": "Inventory Management",
  "/admin/inventory-transactions": "Inventory Transactions",
  "/admin/customers": "User Management",
  "/admin/coupons": "Coupon Management",
  "/admin/promotions": "Promotion Management",
  "/admin/reviews": "Review Management",
  "/admin/testimonials": "Testimonial Management",
  "/admin/orders": "Order Management",
  "/admin/order-listing": "Order Listing",
  "/admin/settings": "Settings",
  "/admin/profile": "Profile",
  "/admin/notifications": "Notifications",
};

export function AdminNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const user = useAuthStore((state) => state.user);
  const pathname = usePathname();
  const router = useRouter();
  const title = ADMIN_PAGE_TITLES[pathname];
  const initials = (user?.name || "Admin User")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="top-0 z-40 isolate sticky flex justify-between items-center bg-navbar-bg p-4 md:px-5 border-navbar-border border-b">
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden flex justify-center items-center hover:bg-gray-100 rounded-lg w-8 h-8 text-gray-600 transition-colors shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title ? (
          <>
            {/* The create screens put a back control ahead of the title. */}
            {(pathname.endsWith("/create") || pathname.endsWith("/new")) && (
              <button
                type="button"
                aria-label="Go back"
                onClick={() => router.back()}
                className="flex justify-center items-center hover:bg-gray-100 rounded-lg w-8 h-8 text-gray-600 transition-colors shrink-0 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <span className="font-bold text-gray-dark text-lg md:text-3xl truncate leading-tight">{title}</span>
          </>
        ) : (
          <div className="sm:flex-1 sm:pr-4">
            <button
              type="button"
              aria-label="Search"
              className="sm:hidden flex justify-center items-center bg-white hover:bg-gray-50 border border-border-card rounded-15 w-9 h-9 text-gray-400 transition-colors shrink-0"
            >
              <Search className="w-4 h-4" />
            </button>
            <div className="hidden relative sm:block w-full">
              <Search className="-translate-y-1/2 absolute w-4 h-4 left-3 pointer-events-none text-gray-400 top-1/2" />
              <button
                type="button"
                className="bg-white border border-border-card hover:bg-gray-50 pl-9 pr-14 py-2.5 rounded-15 text-gray-400 text-left text-sm transition-colors w-full"
              >
                <span className="md:hidden">Search...</span>
                <span className="hidden md:inline">Search orders, products, customers...</span>
              </button>
              <div className="-translate-y-1/2 absolute flex gap-0.5 items-center pointer-events-none right-3 top-1/2">
                <kbd className="bg-activity-badge-bg flex items-center justify-center leading-none px-1.5 py-0.5 rounded-12 text-muted-green text-xs">
                  ⌘
                </kbd>
                <kbd className="bg-activity-badge-bg flex items-center justify-center leading-none px-1.5 py-0.5 rounded-12 text-muted-green text-xs">
                  K
                </kbd>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 items-center shrink-0">
        <div className="flex gap-5 items-center">
          <button
            type="button"
            aria-label={`Notifications (${UNREAD_NOTIFICATIONS} unread)`}
            data-slot="popover-trigger"
            className="relative flex justify-center items-center text-gray-500 transition-colors bg-icon-wrap-bg p-1.5 border border-border-card hover:border-brand-green rounded-full w-11 h-11"
          >
            <Bell className="w-5 h-5" />
            {UNREAD_NOTIFICATIONS > 0 && (
              <span className="top-1.5 right-1.5 absolute flex justify-center items-center bg-orange-400 rounded-full min-w-4 h-4 px-1 font-medium text-white text-3xs leading-none">
                {UNREAD_NOTIFICATIONS}
              </span>
            )}
          </button>

          {!title && (
            <button
              type="button"
              aria-label="Date filter: Last 7 Days"
              data-slot="popover-trigger"
              className="bg-brand-green flex font-medium gap-2 h-9 hover:opacity-90 items-center justify-center md:h-auto md:px-3 md:py-2 md:w-auto rounded-xl shrink-0 text-sm text-white transition-opacity w-9"
            >
              <CalendarDays className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline">Last 7 Days</span>
              <ChevronDown className="w-4 h-4 hidden md:inline shrink-0" />
            </button>
          )}

          <div className="border-border-card border-l flex gap-2.5 items-center pl-5">
            <div className="flex-col hidden sm:flex text-right">
              <span className="font-semibold leading-tight text-gray-800 text-sm">
                {user?.name || "Admin"}
              </span>
              <span className="text-gray-400 text-xs">Super Admin</span>
            </div>
            <div className="relative">
              <button
                type="button"
                className="cursor-pointer flex font-semibold h-9 items-center justify-center rounded-full select-none shrink-0 text-sm text-white w-9"
                style={{ background: "var(--gradient-avatar)" }}
              >
                {initials}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

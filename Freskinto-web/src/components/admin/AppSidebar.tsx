"use client";

import { ChevronsLeft, ChevronsRight, ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Logo } from "@/components/shared/Logo";
import { ADMIN_NAV, activeAdminNavItem, type NavItem } from "@/constants/navigation";
import { useLogout } from "@/hooks/useLogout";
import { adminRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn, initials } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

interface AppSidebarProps {
  /** Icon-rail mode (desktop) */
  collapsed?: boolean;
  /** Desktop collapse toggle — mobile drawer mein nahi diya jata */
  onToggleCollapsed?: () => void;
  /** Link click par drawer band karne ke liye */
  onNavigate?: () => void;
}

const ITEM_BASE =
  "relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-sidebar-ring";

function SidebarLink({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const className = cn(
    ITEM_BASE,
    collapsed && "justify-center px-0",
    active
      ? "bg-sidebar-accent text-sidebar-accent-foreground before:absolute before:left-0 before:h-5 before:w-0.5 before:rounded-full before:bg-sidebar-primary"
      : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
  );
  const content = (
    <>
      <Icon aria-hidden="true" className="size-4.5 shrink-0" />
      <span className={cn(collapsed && "sr-only")}>{item.label}</span>
    </>
  );

  if (!collapsed) {
    return (
      <Link href={item.href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={<Link href={item.href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={className} />}
      >
        {content}
      </TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

/** Collapsible admin rail: grouped nav, active indicator, user + sign-out neeche */
export function AppSidebar({ collapsed = false, onToggleCollapsed, onNavigate }: AppSidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const active = activeAdminNavItem(pathname);

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div
        className={cn(
          "flex h-navbar shrink-0 items-center border-b border-sidebar-border",
          collapsed ? "justify-center px-2" : "px-4",
        )}
      >
        <Link
          href={adminRoutes.orders}
          onClick={onNavigate}
          aria-label="Freskinto admin home"
          className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring"
        >
          <Logo size="sm" inverse markOnly={collapsed} />
        </Link>
      </div>

      <nav aria-label="Admin" className="flex-1 overflow-y-auto p-3">
        {ADMIN_NAV.map((group) => (
          <div key={group.label} className="mb-5 last:mb-0">
            {collapsed ? (
              <div aria-hidden="true" className="mx-2 mb-2 h-px bg-sidebar-border" />
            ) : (
              <p className="mb-2 px-3 text-fs-11 font-semibold tracking-widest text-sidebar-muted uppercase">{group.label}</p>
            )}
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  <SidebarLink item={item} active={active?.href === item.href} collapsed={collapsed} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-1 border-t border-sidebar-border p-3">
        <SidebarLink
          item={{ label: "View storefront", href: publicRoutes.shop, icon: ExternalLink }}
          active={false}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />

        {user && (
          <div className={cn("flex items-center gap-3 rounded-lg px-2 py-2", collapsed && "justify-center px-0")}>
            <Avatar size="sm" className="size-8 shrink-0">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">{initials(user.name)}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex min-w-0 flex-col">
                <p className="truncate text-sm font-medium text-sidebar-foreground">{user.name}</p>
                <p className="truncate text-fs-11 text-sidebar-muted">{user.email}</p>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={logout}
          aria-label="Sign out"
          className={cn(ITEM_BASE, "w-full text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", collapsed && "justify-center px-0")}
        >
          <LogOut aria-hidden="true" className="size-4.5 shrink-0" />
          <span className={cn(collapsed && "sr-only")}>Sign out</span>
        </button>

        {onToggleCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={collapsed}
            className={cn(ITEM_BASE, "w-full text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", collapsed && "justify-center px-0")}
          >
            {collapsed ? (
              <ChevronsRight aria-hidden="true" className="size-4.5 shrink-0" />
            ) : (
              <ChevronsLeft aria-hidden="true" className="size-4.5 shrink-0" />
            )}
            <span className={cn(collapsed && "sr-only")}>Collapse</span>
          </button>
        )}
      </div>
    </div>
  );
}

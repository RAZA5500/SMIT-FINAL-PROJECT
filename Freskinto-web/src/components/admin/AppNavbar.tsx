"use client";

import { ExternalLink, LogOut, Menu, PanelLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { PageBreadcrumbs, type Crumb } from "@/components/shared/PageBreadcrumbs";
import { activeAdminNavItem, adminSubPageLabel } from "@/constants/navigation";
import { useLogout } from "@/hooks/useLogout";
import { adminRoutes, publicRoutes } from "@/lib/routes/routes";
import { initials } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

interface AppNavbarProps {
  /** Phone: sidebar drawer kholo */
  onOpenMenu: () => void;
  /** Desktop: sidebar rail toggle */
  onToggleSidebar: () => void;
}

/** Admin top bar: menu/collapse, breadcrumbs, storefront link, user menu */
export function AppNavbar({ onOpenMenu, onToggleSidebar }: AppNavbarProps) {
  const pathname = usePathname();
  const logout = useLogout();
  const user = useAuthStore((state) => state.user);
  const item = activeAdminNavItem(pathname);
  const subPage = adminSubPageLabel(pathname);

  const crumbs: Crumb[] = [
    ...(item ? [{ label: item.label, href: subPage ? item.href : undefined }] : []),
    ...(subPage ? [{ label: subPage }] : []),
  ];

  return (
    <header className="sticky top-0 z-30 flex h-navbar shrink-0 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur-md sm:px-6">
      <Button variant="ghost" size="icon-sm" className="lg:hidden" aria-label="Open navigation" onClick={onOpenMenu}>
        <Menu aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="hidden text-muted-foreground lg:inline-flex"
        aria-label="Toggle sidebar"
        onClick={onToggleSidebar}
      >
        <PanelLeft aria-hidden="true" />
      </Button>

      <PageBreadcrumbs root={{ label: "Admin", href: adminRoutes.orders }} items={crumbs} className="min-w-0 flex-1" />

      <ButtonLink href={publicRoutes.shop} variant="outline" size="sm" className="hidden sm:inline-flex">
        <ExternalLink aria-hidden="true" />
        View storefront
      </ButtonLink>

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Account menu" className="rounded-full" />}>
            <Avatar size="sm" className="size-8">
              <AvatarFallback className="bg-brand-green-forest text-white">{initials(user.name)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <span className="flex flex-col gap-0.5">
                  <span className="truncate text-sm font-semibold text-foreground">{user.name}</span>
                  <span className="truncate text-fs-12 font-normal text-muted-foreground">{user.email}</span>
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={logout}>
              <LogOut aria-hidden="true" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}

"use client";

import { ChevronsUpDown, LogOut, Store } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLogout } from "@/hooks/useLogout";
import { initials } from "@/lib/format";
import { adminRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { ADMIN_NAV, activeNavItem } from "./admin-nav";

export function AdminSidebar() {
  const pathname = usePathname();
  const active = activeNavItem(pathname);
  const { isMobile, setOpenMobile } = useSidebar();
  // Mobile sheet link click par band ho
  const closeOnMobile = () => isMobile && setOpenMobile(false);

  return (
    <Sidebar collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="px-3 py-4">
        <Link
          href={adminRoutes.dashboard}
          onClick={closeOnMobile}
          aria-label="Freskinto admin home"
          className="flex items-center gap-2 rounded-lg group-data-[collapsible=icon]:justify-center"
        >
          <Logo size="sm" className="group-data-[collapsible=icon]:hidden" />
          <Logo size="sm" markOnly className="hidden group-data-[collapsible=icon]:inline-flex" />
          <span className="ml-auto rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand group-data-[collapsible=icon]:hidden">
            Admin
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="scrollbar-thin">
        {ADMIN_NAV.map((group) => (
          <SidebarGroup key={group.label} className="py-1.5">
            <SidebarGroupLabel className="text-xs tracking-widest text-muted-foreground uppercase">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => {
                  const isActive = active?.href === item.href;
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.label}
                        render={<Link href={item.href} onClick={closeOnMobile} />}
                        // Active: green pill + white text (hover par bhi wahi rahe)
                        className="h-9 rounded-lg text-sidebar-foreground/80 data-active:bg-primary data-active:text-primary-foreground data-active:hover:bg-primary data-active:hover:text-primary-foreground"
                      >
                        <Icon className={cn(isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                      {item.demo && (
                        <SidebarMenuBadge
                          className={cn(
                            "top-2 rounded-full px-1.5 text-xs font-medium",
                            isActive ? "bg-white/20 text-primary-foreground" : "bg-muted text-muted-foreground",
                          )}
                        >
                          Demo
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <AdminUserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function AdminUserMenu() {
  const router = useRouter();
  const logout = useLogout();
  const user = useAuthStore((state) => state.user);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="rounded-xl bg-muted hover:bg-accent aria-expanded:bg-accent data-popup-open:bg-accent"
              />
            }
          >
            <Avatar className="size-8 rounded-lg after:rounded-lg">
              <AvatarFallback className="rounded-lg bg-brand text-xs font-bold text-white">
                {initials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <span className="flex min-w-0 flex-1 flex-col text-left leading-tight">
              <span className="truncate text-sm font-semibold">{user?.name ?? "Admin"}</span>
              <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
            </span>
            <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" sideOffset={8} className="w-60">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-foreground">{user?.name ?? "Admin"}</span>
                <span className="text-xs font-normal">Store administrator</span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(publicRoutes.home)}>
              <Store aria-hidden="true" />
              View storefront
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={logout}>
              <LogOut aria-hidden="true" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

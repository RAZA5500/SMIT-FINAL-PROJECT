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
          <Logo variant="inverse" size="sm" className="group-data-[collapsible=icon]:hidden" />
          <Logo variant="inverse" size="sm" markOnly className="hidden group-data-[collapsible=icon]:inline-flex" />
          <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-lime group-data-[collapsible=icon]:hidden">
            Admin
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="scrollbar-thin">
        {ADMIN_NAV.map((group) => (
          <SidebarGroup key={group.label} className="py-1.5">
            <SidebarGroupLabel className="text-xs tracking-widest text-sidebar-foreground/45 uppercase">
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
                        className={cn(
                          "h-9 rounded-lg text-sidebar-foreground/75 hover:text-white",
                          isActive && "text-white",
                        )}
                      >
                        <Icon className={cn(isActive ? "text-lime" : "text-sidebar-foreground/55")} />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                      {item.demo && (
                        <SidebarMenuBadge className="top-2 rounded-full bg-white/8 px-1.5 text-xs font-medium text-sidebar-foreground/50">
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
                className="rounded-xl bg-white/5 hover:bg-white/10 aria-expanded:bg-white/10 data-popup-open:bg-white/10"
              />
            }
          >
            <Avatar className="size-8 rounded-lg after:rounded-lg">
              <AvatarFallback className="rounded-lg bg-lime text-xs font-bold text-lime-foreground">
                {initials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <span className="flex min-w-0 flex-1 flex-col text-left leading-tight">
              <span className="truncate text-sm font-semibold text-white">{user?.name ?? "Admin"}</span>
              <span className="truncate text-xs text-sidebar-foreground/60">{user?.email}</span>
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

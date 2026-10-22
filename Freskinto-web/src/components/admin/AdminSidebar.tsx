"use client";

import { ChevronsUpDown, LogOut, Store } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Stack } from "@/components/ui/flex";
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
import { Text } from "@/components/ui/typography";
import { Logo } from "@/components/shared/Logo";
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
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className={cn("px-2 py-3")}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href={adminRoutes.dashboard} onClick={closeOnMobile} aria-label="Freskinto admin home" />}
              className={cn("hover:bg-transparent active:bg-transparent")}
            >
              <Logo size="sm" markOnly />
              <Stack gap="0.5" className={cn("min-w-0")}>
                <Text as="span" weight="bold" className={cn("text-lg font-bold font-serif leading-none tracking-tight text-sidebar-foreground")}>
                  Freskinto
                </Text>
                <Text as="span" variant="small" className={cn("text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider")}>
                  Back office
                </Text>
              </Stack>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className={cn("scrollbar-thin")}>
        {ADMIN_NAV.map((group) => (
          <SidebarGroup key={group.label} className={cn("py-1")}>
            <SidebarGroupLabel className={cn("text-xs font-semibold tracking-wider text-sidebar-foreground/60 uppercase")}>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className={cn("gap-0.5")}>
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
                           "h-9 rounded-lg font-medium text-sidebar-foreground/80 transition-colors data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground data-active:font-semibold data-active:hover:bg-sidebar-primary data-active:hover:text-sidebar-primary-foreground",
                         )}
                       >
                         <Icon className={cn(isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/60")} />
                         <Text as="span">{item.label}</Text>
                       </SidebarMenuButton>
                       {item.demo && (
                         <SidebarMenuBadge
                           className={cn(
                             "top-2 rounded-md px-1.5 py-0.5 text-xs font-medium uppercase",
                             isActive ? "text-sidebar-primary-foreground/90 bg-sidebar-primary-foreground/15" : "text-sidebar-foreground/60 bg-white/10",
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

      <SidebarFooter className={cn("p-2")}>
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
                className={cn("rounded-xl bg-sidebar-accent text-sidebar-foreground ring-1 ring-sidebar-border hover:bg-sidebar-accent/80 data-popup-open:bg-sidebar-accent")}
              />
            }
          >
            <Avatar className={cn("size-8 rounded-lg after:rounded-lg")}>
              <AvatarFallback className={cn("rounded-lg bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground")}>
                {initials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <Stack gap="0.5" className={cn("min-w-0 flex-1 text-left")}>
              <Text as="span" weight="semibold" className={cn("truncate leading-tight text-sidebar-foreground")}>
                {user?.name ?? "Admin"}
              </Text>
              <Text as="span" variant="small" className={cn("truncate text-sidebar-foreground/60")}>
                {user?.email}
              </Text>
            </Stack>
            <ChevronsUpDown className={cn("ml-auto size-4 text-sidebar-foreground/60")} />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" sideOffset={8} className={cn("w-60")}>
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <Stack gap="1">
                  <Text as="span" weight="semibold" tone="default">
                    {user?.name ?? "Admin"}
                  </Text>
                  <Badge variant="brand" className={cn("w-fit text-xs")}>
                    Store administrator
                  </Badge>
                </Stack>
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

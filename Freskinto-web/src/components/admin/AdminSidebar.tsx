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
                <Text as="span" family="serif" weight="semibold" className={cn("serif-soft text-lg leading-none")}>
                  Freskinto
                </Text>
                <Text as="span" variant="code" tone="muted" className={cn("uppercase")}>
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
            <SidebarGroupLabel className={cn("font-mono text-xs tracking-widest uppercase")}>{group.label}</SidebarGroupLabel>
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
                        // Active: emerald pill + white text (hover par bhi wahi rahe)
                        className={cn(
                          "h-9 rounded-lg text-sidebar-foreground/80 data-active:bg-primary data-active:text-primary-foreground data-active:hover:bg-primary data-active:hover:text-primary-foreground",
                        )}
                      >
                        <Icon className={cn(isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                        <Text as="span">{item.label}</Text>
                      </SidebarMenuButton>
                      {item.demo && (
                        <SidebarMenuBadge
                          className={cn(
                            "top-2 rounded-md font-mono text-xs uppercase",
                            isActive ? "text-primary-foreground/80" : "text-muted-foreground",
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
                className={cn("rounded-xl bg-background ring-1 ring-sidebar-border hover:bg-background data-popup-open:bg-background")}
              />
            }
          >
            <Avatar className={cn("size-8 rounded-lg after:rounded-lg")}>
              <AvatarFallback className={cn("rounded-lg bg-primary text-xs font-bold text-primary-foreground")}>
                {initials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <Stack gap="0.5" className={cn("min-w-0 flex-1 text-left")}>
              <Text as="span" weight="semibold" className={cn("truncate leading-tight")}>
                {user?.name ?? "Admin"}
              </Text>
              <Text as="span" variant="small" tone="muted" className={cn("truncate")}>
                {user?.email}
              </Text>
            </Stack>
            <ChevronsUpDown className={cn("ml-auto size-4 text-muted-foreground")} />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" sideOffset={8} className={cn("w-60")}>
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <Stack gap="1">
                  <Text as="span" weight="semibold" tone="default">
                    {user?.name ?? "Admin"}
                  </Text>
                  <Badge variant="tag" className={cn("w-fit")}>
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

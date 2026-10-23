"use client";

import { ExternalLink, LogOut, MoreVertical } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Text } from "@/components/ui/typography";
import { Logo } from "@/components/shared/Logo";
import { ADMIN_NAV, activeAdminNavItem } from "@/constants/navigation";
import { useLogout } from "@/hooks/useLogout";
import { adminRoutes, publicRoutes } from "@/lib/routes/routes";
import { initials } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const ACTIVE_ITEM =
  "h-9 rounded-xl px-2.5 data-active:bg-card data-active:font-semibold data-active:text-sidebar-accent-foreground data-active:shadow-soft data-active:[&>svg]:text-brand-ink dark:data-active:bg-sidebar-accent dark:data-active:shadow-none dark:data-active:[&>svg]:text-brand";

/** shadcn Sidebar — sage rail, active item ek uthi hui safed pill (green icon), icon-collapse (⌘B) aur phone par sheet */
export function AppSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const { isMobile, setOpenMobile } = useSidebar();
  const active = activeAdminNavItem(pathname);
  const closeOnMobile = () => isMobile && setOpenMobile(false);

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="h-16 justify-center px-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Freskinto admin"
              render={<Link href={adminRoutes.home} onClick={closeOnMobile} aria-label="Freskinto admin home" />}
              className="hover:bg-transparent group-data-[collapsible=icon]:justify-center"
            >
              <Logo size="sm" className="group-data-[collapsible=icon]:[&>span:last-child]:hidden" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />

      <SidebarContent className="py-2">
        {ADMIN_NAV.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-xs text-sidebar-foreground/60">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={active?.href === item.href}
                        tooltip={item.label}
                        render={
                          <Link
                            href={item.href}
                            onClick={closeOnMobile}
                            aria-current={active?.href === item.href ? "page" : undefined}
                          />
                        }
                        className={ACTIVE_ITEM}
                      >
                        <Icon aria-hidden="true" />
                        <Text as="span" tone="inherit">
                          {item.label}
                        </Text>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="gap-1 p-3">
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="View storefront"
              render={<Link href={publicRoutes.shop} onClick={closeOnMobile} />}
              className="h-9 px-2.5 text-sidebar-foreground/75"
            >
              <ExternalLink aria-hidden="true" />
              <Text as="span" tone="inherit">
                View storefront
              </Text>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user && (
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      tooltip={user.name}
                      aria-label="Account menu"
                      className="px-2 data-popup-open:bg-sidebar-accent"
                    />
                  }
                >
                  <Avatar size="sm" className="size-8 shrink-0">
                    <AvatarFallback className="text-xs">{initials(user.name)}</AvatarFallback>
                  </Avatar>
                  <Stack as="span" className="min-w-0 flex-1">
                    <Text as="span" tone="inherit" weight="semibold" className="truncate">
                      {user.name}
                    </Text>
                    <Text as="span" tone="inherit" className="truncate text-fs-11 opacity-60">
                      {user.email}
                    </Text>
                  </Stack>
                  <MoreVertical aria-hidden="true" className="ml-auto" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side={isMobile ? "top" : "right"} align="end" className="w-60">
                  <DropdownMenuLabel>
                    <Stack as="span" gap="0.5">
                      <Text as="span" weight="semibold" className="truncate">
                        {user.name}
                      </Text>
                      <Text as="span" tone="muted" weight="normal" className="truncate text-fs-12">
                        {user.email}
                      </Text>
                    </Stack>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={logout}>
                    <LogOut aria-hidden="true" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

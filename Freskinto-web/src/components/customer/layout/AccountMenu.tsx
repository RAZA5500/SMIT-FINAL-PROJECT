"use client";

import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { CUSTOMER_ACCOUNT_LINKS, type NavItem } from "@/constants/navigation";
import { useLogout } from "@/hooks/useLogout";
import { adminRoutes, publicRoutes } from "@/lib/routes/routes";
import { initials } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const ADMIN_LINKS: NavItem[] = [{ label: "Admin workspace", href: adminRoutes.orders, icon: LayoutDashboard }];

/** Header account: guest ko "Sign in", signed-in ko avatar menu */
export function AccountMenu() {
  const router = useRouter();
  const logout = useLogout();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  // Hydration se pehle khali jagah — "Sign in" flash na ho
  if (!hasHydrated) return <span aria-hidden="true" className="inline-block size-10" />;

  if (!token || !user) {
    return (
      <ButtonLink href={publicRoutes.login} variant="ghost" className="rounded-full px-3">
        <UserRound aria-hidden="true" />
        <span className="hidden font-semibold lg:inline">Sign in</span>
        <span className="sr-only lg:hidden">Sign in</span>
      </ButtonLink>
    );
  }

  const links = user.role === "ADMIN" ? ADMIN_LINKS : CUSTOMER_ACCOUNT_LINKS;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" aria-label="Account menu" className="gap-2 rounded-full pr-3 pl-1.5" />}
      >
        <Avatar size="sm" className="size-8">
          <AvatarFallback className="bg-brand-green-forest text-white">{initials(user.name)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-28 truncate font-semibold lg:inline">{user.name.split(" ")[0]}</span>
        <ChevronDown aria-hidden="true" className="hidden text-muted-foreground lg:inline" />
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
        <DropdownMenuGroup>
          {links.map(({ label, href, icon: Icon }) => (
            <DropdownMenuItem key={href} onClick={() => router.push(href)}>
              <Icon aria-hidden="true" />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={logout}>
          <LogOut aria-hidden="true" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { ChevronDown, LayoutDashboard, LogOut, MapPin, Package, ShoppingBasket, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/useLogout";
import { initials } from "@/lib/format";
import { adminRoutes, customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import type { IUser } from "@/services/auth/types";
import { useAuthStore } from "@/stores/auth-store";

/** Har role ke apne account links */
export function accountLinks(user: IUser) {
  return user.role === "ADMIN"
    ? [{ label: "Admin dashboard", href: adminRoutes.dashboard, icon: LayoutDashboard }]
    : [
        { label: "My orders", href: customerRoutes.orders, icon: Package },
        { label: "Addresses", href: customerRoutes.addresses, icon: MapPin },
        { label: "Basket", href: customerRoutes.cart, icon: ShoppingBasket },
      ];
}

/** Header account: guest ko "Sign in", signed-in ko avatar menu */
export function AccountMenu() {
  const router = useRouter();
  const logout = useLogout();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  // Hydration se pehle khali jagah — "Sign in" flash na ho
  if (!hasHydrated) return <span className="size-11" aria-hidden="true" />;

  if (!token || !user) {
    return (
      <Link href={publicRoutes.login} className={cn(buttonVariants({ variant: "ghost" }), "h-11 px-3")}>
        <UserRound className="size-5" aria-hidden="true" />
        <span className="hidden lg:inline">Sign in</span>
        <span className="sr-only lg:hidden">Sign in</span>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="inline-flex h-11 items-center gap-2 rounded-full pr-2.5 pl-1 transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 aria-expanded:bg-muted"
      >
        <Avatar className="size-9">
          <AvatarFallback className="bg-brand-soft text-sm font-semibold text-brand">{initials(user.name)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-28 truncate text-sm font-medium lg:inline">{user.name.split(" ")[0]}</span>
        <ChevronDown className="hidden size-4 text-muted-foreground lg:inline" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
            <span className="truncate text-sm font-semibold text-foreground">{user.name}</span>
            <span className="truncate text-xs font-normal">{user.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {accountLinks(user).map(({ label, href, icon: Icon }) => (
          <DropdownMenuItem key={href} onClick={() => router.push(href)}>
            <Icon aria-hidden="true" />
            {label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={logout}>
          <LogOut aria-hidden="true" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

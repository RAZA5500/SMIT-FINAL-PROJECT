"use client";

import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
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
import { Stack } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { useLogout } from "@/hooks/useLogout";
import { initials } from "@/lib/format";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { accountLinks } from "./account-links";

/** Header account: guest ko "Sign in", signed-in ko avatar menu */
export function AccountMenu() {
  const router = useRouter();
  const logout = useLogout();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  // Hydration se pehle khali jagah — "Sign in" flash na ho
  if (!hasHydrated) return <Box aria-hidden="true" className={cn("size-10")} />;

  if (!token || !user) {
    return (
      <ButtonLink href={publicRoutes.login} variant="ghost" className={cn("px-3")}>
        <UserRound data-icon="inline-start" aria-hidden="true" />
        <Text as="span" className={cn("hidden font-semibold lg:inline")}>
          Sign in
        </Text>
        <Text as="span" className={cn("sr-only lg:hidden")}>
          Sign in
        </Text>
      </ButtonLink>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" aria-label="Account menu" className={cn("gap-2 pr-3 pl-1.5")} />}
      >
        <Avatar className={cn("size-8")}>
          <AvatarFallback className={cn("bg-primary text-xs font-semibold text-primary-foreground")}>
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
        <Text as="span" weight="semibold" className={cn("hidden max-w-28 truncate lg:inline")}>
          {user.name.split(" ")[0]}
        </Text>
        <ChevronDown aria-hidden="true" className={cn("hidden text-muted-foreground lg:inline")} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className={cn("w-64")}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <Stack gap="0.5">
              <Text as="span" weight="semibold" tone="default" className={cn("truncate")}>
                {user.name}
              </Text>
              <Text as="span" variant="small" tone="muted" className={cn("truncate")}>
                {user.email}
              </Text>
            </Stack>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {accountLinks(user).map(({ label, href, icon: Icon }) => (
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

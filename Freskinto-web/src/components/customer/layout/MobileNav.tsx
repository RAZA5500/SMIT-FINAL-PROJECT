"use client";

import { ArrowUpRight, LayoutDashboard, LogIn, LogOut, Moon, ShoppingBag, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/typography";
import { AisleBadge } from "@/components/shared/AisleBadge";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { CUSTOMER_NAV } from "@/constants/navigation";
import { STORE } from "@/constants/store";
import { useLogout } from "@/hooks/useLogout";
import { useTheme } from "@/hooks/useTheme";
import { adminRoutes, customerRoutes, publicRoutes, shopUrl } from "@/lib/routes/routes";
import { cn, initials } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useShopStore } from "@/stores/shop-store";
import { useAisles } from "../shop/use-aisles";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LINK_CLASS =
  "group/link h-14 w-full animate-fade-up justify-between rounded-2xl px-4 font-display text-xl font-semibold tracking-[-0.03em]";
/** Har link thoda der se aata hai — drawer khulte hi ek lehar */
const stagger = (index: number) => ({ animationDelay: `${80 + index * 55}ms` }) as CSSProperties;

/** Phone ka menu drawer — bade display links (lehar mein), account, aisles grid, dark mode, sign in/out */
export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();
  const logout = useLogout();
  const setCartOpen = useShopStore((state) => state.setCartOpen);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const { aisles } = useAisles();
  const { theme, setTheme } = useTheme();
  const signedIn = hasHydrated && Boolean(token) && Boolean(user);
  const isCustomer = signedIn && user?.role === "CUSTOMER";

  const close = () => onOpenChange(false);
  // Guest ko Home, Shop aur Basket; customer ko poora account
  const links = CUSTOMER_NAV.filter(
    (item) =>
      isCustomer ||
      item.href === publicRoutes.home ||
      item.href === publicRoutes.shop ||
      item.href === customerRoutes.cart,
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="gap-0 p-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle>
            <Logo size="md" />
          </SheetTitle>
          <SheetDescription>{STORE.tagline}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <Stack gap="6" className="p-3 pb-6">
            {signedIn && user && (
              <Flex align="center" gap="3" className="animate-fade-up rounded-2xl border border-brand/20 bg-fresh-soft p-3 shadow-xs dark:border-white/10">
                <Avatar size="lg">
                  <AvatarFallback>{initials(user.name)}</AvatarFallback>
                </Avatar>
                <Stack className="min-w-0">
                  <Text weight="bold" className="truncate">
                    {user.name}
                  </Text>
                  <Text tone="muted" className="truncate text-fs-12">
                    {user.email}
                  </Text>
                </Stack>
              </Flex>
            )}

            <Stack as="nav" aria-label="Menu" gap="0.5">
              {links.map(({ label, href }, index) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                if (href === customerRoutes.cart) {
                  return (
                    <Button
                      key={href}
                      variant="ghost"
                      className={LINK_CLASS}
                      style={stagger(index)}
                      onClick={() => {
                        close();
                        setCartOpen(true);
                      }}
                    >
                      Basket
                      <ShoppingBag aria-hidden="true" className="size-5 text-muted-foreground" />
                    </Button>
                  );
                }
                return (
                  <Button
                    key={href}
                    variant="ghost"
                    nativeButton={false}
                    style={stagger(index)}
                    render={<Link href={href} onClick={close} aria-current={active ? "page" : undefined} />}
                    className={cn(LINK_CLASS, active && "bg-foreground/[0.06]")}
                  >
                    {label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-5 text-muted-foreground transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                    />
                  </Button>
                );
              })}
            </Stack>

            {aisles.length > 0 && (
              <Stack gap="2.5" className="px-1">
                <Text variant="eyebrow" tone="muted" className="px-1">
                  Aisles
                </Text>
                <Grid cols="3" gap="2">
                  {aisles.map((aisle, index) => (
                    <Button
                      key={aisle.id}
                      variant="ghost"
                      nativeButton={false}
                      render={<Link href={shopUrl({ category: aisle.id })} onClick={close} />}
                      style={stagger(links.length + index)}
                      className="h-auto animate-fade-up flex-col gap-2 rounded-2xl px-1 py-3 text-xs font-semibold whitespace-normal"
                    >
                      <AisleBadge name={aisle.name} size="lg" />
                      <Text as="span" tone="inherit" className="line-clamp-2 text-center text-xs leading-tight">
                        {aisle.name}
                      </Text>
                    </Button>
                  ))}
                </Grid>
              </Stack>
            )}

            <Flex align="center" justify="between" gap="3" className="rounded-2xl border border-border px-4 py-3">
              <Flex as="span" align="center" gap="3">
                <Moon aria-hidden="true" className="size-4" />
                <Label htmlFor="mobile-dark-mode" className="text-base font-medium">
                  Dark mode
                </Label>
              </Flex>
              <Switch
                id="mobile-dark-mode"
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </Flex>

            {signedIn && user?.role === "ADMIN" && (
              <ButtonLink href={adminRoutes.home} variant="secondary" size="lg" className="w-full" onClick={close}>
                <LayoutDashboard aria-hidden="true" />
                Admin workspace
              </ButtonLink>
            )}
          </Stack>
        </ScrollArea>

        <SheetFooter>
          {signedIn ? (
            <Button
              variant="destructive-outline"
              size="lg"
              onClick={() => {
                close();
                logout();
              }}
            >
              <LogOut aria-hidden="true" />
              Sign out
            </Button>
          ) : (
            <Box className="grid gap-2">
              <ButtonLink href={publicRoutes.login} variant="fresh" size="lg" onClick={close}>
                <LogIn aria-hidden="true" />
                Sign in
              </ButtonLink>
              <ButtonLink href={publicRoutes.register} variant="outline" size="lg" onClick={close}>
                <UserPlus aria-hidden="true" />
                Create an account
              </ButtonLink>
            </Box>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

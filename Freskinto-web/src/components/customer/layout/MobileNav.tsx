"use client";

import { LayoutDashboard, LogIn, LogOut, Moon, ShoppingBasket, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { CUSTOMER_NAV } from "@/constants/navigation";
import { STORE } from "@/constants/store";
import { useLogout } from "@/hooks/useLogout";
import { useTheme } from "@/hooks/useTheme";
import { categoryTheme, TONE_CLASSES } from "@/lib/merchandising";
import { adminRoutes, customerRoutes, publicRoutes, shopUrl } from "@/lib/routes/routes";
import { cn, initials } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useShopStore } from "@/stores/shop-store";
import { useAisles } from "../shop/use-aisles";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LINK_CLASS = "h-12 w-full justify-start gap-3 rounded-xl px-4 text-base font-medium";

/** Phone ka menu drawer — account block, links, aisles accordion, sign in/out */
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

        {signedIn && user && (
          <Flex align="center" gap="3" className="border-b border-border bg-plum-soft px-5 py-4">
            <Avatar size="lg">
              <AvatarFallback className="bg-primary font-bold text-primary-foreground">{initials(user.name)}</AvatarFallback>
            </Avatar>
            <Stack className="min-w-0">
              <Text weight="semibold" className="truncate">
                {user.name}
              </Text>
              <Text tone="muted" className="truncate text-fs-12">
                {user.email}
              </Text>
            </Stack>
          </Flex>
        )}

        <ScrollArea className="min-h-0 flex-1">
          <Stack as="nav" aria-label="Menu" gap="1" className="p-3">
            {links.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              if (href === customerRoutes.cart) {
                return (
                  <Button
                    key={href}
                    variant="ghost"
                    className={LINK_CLASS}
                    onClick={() => {
                      close();
                      setCartOpen(true);
                    }}
                  >
                    <ShoppingBasket aria-hidden="true" />
                    Basket
                  </Button>
                );
              }
              return (
                <Button
                  key={href}
                  variant="ghost"
                  nativeButton={false}
                  render={<Link href={href} onClick={close} aria-current={active ? "page" : undefined} />}
                  className={cn(LINK_CLASS, active && "bg-plum-soft text-accent-foreground")}
                >
                  <Icon aria-hidden="true" />
                  {label}
                </Button>
              );
            })}

            {aisles.length > 0 && (
              <Accordion className="mt-2 rounded-xl border border-border px-1">
                <AccordionItem value="aisles">
                  <AccordionTrigger className="px-3 py-3 text-base hover:no-underline">Browse aisles</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-1 px-1 pb-2 [&_a]:no-underline">
                    {aisles.map((aisle) => {
                      const visual = categoryTheme(aisle.name);
                      const Icon = visual.icon;
                      return (
                        <Button
                          key={aisle.id}
                          variant="ghost"
                          nativeButton={false}
                          render={<Link href={shopUrl({ category: aisle.id })} onClick={close} />}
                          className="h-11 justify-start gap-3 rounded-lg px-2 font-medium"
                        >
                          <Flex
                            as="span"
                            align="center"
                            justify="center"
                            aria-hidden="true"
                            className={cn("size-8 rounded-lg", TONE_CLASSES[visual.tone].chip)}
                          >
                            <Icon />
                          </Flex>
                          {aisle.name}
                        </Button>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            <Flex align="center" justify="between" gap="3" className="mt-2 rounded-xl border border-border px-4 py-3">
              <Flex as="span" align="center" gap="3">
                <Moon aria-hidden="true" className="size-4" />
                <Label htmlFor="mobile-dark-mode" className="text-base">
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
              <ButtonLink href={adminRoutes.orders} variant="soft" size="lg" className="mt-2 w-full" onClick={close}>
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
              <ButtonLink href={publicRoutes.login} variant="cta" size="lg" onClick={close}>
                <LogIn aria-hidden="true" />
                Sign in
              </ButtonLink>
              <ButtonLink href={publicRoutes.register} variant="outline" size="lg" className="rounded-full" onClick={close}>
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

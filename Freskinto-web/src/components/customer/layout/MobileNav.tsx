"use client";

import { LogIn, LogOut, ShoppingBasket, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { CUSTOMER_NAV } from "@/constants/navigation";
import { STORE } from "@/constants/store";
import { useLogout } from "@/hooks/useLogout";
import { adminRoutes, customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn, initials } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useShopStore } from "@/stores/shop-store";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Phone ka menu drawer — links, account block, sign in/out */
export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();
  const logout = useLogout();
  const setCartOpen = useShopStore((state) => state.setCartOpen);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const signedIn = hasHydrated && Boolean(token) && Boolean(user);
  const isCustomer = signedIn && user?.role === "CUSTOMER";

  const close = () => onOpenChange(false);
  // Guest ko sirf Shop aur Basket; customer ko poora account
  const links = CUSTOMER_NAV.filter((item) => isCustomer || item.href === publicRoutes.shop || item.href === customerRoutes.cart);

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
          <div className="flex items-center gap-3 border-b border-border bg-brand-soft/60 px-5 py-4">
            <Avatar size="lg">
              <AvatarFallback className="bg-brand-green-forest text-white">{initials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-fs-12 text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}

        <nav aria-label="Menu" className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
          {links.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            if (href === customerRoutes.cart) {
              return (
                <Button
                  key={href}
                  variant="ghost"
                  size="lg"
                  className="h-12 justify-start gap-3 rounded-xl text-base font-medium"
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
              <Link
                key={href}
                href={href}
                onClick={close}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-12 items-center gap-3 rounded-xl px-4 text-base font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 [&_svg]:size-4",
                  active && "bg-brand-soft text-brand-green-dark",
                )}
              >
                <Icon aria-hidden="true" />
                {label}
              </Link>
            );
          })}
          {signedIn && user?.role === "ADMIN" && (
            <ButtonLink href={adminRoutes.orders} variant="soft" size="lg" className="mt-2 w-full" onClick={close}>
              Admin workspace
            </ButtonLink>
          )}
        </nav>

        <div className="flex flex-col gap-2 border-t border-border bg-modal-footer p-4">
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
            <>
              <ButtonLink href={publicRoutes.login} variant="cta" size="lg" onClick={close}>
                <LogIn aria-hidden="true" />
                Sign in
              </ButtonLink>
              <ButtonLink href={publicRoutes.register} variant="outline" size="lg" onClick={close}>
                <UserPlus aria-hidden="true" />
                Create an account
              </ButtonLink>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

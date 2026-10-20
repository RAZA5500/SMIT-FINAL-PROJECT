"use client";

import { ChevronDown, LayoutDashboard, LogOut, MapPin, Menu, Package, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { adminRoutes, customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetCart } from "@/services/cart/queries";
import type { IUser } from "@/services/auth/types";
import { useAuthStore } from "@/stores/auth-store";
import CartPanel from "./shop/CartPanel";

/* The production build inlines this basket glyph rather than using lucide, so
   the stroke geometry is reproduced verbatim. */
function CartGlyph() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <path
        d="M7 2.3335L3.5 7.00016V23.3335C3.5 23.9523 3.74583 24.5458 4.18342 24.9834C4.621 25.421 5.21449 25.6668 5.83333 25.6668H22.1667C22.7855 25.6668 23.379 25.421 23.8166 24.9834C24.2542 24.5458 24.5 23.9523 24.5 23.3335V7.00016L21 2.3335H7Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M3.5 7H24.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M18.6673 11.6665C18.6673 12.9042 18.1757 14.0912 17.3005 14.9663C16.4253 15.8415 15.2383 16.3332 14.0007 16.3332C12.763 16.3332 11.576 15.8415 10.7008 14.9663C9.82565 14.0912 9.33398 12.9042 9.33398 11.6665"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MENU_BUTTON_CLASS =
  "group/button inline-flex shrink-0 items-center justify-center rounded-5 border border-transparent bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 cursor-pointer hover:-translate-y-0.5 hover:opacity-95 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 size-8 [&_svg:not([class*='size-'])]:size-4 ml-1";

const SIGN_IN_LINK_CLASS =
  "group/button inline-flex shrink-0 items-center justify-center rounded-5 border border-transparent bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 cursor-pointer hover:-translate-y-0.5 hover:opacity-95 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 h-11 gap-2 rounded-5 px-4 text-sm font-medium uppercase text-white bg-brand-green hover:opacity-90 h-7 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5";

const NAV_LINKS = [
  { label: "Home", href: publicRoutes.home },
  { label: "About Us", href: publicRoutes.home },
  { label: "Shop", href: publicRoutes.shop },
];

/** Har role ke apne account links */
function accountLinks(user: IUser) {
  return user.role === "ADMIN"
    ? [{ label: "Admin Dashboard", href: adminRoutes.dashboard, icon: LayoutDashboard }]
    : [
        { label: "My Orders", href: customerRoutes.orders, icon: Package },
        { label: "Addresses", href: customerRoutes.addresses, icon: MapPin },
      ];
}

/** Lines ki tadaad (CartPanel heading jaisi) — sirf customer ka cart load hota hai */
function CartCountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-orange px-1 text-3xs leading-none font-semibold text-white">
      {count}
    </span>
  );
}

function AccountMenu({ user }: { user: IUser }) {
  const router = useRouter();
  const logout = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={SIGN_IN_LINK_CLASS} aria-label="Account menu">
        <span className="max-w-32 truncate">{user.name}</span>
        <ChevronDown aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <span className="truncate text-sm font-medium text-gray-900">{user.name}</span>
            <span className="truncate text-xs font-normal text-gray-500">{user.email}</span>
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

export default function SiteHeader() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useLogout();
  const { data: cart } = useGetCart();
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const signedInUser = token ? user : null;
  const cartCount = cart?.items.length ?? 0;

  return (
    <header className="site-header" style={{ boxShadow: "0px 4px 44px 0px #00000014" }}>
      <div className="flex justify-between items-center py-5 header-container">
        <Link className="inline-flex relative items-center shrink-0" aria-label="Freshes home" href={publicRoutes.home}>
          <Image
            alt="Freshes"
            width={124}
            height={52}
            loading="eager"
            className="w-site-logo h-site-logo object-contain object-left"
            src="/branding/logo.svg"
          />
        </Link>

        {/* -------------------------------------------------------------- */}
        {/* Compact controls, below md                                     */}
        {/* -------------------------------------------------------------- */}
        <div className="md:hidden flex items-center gap-3">
          <div className="relative">
            <button
              className="relative inline-flex items-center justify-center size-8 hover:opacity-90 hover:scale-110 transition-all duration-200 cursor-pointer"
              aria-label={`Shopping cart (${cartCount} items)`}
              aria-expanded={mobileCartOpen}
              onClick={() => setMobileCartOpen((v) => !v)}
            >
              <div className="relative flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7">
                <CartGlyph />
                <CartCountBadge count={cartCount} />
              </div>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={mobileMenuOpen}
              className={MENU_BUTTON_CLASS}
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              <Menu className="w-6 h-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>

        <nav className="hidden md:flex flex-1 justify-center items-center">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <li className="relative" key={l.label}>
                <Link
                  className="group flex items-center gap-1 font-medium text-foreground md:text-white text-sm transition-all duration-200"
                  href={l.href}
                >
                  <span className="md:hover:underline md:underline-offset-4 nav-link">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* -------------------------------------------------------------- */}
        {/* Cart + account, md and up                                      */}
        {/* -------------------------------------------------------------- */}
        <div className="hidden md:flex items-center">
          <div
            className="relative flex items-center"
            onMouseEnter={() => setCartPreviewOpen(true)}
            onMouseLeave={() => setCartPreviewOpen(false)}
            onFocus={() => setCartPreviewOpen(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setCartPreviewOpen(false);
            }}
          >
            <Link
              href={customerRoutes.cart}
              className="relative hover:opacity-90 hover:scale-110 transition-all duration-200 cursor-pointer"
              aria-label={`Shopping cart (${cartCount} items)`}
            >
              <div className="relative flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7">
                <CartGlyph />
                <CartCountBadge count={cartCount} />
              </div>
            </Link>

            <div
              className={cn(
                "top-full right-0 z-50 absolute pt-3 transition-opacity",
                cartPreviewOpen ? "opacity-100" : "opacity-0 pointer-events-none",
              )}
            >
              <div className="bg-white border border-brand-green rounded-sm w-(--cart-preview-width) shadow-sm">
                {/* Heavy content sirf khulne par mount (FLOW-MD 07 §7) */}
                {cartPreviewOpen && <CartPanel compact />}
              </div>
            </div>
          </div>

          <div className="bg-header-separator md:bg-white/30 mr-3 ml-8 w-px h-6" />

          <div className="flex items-center gap-3">
            {signedInUser ? (
              <AccountMenu user={signedInUser} />
            ) : (
              <Link className={SIGN_IN_LINK_CLASS} href={publicRoutes.login}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Cart drawer, below lg                                            */}
      {/* ---------------------------------------------------------------- */}
      <div
        className={cn(
          "lg:hidden z-50 fixed inset-0 overflow-hidden transition-opacity duration-300",
          mobileCartOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div
          className={cn(
            "top-0 left-0 absolute bg-white shadow-lg w-full max-h-screen overflow-y-auto overscroll-none transition-transform duration-300 ease-out",
            mobileCartOpen ? "translate-y-0" : "-translate-y-full",
          )}
        >
          {mobileCartOpen && <CartPanel onClose={() => setMobileCartOpen(false)} />}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Navigation sheet, below md                                       */}
      {/* ---------------------------------------------------------------- */}
      {mobileMenuOpen && (
        <div className="md:hidden z-50 fixed inset-0" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="top-0 right-0 absolute bg-white shadow-lg w-72 h-full">
            <div className="flex justify-between items-center px-5 py-5 border-gray-100 border-b">
              <span className="font-medium text-gray-900">Menu</span>
              <button
                type="button"
                className="hover:opacity-70 text-brand-green transition-opacity cursor-pointer"
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <nav className="flex flex-col p-5 gap-4">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="font-medium text-gray-900 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              {signedInUser ? (
                <>
                  {accountLinks(signedInUser).map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className="font-medium text-gray-900 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    className="text-left font-medium text-destructive text-sm cursor-pointer"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                  >
                    Sign out ({signedInUser.name})
                  </button>
                </>
              ) : (
                <Link
                  href={publicRoutes.login}
                  className="font-medium text-brand-green text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

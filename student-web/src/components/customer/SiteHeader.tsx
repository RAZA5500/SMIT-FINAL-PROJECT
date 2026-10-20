"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuthStore } from "@/stores/auth-store";

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

const VIEW_CART_BUTTON_CLASS =
  "group/button inline-flex shrink-0 items-center justify-center rounded-5 border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 cursor-pointer hover:-translate-y-0.5 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:bg-primary/80 gap-1 px-2.5 text-xs/relaxed has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4 bg-brand-green hover:opacity-90 w-full h-full text-white";

const CHECKOUT_BUTTON_CLASS =
  "group/button inline-flex shrink-0 items-center justify-center rounded-5 border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-all duration-200 outline-none select-none disabled:pointer-events-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 cursor-pointer hover:-translate-y-0.5 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:bg-primary/80 gap-1 px-2.5 text-xs/relaxed has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4 bg-brand-green hover:opacity-90 disabled:opacity-50 mt-1 w-full h-11 text-white";

const SIGN_IN_LINK_CLASS =
  "group/button inline-flex shrink-0 items-center justify-center rounded-5 border border-transparent bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 cursor-pointer hover:-translate-y-0.5 hover:opacity-95 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 h-11 gap-2 rounded-5 px-4 text-sm font-medium uppercase text-white bg-brand-green hover:opacity-90 h-7 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/" },
  { label: "Shop", href: "/shop" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const user = useAuthStore((state) => state.user);
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  return (
    <header className="site-header" style={{ boxShadow: "0px 4px 44px 0px #00000014" }}>
      <div className="flex justify-between items-center py-5 header-container">
        <Link className="inline-flex relative items-center shrink-0" aria-label="Freshes home" href="/">
          <img
            alt="Freshes"
            width="124"
            height="52"
            decoding="async"
            className="w-site-logo h-site-logo object-contain object-left"
            style={{ color: "transparent" }}
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
              aria-label="Shopping cart"
              onClick={() => setMobileCartOpen((v) => !v)}
            >
              <div className="relative flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7">
                <CartGlyph />
              </div>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              tabIndex={0}
              data-slot="sheet-trigger"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={mobileMenuOpen}
              className={MENU_BUTTON_CLASS}
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu w-6 h-6 text-white"
                aria-hidden="true"
              >
                <path d="M4 5h16" />
                <path d="M4 12h16" />
                <path d="M4 19h16" />
              </svg>
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
          >
            <button
              className="relative hover:opacity-90 hover:scale-110 transition-all duration-200 cursor-pointer"
              aria-label="Shopping cart"
            >
              <div className="relative flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7">
                <CartGlyph />
              </div>
            </button>

            <div
              className={`top-full right-0 z-50 absolute pt-3 transition-opacity ${
                cartPreviewOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="bg-white border border-brand-green rounded-sm w-(--cart-preview-width) shadow-sm">
                <div className="flex flex-col h-full">
                  <div className="px-4 py-3.5 flex justify-between items-center border-gray-100 border-b shrink-0">
                    <h3 className="font-medium text-gray-900">
                      Your Cart <span className="text-brand-green">({totalItems})</span>
                    </h3>
                    <div className="flex items-center gap-3" />
                  </div>
                  <div className="flex flex-col scrollbar-thin overflow-y-auto max-h-48" />
                  <div className="flex items-center px-2.5 py-(--cart-preview-footer-padding-y) h-11">
                    <button type="button" tabIndex={0} data-slot="button" className={VIEW_CART_BUTTON_CLASS}>
                      View Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-header-separator md:bg-white/30 mr-3 ml-8 w-px h-6" />

          <div className="flex items-center gap-3">
            <Link className={SIGN_IN_LINK_CLASS} href={user ? "/profile" : "/login"}>
              {user ? user.name : "Sign in"}
            </Link>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Cart drawer, below lg                                            */}
      {/* ---------------------------------------------------------------- */}
      <div
        className={`lg:hidden z-50 fixed inset-0 overflow-hidden transition-opacity duration-300 ${
          mobileCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`top-0 left-0 absolute bg-white shadow-lg w-full max-h-screen overflow-y-auto overscroll-none transition-transform duration-300 ease-out ${
            mobileCartOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="px-5 py-5 flex justify-between items-center border-gray-100 border-b shrink-0">
              <h3 className="font-medium text-gray-900">
                Your Cart <span className="text-brand-green">({totalItems})</span>
              </h3>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="hover:opacity-70 text-brand-green transition-opacity cursor-pointer"
                  aria-label="Close cart"
                  onClick={() => setMobileCartOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x w-5 h-5"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-col scrollbar-thin overflow-y-auto max-h-[calc(100vh-300px)]" />

            <div className="px-5 py-3 border-gray-100 border-b shrink-0">
              <div className="">
                <button
                  type="button"
                  className="flex items-center gap-1.5 font-inter text-xs font-medium text-gray-500 hover:text-brand-green transition-colors cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-tag w-3.5 h-3.5"
                    aria-hidden="true"
                  >
                    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                  </svg>
                  Have a promo code?
                </button>
              </div>
            </div>

            <div className="px-5 py-4 border-gray-100 border-t shrink-0 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-summary-label text-sm">Subtotal</span>
                <span className="font-medium text-price-text text-sm">£0.00</span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-summary-divider border-t">
                <span className="font-semibold text-summary-label text-sm">Total</span>
                <span className="font-bold text-brand-green text-base">£0.00</span>
              </div>
              <button type="button" tabIndex={0} disabled data-slot="button" className={CHECKOUT_BUTTON_CLASS}>
                <span className="flex items-center gap-2">
                  Checkout
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-right w-4 h-4"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Navigation sheet, below md                                       */}
      {/* ---------------------------------------------------------------- */}
      {mobileMenuOpen && (
        <div className="md:hidden z-50 fixed inset-0" role="dialog" aria-modal="true">
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x w-5 h-5"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
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
              <Link
                href={user ? "/profile" : "/login"}
                className="font-medium text-brand-green text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                {user ? user.name : "Sign in"}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

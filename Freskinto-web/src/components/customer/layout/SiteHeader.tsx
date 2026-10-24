"use client";

import { ArrowLeft, Lock, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState, type CSSProperties } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { STORE } from "@/constants/store";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { AccountMenu } from "./AccountMenu";
import { AislesMenu } from "./AislesMenu";
import { BasketButton } from "./BasketButton";
import { MobileNav } from "./MobileNav";
import { SearchPalette } from "./SearchPalette";
import { SearchTrigger, useSearchHotkey } from "./SearchTrigger";

/** Page transitions mein header apni jagah tika rehta hai (globals.css `site-header`) */
const ANCHOR = { viewTransitionName: "site-header" } as CSSProperties;

function SkipLink() {
  return (
    <ButtonLink href="#content" size="sm" className="sr-only z-50 focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
      Skip to content
    </ButtonLink>
  );
}

function HomeLink() {
  return (
    <Button
      variant="ghost"
      nativeButton={false}
      render={<Link href={publicRoutes.home} aria-label={`${STORE.name} home`} />}
      className="h-auto shrink-0 px-0.5 py-0.5 hover:bg-transparent active:scale-100"
    >
      <Logo size="md" />
    </Button>
  );
}

/** Floating glass pill header — sits tight near top without excessive vertical gap */
export function SiteHeader({ variant = "default" }: { variant?: "default" | "checkout" }) {
  return variant === "checkout" ? <CheckoutHeader /> : <MarketHeader />;
}

function MarketHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  useSearchHotkey(openSearch);

  return (
    <Box
      as="header"
      style={ANCHOR}
      className="sticky top-0 z-40 w-full mt-0 px-1 pt-0 pb-0 sm:px-2"
    >
      <SkipLink />
      <Flex
        align="center"
        gap="1"
        className="glass mx-auto mt-0 h-14 max-w-page rounded-full border border-glass-border pr-1 pl-1 shadow-soft will-change-transform [transform:translateZ(0)] sm:pl-1.5"
      >
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <Menu aria-hidden="true" className="size-5" />
        </Button>
        <HomeLink />
        <AislesMenu pathname={pathname} className="ml-1 sm:ml-1.5" />

        <Flex align="center" gap="1" className="ml-auto">
          <SearchTrigger onOpen={openSearch} className="hidden md:inline-flex" />
          <SearchTrigger onOpen={openSearch} variant="icon" className="md:hidden" />
          <ThemeToggle className="hidden sm:inline-flex" />
          <AccountMenu />
          <BasketButton className="ml-0" />
        </Flex>
      </Flex>

      <MobileNav open={menuOpen} onOpenChange={setMenuOpen} />
      <SearchPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </Box>
  );
}

/** Checkout par distraction-free header — sirf logo, "Secure checkout" aur basket par wapsi */
function CheckoutHeader() {
  return (
    <Box
      as="header"
      style={ANCHOR}
      className="sticky top-0 z-40 w-full mt-0 px-1 pt-0 pb-0 sm:px-2"
    >
      <SkipLink />
      <Flex
        align="center"
        justify="between"
        gap="1.5"
        className="glass mx-auto mt-0 h-14 max-w-page rounded-full border border-glass-border pr-1 pl-1.5 shadow-soft will-change-transform [transform:translateZ(0)] sm:gap-2 sm:pl-2"
      >
        <HomeLink />
        <Flex align="center" gap="1" className="hidden rounded-full bg-brand-soft px-2 py-0.5 text-brand-ink sm:flex">
          <Lock aria-hidden="true" className="size-3.5" />
          <Text as="span" tone="inherit" weight="semibold" className="text-fs-12">
            Secure checkout
          </Text>
        </Flex>
        <Flex align="center" gap="1">
          <ThemeToggle />
          {/* Phone par chhota label — logo, theme aur button ek line mein samayein */}
          <ButtonLink href={customerRoutes.cart} transitionTypes={["nav-back"]} variant="outline" size="sm" aria-label="Back to basket" className="gap-1 px-2.5">
            <ArrowLeft aria-hidden="true" />
            <Text as="span" tone="inherit" className="hidden sm:inline">
              Back to basket
            </Text>
            <Text as="span" tone="inherit" className="sm:hidden">
              Basket
            </Text>
          </ButtonLink>
        </Flex>
      </Flex>
    </Box>
  );
}

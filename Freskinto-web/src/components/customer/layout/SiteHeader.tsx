"use client";

import { ArrowLeft, Lock, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { STORE } from "@/constants/store";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { AccountMenu } from "./AccountMenu";
import { AislesMenu } from "./AislesMenu";
import { AnnouncementBar } from "./AnnouncementBar";
import { BasketButton } from "./BasketButton";
import { MobileNav } from "./MobileNav";
import { SearchPalette } from "./SearchPalette";
import { SearchTrigger, useSearchHotkey } from "./SearchTrigger";

function SkipLink() {
  return (
    <ButtonLink
      href="#content"
      variant="night"
      size="sm"
      className="sr-only z-50 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
    >
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
      className="h-auto shrink-0 rounded-xl px-1 py-1 hover:bg-transparent"
    >
      <Logo size="md" />
    </Button>
  );
}

/** Floating glass header — shop pages ke liye; checkout par distraction-free variant */
export function SiteHeader({ variant = "default" }: { variant?: "default" | "checkout" }) {
  return variant === "checkout" ? <CheckoutHeader /> : <MarketHeader />;
}

function MarketHeader() {
  const pathname = usePathname();
  const hidden = useHideOnScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  useSearchHotkey(openSearch);

  return (
    <>
      <AnnouncementBar />
      <Box
        as="header"
        className={cn(
          "sticky top-0 z-40 px-3 pt-3 transition-transform duration-300 sm:px-4 lg:px-6",
          hidden && "max-lg:-translate-y-full",
        )}
      >
        <SkipLink />
        <Flex
          align="center"
          gap="2"
          className="glass mx-auto h-16 max-w-page rounded-2xl border border-border/70 px-2 shadow-lift sm:gap-3 sm:px-3 lg:gap-4 lg:px-4"
        >
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu aria-hidden="true" className="size-5" />
          </Button>
          <HomeLink />
          <AislesMenu pathname={pathname} />

          <Box className="hidden min-w-0 flex-1 md:block lg:mx-2">
            <SearchTrigger onOpen={openSearch} />
          </Box>

          <Flex align="center" gap="1" className="ml-auto sm:gap-1.5">
            <SearchTrigger onOpen={openSearch} variant="icon" className="md:hidden" />
            <ThemeToggle className="hidden sm:inline-flex" />
            <AccountMenu />
            <BasketButton />
          </Flex>
        </Flex>

        <MobileNav open={menuOpen} onOpenChange={setMenuOpen} />
        <SearchPalette open={searchOpen} onOpenChange={setSearchOpen} />
      </Box>
    </>
  );
}

/** Checkout par distraction-free header — sirf logo, "Secure checkout" aur basket par wapsi */
function CheckoutHeader() {
  return (
    <Box as="header" className="px-3 pt-3 sm:px-4 lg:px-6">
      <SkipLink />
      <Flex
        align="center"
        justify="between"
        gap="4"
        className="glass mx-auto h-16 max-w-page rounded-2xl border border-border/70 px-3 shadow-lift sm:px-4"
      >
        <HomeLink />
        <Flex align="center" gap="2" className="hidden sm:flex">
          <Lock aria-hidden="true" className="size-4 text-primary" />
          <Text as="span" variant="eyebrow" tone="muted">
            Secure checkout
          </Text>
        </Flex>
        <Flex align="center" gap="1">
          <ThemeToggle />
          <ButtonLink href={customerRoutes.cart} variant="ghost" size="sm" className="rounded-full text-primary">
            <ArrowLeft aria-hidden="true" />
            Back to basket
          </ButtonLink>
        </Flex>
      </Flex>
    </Box>
  );
}

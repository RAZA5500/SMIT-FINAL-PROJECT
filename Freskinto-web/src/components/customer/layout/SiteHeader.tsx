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
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { AccountMenu } from "./AccountMenu";
import { AislesMenu } from "./AislesMenu";
import { BasketButton } from "./BasketButton";
import { MobileNav } from "./MobileNav";
import { SearchPalette } from "./SearchPalette";
import { SearchTrigger, useSearchHotkey } from "./SearchTrigger";

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
      className="h-auto shrink-0 px-1 py-1 hover:bg-transparent"
    >
      <Logo size="md" />
    </Button>
  );
}

/** Sticky white header with a hairline border — shop pages; checkout par distraction-free variant */
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
    <Box as="header" className="glass sticky top-0 z-40 border-b">
      <SkipLink />
      <Flex align="center" gap="2" className="mx-auto h-header max-w-page px-4 sm:gap-3 sm:px-6 lg:px-8">
        <Button variant="ghost" size="icon" className="-ml-2 lg:hidden" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <Menu aria-hidden="true" className="size-5" />
        </Button>
        <HomeLink />
        <AislesMenu pathname={pathname} />

        <Box className="ml-auto hidden w-full max-w-sm md:block">
          <SearchTrigger onOpen={openSearch} />
        </Box>

        <Flex align="center" gap="1" className="ml-auto md:ml-2">
          <SearchTrigger onOpen={openSearch} variant="icon" className="md:hidden" />
          <ThemeToggle className="hidden sm:inline-flex" />
          <AccountMenu />
          <BasketButton />
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
    <Box as="header" className="border-b bg-background">
      <SkipLink />
      <Flex align="center" justify="between" gap="4" className="mx-auto h-header max-w-page px-4 sm:px-6 lg:px-8">
        <HomeLink />
        <Flex align="center" gap="2" className="hidden sm:flex">
          <Lock aria-hidden="true" className="size-3.5 text-muted-foreground" />
          <Text as="span" variant="small" tone="muted">
            Secure checkout
          </Text>
        </Flex>
        <Flex align="center" gap="1">
          <ThemeToggle />
          <ButtonLink href={customerRoutes.cart} variant="ghost" size="sm">
            <ArrowLeft aria-hidden="true" />
            Back to basket
          </ButtonLink>
        </Flex>
      </Flex>
    </Box>
  );
}

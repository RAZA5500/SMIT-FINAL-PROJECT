"use client";

import { ArrowLeft, Lock, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { TextLink } from "@/components/shared/TextLink";
import { STORE } from "@/constants/store";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";
import { AccountMenu } from "./AccountMenu";
import { AislesMenu } from "./AislesMenu";
import { BasketButton } from "./BasketButton";
import { isCheckoutPath } from "./checkout-path";
import { HeaderSearch, HeaderSearchFallback } from "./HeaderSearch";
import { UtilityBar } from "./UtilityBar";

function SkipLink() {
  return (
    <ButtonLink
      href="#content"
      size="sm"
      className={cn("sr-only z-50 focus:not-sr-only focus:fixed focus:top-3 focus:left-3")}
    >
      Skip to content
    </ButtonLink>
  );
}

function HomeLink() {
  return (
    <TextLink href={publicRoutes.home} aria-label={`${STORE.name} home`} className={cn("shrink-0")}>
      <Logo />
    </TextLink>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const hidden = useHideOnScroll();
  const setMenuOpen = useUiStore((state) => state.setMenuOpen);

  if (isCheckoutPath(pathname)) return <CheckoutHeader />;

  return (
    <>
      <SkipLink />
      <UtilityBar />
      <Box
        as="header"
        className={cn(
          "sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md transition-transform duration-300",
          hidden && "max-md:-translate-y-full",
        )}
      >
        <Container className={cn("flex flex-wrap items-center gap-x-2 gap-y-3 py-3 md:flex-nowrap md:gap-4")}>
          <Button
            variant="ghost"
            size="icon"
            className={cn("-ml-2 md:hidden")}
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu aria-hidden="true" className={cn("size-5")} />
          </Button>
          <HomeLink />
          <AislesMenu className={cn("hidden md:flex")} />
          <Box className={cn("order-last basis-full md:order-none md:max-w-2xl md:flex-1 md:basis-auto")}>
            <Suspense fallback={<HeaderSearchFallback />}>
              <HeaderSearch />
            </Suspense>
          </Box>
          <Flex align="center" gap="1" className={cn("ml-auto sm:gap-2")}>
            <AccountMenu />
            <BasketButton />
          </Flex>
        </Container>
      </Box>
    </>
  );
}

/** Checkout par distraction-free header — sirf logo, "Secure checkout" aur basket par wapsi */
function CheckoutHeader() {
  return (
    <Box as="header" className={cn("border-b bg-background")}>
      <SkipLink />
      <Container className={cn("flex h-16 items-center justify-between gap-4")}>
        <HomeLink />
        <Flex align="center" gap="2" className={cn("hidden sm:flex")}>
          <Lock aria-hidden="true" className={cn("size-4 text-brand-green")} />
          <Text as="span" variant="small" tone="muted" className={cn("text-xs font-semibold tracking-wider uppercase")}>
            Secure checkout
          </Text>
        </Flex>
        <ButtonLink href={customerRoutes.cart} variant="ghost" size="sm" className={cn("text-brand-green hover:text-brand-green-dark")}>
          <ArrowLeft data-icon="inline-start" aria-hidden="true" />
          Back to basket
        </ButtonLink>
      </Container>
    </Box>
  );
}

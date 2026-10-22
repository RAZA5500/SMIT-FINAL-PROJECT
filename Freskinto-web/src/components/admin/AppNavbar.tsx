"use client";

import { ExternalLink, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Text } from "@/components/ui/typography";
import { useSearchHotkey } from "@/components/customer/layout/SearchTrigger";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { PageBreadcrumbs, type Crumb } from "@/components/shared/PageBreadcrumbs";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { activeAdminNavItem, adminSubPageLabel } from "@/constants/navigation";
import { adminRoutes, publicRoutes } from "@/lib/routes/routes";
import { AdminCommandPalette } from "./AdminCommandPalette";

/** Admin top bar: sidebar trigger, breadcrumbs, ⌘K palette, theme, storefront link */
export function AppNavbar() {
  const pathname = usePathname();
  const item = activeAdminNavItem(pathname);
  const subPage = adminSubPageLabel(pathname);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  useSearchHotkey(openPalette);

  const crumbs: Crumb[] =
    item && item.href !== adminRoutes.home
      ? [{ label: item.label, href: subPage ? item.href : undefined }, ...(subPage ? [{ label: subPage }] : [])]
      : [];

  return (
    <Flex
      as="header"
      align="center"
      gap="3"
      className="glass sticky top-0 z-30 h-16 shrink-0 border-b border-border px-4 sm:px-6 md:rounded-t-3xl"
    >
      <SidebarTrigger className="-ml-1 rounded-full" />
      <Separator orientation="vertical" className="data-vertical:h-5 data-vertical:self-center" />
      <PageBreadcrumbs root={{ label: "Admin", href: adminRoutes.home }} items={crumbs} className="min-w-0 flex-1" />

      <Button
        variant="outline"
        onClick={openPalette}
        aria-label="Open command palette"
        className="hidden w-56 justify-start gap-2 rounded-full bg-muted/60 font-normal text-muted-foreground shadow-none md:inline-flex"
      >
        <Search aria-hidden="true" />
        <Text as="span" tone="inherit" className="flex-1 text-left">
          Jump to…
        </Text>
        <Box as="span" aria-hidden="true">
          <Kbd className="bg-card">⌘K</Kbd>
        </Box>
      </Button>
      <Button variant="ghost" size="icon" aria-label="Open command palette" onClick={openPalette} className="rounded-full md:hidden">
        <Search aria-hidden="true" />
      </Button>
      <ThemeToggle />
      <ButtonLink href={publicRoutes.shop} variant="outline" size="sm" className="hidden rounded-full sm:inline-flex">
        <ExternalLink aria-hidden="true" />
        Storefront
      </ButtonLink>

      <AdminCommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </Flex>
  );
}

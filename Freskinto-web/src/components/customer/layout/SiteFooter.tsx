"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/typography";
import { LogoMark } from "@/components/shared/Logo";
import { TextLink } from "@/components/shared/TextLink";
import { STORE } from "@/constants/store";
import { customerRoutes, publicRoutes, shopUrl } from "@/lib/routes/routes";
import { useAisles } from "../shop/use-aisles";
import { FooterWordmark } from "./FooterWordmark";

const FOOTER_AISLE_LIMIT = 6;
/** Module load par ek dafa — render ke dauran current date nahi padhte */
const COPYRIGHT_YEAR = new Date().getFullYear();

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button
      variant="link"
      nativeButton={false}
      render={<Link href={href} />}
      className="group/flink h-auto justify-start gap-1 p-0 text-sm font-medium text-white/60 hover:text-white hover:no-underline"
    >
      {children}
      <ArrowUpRight
        aria-hidden="true"
        className="size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover/flink:translate-x-0 group-hover/flink:opacity-100"
      />
    </Button>
  );
}

/** Dark floating footer panel — link columns, store notes, aur cursor se chamakta bara wordmark */
export function SiteFooter({ compact = false }: { compact?: boolean }) {
  const { aisles } = useAisles();

  if (compact) {
    return (
      <Container as="footer" className="py-8 text-center">
        <Text tone="muted" className="text-fs-13">
          Need help with your order?{" "}
          <TextLink href={`mailto:${STORE.supportEmail}`} underline>
            {STORE.supportEmail}
          </TextLink>
        </Text>
      </Container>
    );
  }

  const columns: FooterColumn[] = [
    {
      title: "Shop",
      links: [
        { label: "All products", href: shopUrl() },
        ...aisles.slice(0, FOOTER_AISLE_LIMIT).map((aisle) => ({ label: aisle.name, href: shopUrl({ category: aisle.id }) })),
      ],
    },
    {
      title: "Account",
      links: [
        { label: "My orders", href: customerRoutes.orders },
        { label: "Addresses", href: customerRoutes.addresses },
        { label: "Profile", href: customerRoutes.profile },
        { label: "Sign in", href: publicRoutes.login },
      ],
    },
  ];

  return (
    <Box as="footer" className="mt-24 px-3 pb-24 sm:px-4 lg:pb-4">
      <Box className="relative isolate mx-auto max-w-page overflow-hidden rounded-[2.5rem] bg-[#0b1611] text-white dark:border dark:border-white/[0.06]">
        <Box
          aria-hidden="true"
          className="absolute -top-40 -right-32 -z-10 size-[34rem] rounded-full bg-[radial-gradient(closest-side,rgb(34_211_138/0.28),transparent)]"
        />
        <Box
          aria-hidden="true"
          className="absolute top-20 -left-40 -z-10 size-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(42_168_242/0.2),transparent)]"
        />
        <Box aria-hidden="true" className="grain absolute inset-0 -z-10 opacity-[0.06] mix-blend-screen" />

        <Container className="px-6 sm:px-10 lg:px-14">
          <Grid gap="10" className="grid-cols-2 pt-14 pb-10 lg:grid-cols-12">
            <Stack gap="5" className="col-span-2 lg:col-span-5">
              <Flex align="center" gap="3">
                <LogoMark size="lg" />
                <Text weight="semibold" tone="inherit" className="font-display text-2xl tracking-[-0.05em] lowercase">
                  {STORE.name}
                </Text>
              </Flex>
              <Text tone="inherit" className="max-w-sm text-base text-white/65">
                {STORE.tagline} Fresh produce, butcher cuts and everyday essentials — delivered free or ready to collect.
              </Text>
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href={`mailto:${STORE.supportEmail}`} />}
                className="w-fit border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
              >
                <Mail aria-hidden="true" />
                {STORE.supportEmail}
              </Button>
            </Stack>

            {columns.map((column) => (
              <Stack as="nav" key={column.title} aria-label={column.title} gap="4" className="lg:col-span-2">
                <Text variant="eyebrow" tone="inherit" className="text-white/40">
                  {column.title}
                </Text>
                <Stack as="ul" gap="2.5">
                  {column.links.map((link) => (
                    <Box as="li" key={link.href + link.label}>
                      <FooterLink href={link.href}>{link.label}</FooterLink>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            ))}

            <Stack gap="4" className="col-span-2 lg:col-span-3">
              <Text variant="eyebrow" tone="inherit" className="text-white/40">
                Good to know
              </Text>
              <Stack as="ul" gap="2.5">
                {[
                  "Free delivery on every order",
                  "Click & collect at a time you choose",
                  `Pay within ${STORE.paymentWindowMinutes} minutes to confirm`,
                ].map((text) => (
                  <Flex as="li" key={text} align="center" gap="2.5" className="text-sm text-white/60">
                    <Box as="span" aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-fresh" />
                    {text}
                  </Flex>
                ))}
              </Stack>
            </Stack>
          </Grid>
        </Container>

        <FooterWordmark />

        <Flex
          direction="col"
          justify="between"
          gap="1"
          className="border-t border-white/[0.08] px-6 py-5 text-fs-12 text-white/45 sm:flex-row sm:items-center sm:px-10 lg:px-14"
        >
          <Text tone="inherit" className="text-fs-12">
            © {COPYRIGHT_YEAR} {STORE.name}. All rights reserved.
          </Text>
          <Text tone="inherit" className="text-fs-12">
            {/* Demo store — payments are simulated, no real card is charged. */}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}

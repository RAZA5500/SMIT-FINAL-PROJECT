"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Separator } from "@/components/ui/separator";
import { Heading, Text } from "@/components/ui/typography";
import { Logo } from "@/components/shared/Logo";
import { TextLink } from "@/components/shared/TextLink";
import { STORE } from "@/constants/store";
import { customerRoutes, publicRoutes, shopUrl } from "@/lib/routes/routes";
import { useAisles } from "../shop/use-aisles";

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
      className="group/flink h-auto justify-start gap-1 p-0 text-sm font-normal text-night-muted hover:text-lime hover:no-underline"
    >
      {children}
      <ArrowUpRight
        aria-hidden="true"
        className="size-3.5 opacity-0 transition-all group-hover/flink:translate-x-0.5 group-hover/flink:opacity-100"
      />
    </Button>
  );
}

function LinkList({ links }: { links: FooterColumn["links"] }) {
  return (
    <Stack as="ul" gap="2.5">
      {links.map((link) => (
        <Box as="li" key={link.href + link.label}>
          <FooterLink href={link.href}>{link.label}</FooterLink>
        </Box>
      ))}
    </Stack>
  );
}

/** Night footer — giant wordmark, link columns (phone par accordion) */
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
      title: "Aisles",
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
    <Box as="footer" className="mt-20 px-3 pb-28 sm:px-4 lg:px-6 lg:pb-6">
      <Box className="relative isolate mx-auto max-w-page overflow-hidden rounded-3xl bg-night text-night-foreground">
        <Box aria-hidden="true" className="texture-dots absolute inset-0 -z-10 text-night-foreground/5" />
        <Box
          aria-hidden="true"
          className="absolute -top-24 -right-24 -z-10 size-80 rounded-full bg-primary/40 blur-3xl"
        />

        <Grid gap="10" className="p-6 sm:p-10 md:grid-cols-12 lg:p-14">
          <Stack gap="5" className="md:col-span-5">
            <Logo size="lg" inverse />
            <Heading as="p" size="3" tone="night" className="max-w-sm font-semibold">
              {STORE.tagline}
            </Heading>
            <Button
              variant="glass"
              nativeButton={false}
              render={<Link href={`mailto:${STORE.supportEmail}`} />}
              className="w-fit"
            >
              <Mail aria-hidden="true" />
              {STORE.supportEmail}
            </Button>
          </Stack>

          {/* Desktop: columns */}
          {columns.map((column) => (
            <Box as="nav" key={column.title} aria-label={column.title} className="hidden md:col-span-2 md:block">
              <Text variant="eyebrow" tone="inherit" className="mb-4 text-lime">
                {column.title}
              </Text>
              <LinkList links={column.links} />
            </Box>
          ))}

          <Stack gap="4" className="hidden md:col-span-3 md:flex">
            <Text variant="eyebrow" tone="inherit" className="text-lime">
              Good to know
            </Text>
            <Stack as="ul" gap="2.5">
              {[
                "Free delivery on every order",
                "Click & collect at a time you choose",
                `Pay within ${STORE.paymentWindowMinutes} minutes to confirm`,
              ].map((text) => (
                <Text as="li" key={text} tone="night-muted">
                  {text}
                </Text>
              ))}
            </Stack>
          </Stack>

          {/* Phone: accordion */}
          <Accordion className="md:hidden">
            {columns.map((column) => (
              <AccordionItem key={column.title} value={column.title} className="border-night-border">
                <AccordionTrigger className="py-4 text-base font-semibold hover:no-underline **:data-[slot=accordion-trigger-icon]:text-night-muted">
                  {column.title}
                </AccordionTrigger>
                <AccordionContent className="pb-4 [&_a]:no-underline">
                  <Box as="nav" aria-label={column.title}>
                    <LinkList links={column.links} />
                  </Box>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Grid>

        <Text
          aria-hidden="true"
          family="heading"
          weight="extrabold"
          tone="inherit"
          className="pointer-events-none -mb-4 px-4 text-center text-[clamp(4rem,17vw,15rem)] leading-none tracking-tighter text-night-foreground/10 select-none"
        >
          {STORE.name.toLowerCase()}
        </Text>

        <Separator className="bg-night-border" />
        <Flex
          direction="col"
          justify="between"
          gap="2"
          className="px-6 py-5 text-fs-12 text-night-muted sm:flex-row sm:items-center sm:px-10 lg:px-14"
        >
          <Text tone="inherit" className="text-fs-12">
            © {COPYRIGHT_YEAR} {STORE.name}. All rights reserved.
          </Text>
          <Text tone="inherit" className="text-fs-12">
            Demo store — payments are simulated, no real card is charged.
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}

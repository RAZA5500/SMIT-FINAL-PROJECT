"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/typography";
import { Logo } from "@/components/shared/Logo";
import { TextLink } from "@/components/shared/TextLink";
import { STORE } from "@/constants/store";
import { customerRoutes, publicRoutes, shopUrl } from "@/lib/routes/routes";
import { useAisles } from "../shop/use-aisles";

const FOOTER_AISLE_LIMIT = 5;
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
      className="h-auto justify-start p-0 text-sm font-normal text-muted-foreground hover:text-foreground hover:no-underline"
    >
      {children}
    </Button>
  );
}

/** Light footer — brand blurb, two link columns, "good to know" notes and a hairline legal row */
export function SiteFooter({ compact = false }: { compact?: boolean }) {
  const { aisles } = useAisles();

  if (compact) {
    return (
      <Container as="footer" className="border-t py-8 text-center">
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
    <Box as="footer" className="mt-16 border-t bg-workspace pb-20 lg:pb-0">
      <Container>
        <Grid gap="10" className="grid-cols-2 py-12 lg:grid-cols-12">
          <Stack gap="4" className="col-span-2 lg:col-span-5">
            <Logo />
            <Text tone="muted" className="max-w-xs">
              {STORE.tagline} Fresh produce, dairy and everyday essentials — delivered free or ready to collect.
            </Text>
            <TextLink href={`mailto:${STORE.supportEmail}`} className="w-fit text-sm">
              {STORE.supportEmail}
            </TextLink>
          </Stack>

          {columns.map((column) => (
            <Stack as="nav" key={column.title} aria-label={column.title} gap="3" className="lg:col-span-2">
              <Text variant="label">{column.title}</Text>
              <Stack as="ul" gap="2">
                {column.links.map((link) => (
                  <Box as="li" key={link.href + link.label}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </Box>
                ))}
              </Stack>
            </Stack>
          ))}

          <Stack gap="3" className="col-span-2 lg:col-span-3">
            <Text variant="label">Good to know</Text>
            <Stack as="ul" gap="2">
              {[
                "Free delivery on every order",
                "Click & collect at a time you choose",
                `Pay within ${STORE.paymentWindowMinutes} minutes to confirm`,
              ].map((text) => (
                <Text as="li" key={text} tone="muted">
                  {text}
                </Text>
              ))}
            </Stack>
          </Stack>
        </Grid>

        <Separator />
        <Flex direction="col" justify="between" gap="1" className="py-6 sm:flex-row sm:items-center">
          <Text tone="muted" className="text-fs-12">
            © {COPYRIGHT_YEAR} {STORE.name}. All rights reserved.
          </Text>
          <Text tone="muted" className="text-fs-12">
            Demo store — payments are simulated, no real card is charged.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}

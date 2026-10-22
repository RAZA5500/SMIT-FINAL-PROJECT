"use client";

import { ArrowRight, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Heading, Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { LogoMark } from "@/components/shared/Logo";
import { STORE } from "@/constants/store";
import { adminRoutes, customerRoutes, publicRoutes, shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

/** Aakhri CTA — guest ko account, customer ko shop/orders, admin ko dashboard */
export function JoinCta() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const role = token ? user?.role : undefined;

  const content =
    role === "CUSTOMER"
      ? {
          title: `Ready for your next shop${user?.name ? `, ${user.name.split(" ")[0]}` : ""}?`,
          text: "Pick up where you left off — your basket is saved to your account.",
          primary: { label: "Continue shopping", href: shopUrl() },
          secondary: { label: "My orders", href: customerRoutes.orders },
        }
      : role === "ADMIN"
        ? {
            title: "Signed in as the store admin",
            text: "Manage the catalogue, stock and orders from your dashboard.",
            primary: { label: "Open dashboard", href: adminRoutes.dashboard },
            secondary: { label: "Browse the shop", href: shopUrl() },
          }
        : {
            title: `New to ${STORE.name}?`,
            text: "Create a free account in under a minute and start filling your first basket.",
            primary: { label: "Create a free account", href: publicRoutes.register },
            secondary: { label: "Sign in", href: publicRoutes.login },
          };

  return (
    <Container as="section">
      <Card className={cn("relative isolate overflow-hidden bg-muted px-6 py-10 ring-0 sm:px-12 sm:py-14")}>
        <LogoMark
          size="lg"
          className={cn("absolute -right-6 -bottom-8 -z-10 size-48 rotate-12 opacity-10 [&_svg]:size-24")}
        />
        <Flex direction="col" gap="6" className={cn("md:flex-row md:items-center md:justify-between")}>
          <Stack gap="2" className={cn("max-w-xl")}>
            <Text variant="eyebrow">Your market account</Text>
            <Heading size="2" className={cn("serif-soft")}>
              {content.title}
            </Heading>
            <Text tone="muted" className={cn("sm:text-base")}>
              {content.text}
            </Text>
          </Stack>
          <Flex wrap gap="3">
            <ButtonLink href={content.primary.href} size="xl">
              {content.primary.label}
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={content.secondary.href} size="xl" variant="outline">
              {role === "CUSTOMER" && <Package data-icon="inline-start" aria-hidden="true" />}
              {content.secondary.label}
            </ButtonLink>
          </Flex>
        </Flex>
      </Card>
    </Container>
  );
}

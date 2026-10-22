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
      <Card className={cn("relative isolate overflow-hidden bg-hero-gradient px-6 py-10 text-white shadow-lift ring-1 ring-white/10 sm:px-12 sm:py-14 rounded-3xl")}>
        <LogoMark
          size="lg"
          className={cn("absolute -right-6 -bottom-8 -z-10 size-48 rotate-12 opacity-15 bg-white/20 text-white [&_svg]:size-24")}
        />
        <Flex direction="col" gap="6" className={cn("md:flex-row md:items-center md:justify-between")}>
          <Stack gap="2" className={cn("max-w-xl")}>
            <Text variant="eyebrow" className={cn("text-emerald-300 font-semibold")}>Your market account</Text>
            <Heading size="2" className={cn("font-bold text-white")}>
              {content.title}
            </Heading>
            <Text className={cn("text-emerald-100 sm:text-base")}>
              {content.text}
            </Text>
          </Stack>
          <Flex wrap gap="3">
            <ButtonLink href={content.primary.href} size="xl" className={cn("bg-white text-emerald-950 hover:bg-emerald-50 font-semibold shadow-md")}>
              {content.primary.label}
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={content.secondary.href} size="xl" variant="outline" className={cn("border-white/30 text-white hover:bg-white/10 hover:text-white")}>
              {role === "CUSTOMER" && <Package data-icon="inline-start" aria-hidden="true" />}
              {content.secondary.label}
            </ButtonLink>
          </Flex>
        </Flex>
      </Card>
    </Container>
  );
}

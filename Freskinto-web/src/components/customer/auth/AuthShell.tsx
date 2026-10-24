import { ArrowLeft, Leaf, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Aurora } from "@/components/ui/aurora";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { STORE } from "@/constants/store";
import { publicRoutes } from "@/lib/routes/routes";
import { AuthCard } from "./AuthCard";

const TRUST = [
  { icon: ShieldCheck, text: "256-bit SSL encrypted" },
  { icon: Zap, text: "Instant access" },
  { icon: Leaf, text: "100% fresh guarantee" },
];

/** Module load par ek dafa — render ke dauran current date nahi padhte */
const YEAR = new Date().getFullYear();

/**
 * /login aur /register ka frame:
 * Left: glass auth card (Sign in ↔ Create account switch, cursor glow) + trust line
 * Right (lg+): storefront ka screenshot
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <Grid className="relative isolate min-h-dvh flex-1 lg:grid-cols-[1fr_1.05fr]">
      <Aurora />
      <Stack as="main" id="content" className="px-5 py-4 sm:px-10">
        <Flex align="center" justify="between" gap="4">
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href={publicRoutes.home} aria-label={`${STORE.name} home`} />}
            className="h-auto px-1 py-1 hover:bg-transparent"
          >
            <Logo size="md" />
          </Button>
          <Flex align="center" gap="1">
            <ThemeToggle />
            <ButtonLink href={publicRoutes.shop} transitionTypes={["nav-back"]} variant="ghost" size="sm">
              <ArrowLeft aria-hidden="true" />
              Back to shop
            </ButtonLink>
          </Flex>
        </Flex>

        <Flex align="center" justify="center" className="flex-1 py-6">
          <Box className="w-full max-w-form animate-fade-up">
            <AuthCard>{children}</AuthCard>

            <Flex as="ul" wrap align="center" justify="center" className="mt-5 gap-x-4 gap-y-2 text-fs-12 text-muted-foreground">
              {TRUST.map(({ icon: Icon, text }) => (
                <Flex as="li" key={text} align="center" gap="1.5">
                  <Icon aria-hidden="true" className="size-4 text-brand" />
                  <Text as="span">{text}</Text>
                </Flex>
              ))}
            </Flex>
          </Box>
        </Flex>

        <Text tone="muted" className="text-center text-fs-12 sm:text-left">
          © {YEAR} {STORE.name}. All rights reserved.
        </Text>
      </Stack>

      {/* Right (lg+): sirf storefront ki tasveer — ek saada browser frame mein */}
      <Flex
        as="aside"
        aria-label={`${STORE.name} storefront preview`}
        align="center"
        justify="center"
        className="sticky top-3 m-3 hidden h-[calc(100dvh-1.5rem)] overflow-hidden rounded-[2.5rem] bg-brand-soft/60 p-8 lg:flex xl:p-12"
      >
        <Box className="w-full max-w-3xl animate-fade-up overflow-hidden rounded-2xl border border-border bg-background shadow-lift">
          <Flex align="center" gap="1.5" aria-hidden="true" className="border-b border-border px-4 py-3">
            <Box as="span" className="size-2.5 rounded-full bg-[#ff5f57]" />
            <Box as="span" className="size-2.5 rounded-full bg-[#febc2e]" />
            <Box as="span" className="size-2.5 rounded-full bg-[#28c840]" />
          </Flex>
          <Image
            src="/images/site/home-preview.webp"
            alt={`${STORE.name} home page — fresh food, beautifully delivered`}
            width={1518}
            height={776}
            priority
            sizes="(min-width: 1024px) 50vw, 0px"
            className="h-auto w-full"
          />
        </Box>
      </Flex>
    </Grid>
  );
}

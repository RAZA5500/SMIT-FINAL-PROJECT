import { ArrowLeft } from "lucide-react";
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
import { AuthShowcase } from "./AuthShowcase";

/** Module load par ek dafa — render ke dauran current date nahi padhte */
const YEAR = new Date().getFullYear();

/**
 * /login aur /register ka frame:
 * Left: glass auth card (Sign in ↔ Create account switch, cursor glow)
 * Right (lg+): store ki photos ka slideshow — headline + story-style tabs
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
          </Box>
        </Flex>

        <Text tone="muted" className="text-center text-fs-12 sm:text-left">
          © {YEAR} {STORE.name}. All rights reserved.
        </Text>
      </Stack>

      <AuthShowcase />
    </Grid>
  );
}

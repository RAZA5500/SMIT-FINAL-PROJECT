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
import { AuthListPicker } from "./AuthListPicker";

/** Module load par ek dafa — render ke dauran current date nahi padhte */
const YEAR = new Date().getFullYear();

/**
 * /login aur /register ka frame: upar logo + theme/back links; beech mein left par tap-to-pick
 * list (lg+) aur right par glass auth card (Sign in ↔ Create account switch); neeche copyright
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <Grid className="relative isolate min-h-dvh flex-1">
      <Aurora />
      <Stack as="main" id="content" className="px-5 py-2 sm:px-10">
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

        <Grid align="center" className="mx-auto w-full max-w-page flex-1 gap-12 py-2 lg:grid-cols-[1.15fr_1fr] xl:gap-20">
          {/* Left (lg+): tap-to-pick list — card ke bagal mein khaali jagah ko zinda karta hai */}
          <Stack align="center" gap="5" className="hidden lg:flex">
            <AuthListPicker />
            <Text tone="muted" className="w-full max-w-xl text-fs-12">
              © {YEAR} {STORE.name}. All rights reserved.
            </Text>
          </Stack>
          <Box className="mx-auto w-full max-w-form animate-fade-up lg:mx-0 lg:justify-self-center">
            <AuthCard>{children}</AuthCard>
          </Box>
        </Grid>

        {/* lg+ par copyright left column mein — page ki height viewport mein samaye, scroll na ho */}
        <Text tone="muted" className="text-center text-fs-12 sm:text-left lg:hidden">
          © {YEAR} {STORE.name}. All rights reserved.
        </Text>
      </Stack>
    </Grid>
  );
}

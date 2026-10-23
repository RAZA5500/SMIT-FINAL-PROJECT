import { ArrowLeft, PackageCheck, Store, Truck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Aurora } from "@/components/ui/aurora";
import { Grid } from "@/components/ui/grid";
import { Heading, Text } from "@/components/ui/typography";
import { HeroOrbit } from "@/components/customer/home/HeroOrbit";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { STORE } from "@/constants/store";
import { publicRoutes } from "@/lib/routes/routes";

/** Store ke asli wade — panel par marketing claims nahi */
const PERKS = [
  { icon: Truck, title: "Free delivery", text: "On every order, no minimum spend." },
  { icon: Store, title: "Click & collect", text: "Pick a slot that suits you." },
  { icon: PackageCheck, title: "Live order tracking", text: "From basket to your door." },
];

/** Module load par ek dafa — render ke dauran current date nahi padhte */
const YEAR = new Date().getFullYear();

/**
 * /login aur /register ka frame: form left (aurora ke upar), right (lg+) ek tairta hua raat jaisa
 * panel — wahi ghoomta product orbit jo home par hai, store ke asli wade glass chips mein.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <Grid className="relative isolate min-h-dvh flex-1 lg:grid-cols-[1fr_1.05fr]">
      <Aurora />
      <Stack as="main" id="content" className="px-5 py-5 sm:px-10">
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
            <ButtonLink href={publicRoutes.shop} variant="ghost" size="sm">
              <ArrowLeft aria-hidden="true" />
              Back to shop
            </ButtonLink>
          </Flex>
        </Flex>

        <Stack justify="center" gap="8" className="mx-auto w-full max-w-form flex-1 py-12">
          {children}
        </Stack>

        <Text tone="muted" className="text-fs-12">
          © {YEAR} {STORE.name} · Demo store — no real payments are taken.
        </Text>
      </Stack>

      <Stack
        as="aside"
        aria-label={`Why shop with ${STORE.name}`}
        justify="between"
        gap="6"
        className="dark sticky top-3 m-3 hidden h-[calc(100dvh-1.5rem)] overflow-hidden rounded-[2.5rem] bg-background p-10 text-foreground lg:flex xl:p-14"
      >
        <Box aria-hidden="true" className="absolute -top-1/4 -right-1/4 size-[70%] animate-drift rounded-full bg-[radial-gradient(closest-side,rgb(34_211_138/0.28),transparent)]" />
        <Box aria-hidden="true" className="absolute -bottom-1/4 -left-1/4 size-[70%] animate-drift-slow rounded-full bg-[radial-gradient(closest-side,rgb(42_168_242/0.22),transparent)]" />
        <Box aria-hidden="true" className="grain absolute inset-0 opacity-[0.08] mix-blend-screen" />

        <Stack gap="3" className="relative max-w-xl animate-fade-up">
          <Text variant="eyebrow" tone="muted">
            Why {STORE.name}
          </Text>
          <Heading as="h2" size="display">
            The neighbourhood market,{" "}
            <Text as="em" variant="accent">
              delivered
            </Text>
            .
          </Heading>
        </Stack>

        <Box className="@container relative mx-auto w-full max-w-lg animate-pop-in overflow-clip [overflow-clip-margin:1rem] [animation-delay:200ms]">
          <HeroOrbit className="aspect-[5/4]" />
        </Box>

        <Flex as="ul" wrap gap="2" className="relative">
          {PERKS.map(({ icon: Icon, title, text }, index) => (
            <Flex
              as="li"
              key={title}
              align="center"
              gap="2.5"
              title={text}
              className="glass animate-fade-up rounded-full border border-glass-border py-2 pr-4 pl-2"
              style={{ animationDelay: `${300 + index * 90}ms` }}
            >
              <Flex as="span" align="center" justify="center" aria-hidden="true" className="size-8 rounded-full bg-fresh text-[#06100b]">
                <Icon className="size-4" />
              </Flex>
              <Stack as="span" gap="0">
                <Text as="span" weight="bold" className="text-fs-13">
                  {title}
                </Text>
                <Text as="span" tone="muted" className="text-fs-12">
                  {text}
                </Text>
              </Stack>
            </Flex>
          ))}
        </Flex>
      </Stack>
    </Grid>
  );
}

"use client";

import { ArrowRight, Clock, Sparkles, Store, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Heading, Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { STORE } from "@/constants/store";
import { publicRoutes } from "@/lib/routes/routes";
import { HeroSearch } from "./HeroSearch";
import { HeroSpotlight } from "./HeroSpotlight";

/** Store ke asli wade (FLOW-MD 01) — hero ke neeche chhote stickers */
const PROMISES = [
  { icon: Truck, text: "Free delivery, every order" },
  { icon: Store, text: "Click & collect" },
  { icon: Clock, text: `Confirmed in ${STORE.paymentWindowMinutes} min` },
];

/** Night aubergine hero: giant display headline, live search, aur spotlight carousel */
export function HomeHero() {
  return (
    <Box
      as="section"
      aria-labelledby="home-hero-heading"
      className="relative isolate overflow-hidden rounded-4xl bg-night text-night-foreground"
    >
      <Box aria-hidden="true" className="texture-dots absolute inset-0 -z-10 text-night-foreground/5" />
      <Box aria-hidden="true" className="absolute -top-40 -left-24 -z-10 size-112 rounded-full bg-primary/50 blur-3xl" />
      <Box aria-hidden="true" className="absolute -right-32 -bottom-40 -z-10 size-96 rounded-full bg-tangerine/25 blur-3xl" />

      <Grid align="center" gap="12" className="p-6 pb-10 sm:p-10 lg:grid-cols-12 lg:gap-8 lg:p-14">
        <Stack gap="8" className="lg:col-span-7">
          <Badge variant="outline" className="h-8 w-fit gap-2 rounded-full border-night-border bg-night-foreground/10 px-3.5 text-night-foreground">
            <Box as="span" className="relative flex size-2">
              <Box as="span" className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-75" />
              <Box as="span" className="relative inline-flex size-2 rounded-full bg-lime" />
            </Box>
            Open today · delivered free
          </Badge>

          <Heading id="home-hero-heading" size="hero" tone="night" className="animate-fade-up">
            The freshest market,{" "}
            <Text as="span" tone="inherit" className="marker">
              delivered
            </Text>{" "}
            to your door.
          </Heading>

          <Text tone="night-muted" className="max-w-xl text-base sm:text-lg">
            Crisp produce, butcher cuts, warm bakes and everyday essentials from your neighbourhood stalls. Free
            delivery on every order — or collect it at a time that suits you.
          </Text>

          <HeroSearch />

          <Flex wrap align="center" gap="3">
            <ButtonLink href={publicRoutes.shop} variant="cta" size="xl">
              Shop the market
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#shelves" variant="glass" size="xl">
              <Sparkles aria-hidden="true" className="text-lime" />
              What&apos;s new today
            </ButtonLink>
          </Flex>

          <Flex as="ul" wrap gap="2" className="pt-1">
            {PROMISES.map(({ icon: Icon, text }) => (
              <Flex
                as="li"
                key={text}
                align="center"
                gap="2"
                className="rounded-full border border-night-border px-3 py-1.5 text-fs-12 font-semibold text-night-muted"
              >
                <Icon aria-hidden="true" className="size-3.5 text-lime" />
                {text}
              </Flex>
            ))}
          </Flex>
        </Stack>

        <Box className="lg:col-span-5">
          <HeroSpotlight />
        </Box>
      </Grid>
    </Box>
  );
}

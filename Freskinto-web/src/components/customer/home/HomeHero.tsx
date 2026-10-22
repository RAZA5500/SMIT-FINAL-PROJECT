"use client";

import { ArrowRight, Clock, Store, Truck } from "lucide-react";
import Image from "next/image";
import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Heading, Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { STORE } from "@/constants/store";
import { publicRoutes } from "@/lib/routes/routes";
import { HeroSearch } from "./HeroSearch";

/** Store ke asli wade (FLOW-MD 01) — hero ke neeche ek quiet line */
const PROMISES = [
  { icon: Truck, text: "Free delivery on every order" },
  { icon: Store, text: "Click & collect" },
  { icon: Clock, text: `Confirmed in ${STORE.paymentWindowMinutes} min` },
];

/** Calm hero: headline, live search, two actions and one editorial photo */
export function HomeHero() {
  return (
    <Grid as="section" aria-labelledby="home-hero-heading" align="center" gap="10" className="lg:grid-cols-2 lg:gap-16">
      <Stack gap="6" className="animate-fade-up">
        <Stack gap="4">
          <Heading id="home-hero-heading" size="hero">
            Fresh groceries, delivered to your door.
          </Heading>
          <Text variant="lead" className="max-w-lg">
            Produce, butcher cuts, bakery and everyday essentials from your neighbourhood market — delivered free or
            ready to collect.
          </Text>
        </Stack>

        <HeroSearch />

        <Flex wrap align="center" gap="3">
          <ButtonLink href={publicRoutes.shop} size="lg">
            Shop all products
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="#aisles" variant="outline" size="lg">
            Browse aisles
          </ButtonLink>
        </Flex>

        <Flex as="ul" wrap className="gap-x-5 gap-y-2 pt-2">
          {PROMISES.map(({ icon: Icon, text }) => (
            <Flex as="li" key={text} align="center" gap="2" className="text-fs-13 text-muted-foreground">
              <Icon aria-hidden="true" className="size-4" />
              {text}
            </Flex>
          ))}
        </Flex>
      </Stack>

      <Box className="relative aspect-4/3 overflow-hidden rounded-xl border bg-muted max-lg:hidden">
        <Image
          src="/images/editorial/produce-market.webp"
          alt="Crates of fresh vegetables at the market"
          fill
          priority
          sizes="(min-width: 1280px) 600px, 50vw"
          className="object-cover"
        />
      </Box>
    </Grid>
  );
}

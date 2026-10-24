"use client";

import { ArrowRight, Clock, Store, Truck } from "lucide-react";
import type { CSSProperties } from "react";
import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Separator } from "@/components/ui/separator";
import { Heading, Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { STORE } from "@/constants/store";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useGetProducts } from "@/services/products/queries";
import { useAisles } from "../shop/use-aisles";
import { HeroOrbit } from "./HeroOrbit";
import { HeroSearch } from "./HeroSearch";

/** Har line thodi der se — headline ek lehar mein ubharti hai */
const rise = (index: number) => ({ animationDelay: `${120 + index * 110}ms` }) as CSSProperties;

/** Store ke asli wade (FLOW-MD 01) — orbit ke gird tairte glass chips */
const CHIPS = [
  { icon: Truck, text: "Free delivery, every order", className: "top-[20%] left-[-2%] [animation-delay:-2s]" },
  { icon: Store, text: "Click & collect", className: "top-[24%] right-[-3%] [animation-delay:-5s]" },
  { icon: Clock, text: `Pay in ${STORE.paymentWindowMinutes} minutes`, className: "right-[6%] bottom-[14%] [animation-delay:-7s]" },
];

/** Signature hero: bari display headline + live search (left), 3D product orbit (right) */
export function HomeHero() {
  const { data } = useGetProducts({ limit: 1 });
  const { aisles } = useAisles();
  const productCount = data?.meta.total;

  return (
    <Grid
      as="section"
      aria-labelledby="home-hero-heading"
      align="center"
      gap="8"
      className="min-h-[calc(100svh-5rem)] pt-6 pb-8 sm:pt-8 sm:pb-10 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:pt-10 lg:pb-12"
    >
      <Stack gap="7" className="relative z-10">
        <Flex
          align="center"
          gap="2.5"
          className="glass w-fit animate-fade-up rounded-full border border-glass-border py-1.5 pr-4 pl-2.5 shadow-xs transition-colors hover:border-brand/40"
          style={rise(0)}
        >
          <Box as="span" className="relative flex size-2.5">
            <Box as="span" className="absolute inline-flex size-full animate-ping-soft rounded-full bg-brand" />
            <Box as="span" className="relative inline-flex size-2.5 rounded-full bg-brand" />
          </Box>
          <Text as="span" weight="semibold" className="text-fs-13">
            Open now · free delivery on every order
          </Text>
        </Flex>

        <Heading id="home-hero-heading" size="hero">
          <Text as="span" tone="inherit" className="block animate-fade-up" style={rise(1)}>
            Fresh food,
          </Text>
          <Text as="span" tone="inherit" className="block animate-fade-up" style={rise(2)}>
            <Text as="em" variant="accent" className="text-[1.08em] leading-[0.9]">
              beautifully
            </Text>{" "}
            delivered.
          </Text>
        </Heading>

        <Text variant="lead" className="max-w-xl animate-fade-up" style={rise(3)}>
          Produce, butcher cuts, warm bakes and everyday essentials from your neighbourhood market — at your door, or
          ready to collect.
        </Text>

        <Box className="animate-fade-up" style={rise(4)}>
          <HeroSearch />
        </Box>

        <Flex wrap align="center" gap="3" className="animate-fade-up" style={rise(5)}>
          <ButtonLink href={publicRoutes.shop} transitionTypes={["nav-forward"]} variant="fresh" size="xl">
            Start shopping
            <ArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover/button:translate-x-1" />
          </ButtonLink>
          <ButtonLink href="#aisles" variant="outline" size="xl">
            Walk the aisles
          </ButtonLink>
        </Flex>

        <Flex align="center" gap="5" className="animate-fade-up flex-wrap pt-1 sm:flex-nowrap sm:gap-6" style={rise(6)}>
          <Stat value={productCount} label="fresh products" />
          <Separator orientation="vertical" className="data-vertical:h-9" />
          <Stat value={aisles.length || undefined} label="aisles to explore" />
          <Separator orientation="vertical" className="data-vertical:h-9" />
          <Stack gap="0.5">
            <Text as="span" weight="semibold" className="font-display text-2xl tracking-[-0.04em]">
              £0
            </Text>
            <Text as="span" tone="muted" className="text-fs-12">
              delivery fee
            </Text>
          </Stack>
        </Flex>

        {/* Quick promise tags that fill the section nicely on smaller screens where orbit chips are hidden */}
        <Flex as="ul" wrap gap="2" className="animate-fade-up pt-1 sm:hidden" style={rise(7)}>
          {CHIPS.map(({ icon: Icon, text }) => (
            <Flex
              as="li"
              key={text}
              align="center"
              gap="1.5"
              className="glass rounded-full border border-glass-border px-3 py-1 text-fs-12 font-medium"
            >
              <Icon className="size-3 text-brand" />
              <Text as="span" tone="inherit">
                {text}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Stack>

      <Box className="relative mx-auto w-full max-w-xl lg:max-w-2xl animate-pop-in [animation-delay:250ms]">
        {/* 3D layers ki chhupi seemaayein page ko sideways scroll na karayein — kuch rem bahar tak paint hota hai */}
        <Box className="@container overflow-clip [overflow-clip-margin:1rem]">
          {/* Phone par chips nahi — orbit ka khaali upar/neeche kaat kar stage chapta */}
          <HeroOrbit className="max-sm:aspect-[4/3]" />
        </Box>
        {CHIPS.map(({ icon: Icon, text, className }) => (
          <Flex
            key={text}
            align="center"
            gap="2"
            aria-hidden="true"
            className={cn(
              "glass absolute hidden animate-float rounded-full border border-glass-border py-2 pr-3.5 pl-2 text-fs-13 font-semibold sm:flex",
              className,
            )}
          >
            <Flex as="span" align="center" justify="center" className="size-7 rounded-full bg-fresh text-[#06100b]">
              <Icon className="size-3.5" />
            </Flex>
            {text}
          </Flex>
        ))}
      </Box>
    </Grid>
  );
}

function Stat({ value, label }: { value: number | undefined; label: string }) {
  return (
    <Stack gap="0.5">
      {value === undefined ? (
        <Text as="span" weight="semibold" className="font-display text-2xl tracking-[-0.04em]">
          —
        </Text>
      ) : (
        <NumberTicker value={value} className="font-display text-2xl font-semibold tracking-[-0.04em]" />
      )}
      <Text as="span" tone="muted" className="text-fs-12">
        {label}
      </Text>
    </Stack>
  );
}

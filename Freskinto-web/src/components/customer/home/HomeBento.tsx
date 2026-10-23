import { Home, Truck } from "lucide-react";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Reveal } from "@/components/ui/reveal";
import { Heading, Text } from "@/components/ui/typography";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { STORE } from "@/constants/store";
import { packshotUrl } from "@/lib/merchandising";
import { cn } from "@/lib/utils";

const TRACK_STEPS = ["Placed", "Packed", "On the way", "Delivered"];
const hour = (value: number) => `${value % 12 || 12}${value < 12 ? "am" : "pm"}`;

function Tile({ eyebrow, title, children, className }: { eyebrow: string; title: string; children: ReactNode; className?: string }) {
  return (
    <Card
      className={cn(
        "group/tile relative isolate h-full justify-between gap-6 overflow-hidden rounded-[2rem] p-6 transition-[translate,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-lift sm:p-7",
        className,
      )}
    >
      {children}
      <Stack gap="2" className="relative">
        <Text variant="eyebrow" tone="muted">
          {eyebrow}
        </Text>
        <Heading as="h3" size="2">
          {title}
        </Heading>
      </Stack>
    </Card>
  );
}

/**
 * "Made effortless" — store ke asli wade ek bento mein, har tile mein chhoti zinda animation:
 * van ghar tak jati hai, ghadi chalti hai, payment ring bharta hai, order ke steps jagte hain.
 */
export function HomeBento() {
  const { openHour, closeHour, daysAhead } = STORE.pickup;

  return (
    <Stack as="section" aria-labelledby="bento-heading" gap="8">
      <Reveal>
        <SectionHeading
          id="bento-heading"
          eyebrow="How it works"
          title={
            <>
              Made{" "}
              <Text as="em" variant="accent">
                effortless
              </Text>
            </>
          }
          description="No minimum spend, no delivery fee — and you can follow your order every step of the way."
        />
      </Reveal>

      <Grid gap="4" className="md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
        <Reveal variant="scale" className="md:col-span-2 lg:row-span-2">
          <Tile eyebrow="Delivery" title="Free delivery on every order" className="min-h-96 bg-fresh-soft">
            <Box aria-hidden="true" className="aura absolute -top-24 -right-24 -z-10 size-96 [--aura:#22d38a]" />
            <Box aria-hidden="true" className="absolute top-[24%] right-[-5%] -z-10 size-48 sm:size-64">
              <Image src={packshotUrl("premium-bananas")} alt="" fill sizes="256px" className="product-float animate-float-slow object-contain" />
            </Box>
            <Box aria-hidden="true" className="absolute top-[30%] right-[38%] -z-10 hidden size-32 sm:block">
              <Image
                src={packshotUrl("multigrain-sandwich-bread")}
                alt=""
                fill
                sizes="144px"
                className="product-float animate-float object-contain [animation-delay:-3s]"
              />
            </Box>
            <Flex aria-hidden="true" align="center" className="relative h-14 rounded-full border border-glass-border bg-card/70 px-1.5 backdrop-blur">
              <Box className="absolute inset-x-14 top-1/2 h-0 border-t-2 border-dashed border-foreground/20" />
              <Flex
                align="center"
                justify="center"
                className="absolute top-1/2 size-11 -translate-y-1/2 animate-drive rounded-full bg-fresh text-[#06100b] shadow-glow"
              >
                <Truck className="size-5" />
              </Flex>
              <Flex align="center" justify="center" className="ml-auto size-11 rounded-full bg-primary text-primary-foreground">
                <Home className="size-5" />
              </Flex>
            </Flex>
          </Tile>
        </Reveal>

        <Reveal variant="scale" delay={90} className="md:col-span-2">
          <Tile eyebrow="Click & collect" title={`Collect any day this week, ${hour(openHour)}–${hour(closeHour)}`}>
            <Flex align="center" gap="5" aria-hidden="true">
              <Box className="relative size-24 shrink-0 rounded-full border border-border bg-card shadow-soft">
                {Array.from({ length: 12 }, (_, index) => (
                  <Box
                    key={index}
                    className="absolute top-1/2 left-1/2 h-[46%] w-px origin-top"
                    style={{ rotate: `${index * 30}deg` } as CSSProperties}
                  >
                    <Box className="absolute bottom-0 h-1.5 w-px bg-foreground/30" />
                  </Box>
                ))}
                <Box className="absolute bottom-1/2 left-1/2 h-[28%] w-1 -translate-x-1/2 origin-bottom rotate-[60deg] rounded-full bg-foreground" />
                <Box className="absolute bottom-1/2 left-1/2 h-[38%] w-0.5 -translate-x-1/2 origin-bottom animate-spin-slow rounded-full bg-brand" />
                <Box className="absolute top-1/2 left-1/2 size-2.5 -translate-1/2 rounded-full bg-foreground" />
              </Box>
              <Text tone="muted" className="max-w-56">
                {`Choose a slot up to ${daysAhead} days ahead — we'll have it packed and waiting.`}
              </Text>
            </Flex>
          </Tile>
        </Reveal>

        <Reveal variant="scale" delay={180}>
          <Tile eyebrow="Payment" title={`Confirmed in ${STORE.paymentWindowMinutes} minutes`}>
            <Box aria-hidden="true" className="relative size-24">
              <Box className="progress-ring absolute inset-0 animate-ring-fill rounded-full" />
              <Flex align="center" justify="center" className="absolute inset-0 font-display text-xl font-semibold tracking-[-0.04em]">
                {STORE.paymentWindowMinutes}:00
              </Flex>
            </Box>
          </Tile>
        </Reveal>

        <Reveal variant="scale" delay={270}>
          <Tile eyebrow="Tracking" title="Every step, live">
            <Stack aria-hidden="true" gap="2.5">
              {TRACK_STEPS.map((step, index) => (
                <Flex key={step} align="center" gap="3">
                  <Box
                    className="size-3 animate-step-glow rounded-full bg-fresh shadow-glow"
                    style={{ animationDelay: `${index * 0.9}s` } as CSSProperties}
                  />
                  <Text as="span" weight="semibold" className="text-fs-13">
                    {step}
                  </Text>
                </Flex>
              ))}
            </Stack>
          </Tile>
        </Reveal>
      </Grid>
    </Stack>
  );
}

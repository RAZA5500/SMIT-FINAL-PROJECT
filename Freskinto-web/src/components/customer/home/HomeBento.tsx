import { Home, Sparkles, Store, Truck } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Reveal } from "@/components/ui/reveal";
import { Heading, Text } from "@/components/ui/typography";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { STORE } from "@/constants/store";
import { cn } from "@/lib/utils";

const TRACK_STEPS = ["Placed", "Packed", "On the way", "Delivered"];
const hour = (value: number) => `${value % 12 || 12}${value < 12 ? "am" : "pm"}`;

function Tile({ eyebrow, title, children, className }: { eyebrow: string; title: string; children: ReactNode; className?: string }) {
  return (
    <Card
      className={cn(
        "group/tile relative isolate h-full justify-between gap-6 overflow-hidden rounded-[2rem] p-6 transition-[translate,box-shadow,border-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-foreground/15 hover:shadow-lift dark:hover:border-white/20 sm:p-7",
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
          <Card
            className={cn(
              "group/tile relative isolate flex h-full flex-col justify-between overflow-hidden rounded-[2rem] p-6 transition-[translate,box-shadow,border-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-foreground/15 hover:shadow-lift dark:hover:border-white/20 sm:gap-6 sm:p-7",
            )}
          >
            {/* Subtle brand aura in background */}
            <Box
              aria-hidden="true"
              className="aura pointer-events-none absolute -top-24 -right-24 -z-10 size-80 opacity-60 [--aura:var(--brand)]"
            />

            {/* Header: Eyebrow, Badge & Heading */}
            <Stack gap="3" className="relative z-10">
              <Flex align="center" justify="between" gap="2" wrap>
                <Flex align="center" gap="2">
                  <Box as="span" className="flex size-7 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
                    <Truck className="size-4" />
                  </Box>
                  <Text variant="eyebrow" tone="muted">
                    Doorstep Delivery
                  </Text>
                </Flex>
                <Box as="span" className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-soft/80 px-3 py-1 text-fs-12 font-semibold text-brand-ink shadow-2xs">
                  <Box as="span" className="size-1.5 rounded-full bg-brand animate-ping-soft" />
                  $0 min order
                </Box>
              </Flex>

              <Stack gap="1.5">
                <Heading as="h3" size="2">
                  Free delivery on every order
                </Heading>
                <Text tone="muted" className="text-fs-13 max-w-md leading-relaxed sm:text-fs-14">
                  No minimum spend, no delivery fees, and no surprise markups. Fresh groceries handpicked and brought straight to your door.
                </Text>
              </Stack>
            </Stack>

            {/* Live Delivery Journey Visualizer */}
            <Box className="relative my-4 rounded-2xl border border-border/80 bg-muted/40 p-4 sm:p-5 backdrop-blur-xs">
              <Flex align="center" justify="between" className="mb-4 text-fs-12 text-muted-foreground font-medium">
                <Flex align="center" gap="1.5">
                  <Sparkles className="size-3.5 text-brand" />
                  <Text as="span" className="font-semibold text-foreground">Freskinto Express</Text>
                </Flex>
                <Text as="span" className="rounded-full bg-brand-soft px-2.5 py-0.5 font-semibold text-brand-ink text-fs-11">
                  Avg 35 mins
                </Text>
              </Flex>

              {/* Transit Road & Stations */}
              <Box className="relative py-2">
                <Box className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                  <Box className="absolute inset-y-0 left-0 w-3/4 rounded-full bg-gradient-to-r from-brand/30 via-brand to-brand" />
                </Box>

                <Flex align="center" justify="between" className="relative -mt-4.5">
                  {/* Origin */}
                  <Stack align="center" gap="1.5">
                    <Flex
                      align="center"
                      justify="center"
                      className="size-9 rounded-full border-2 border-background bg-card text-foreground shadow-xs"
                    >
                      <Store className="size-4" />
                    </Flex>
                    <Text as="span" tone="muted" className="text-fs-11 font-medium whitespace-nowrap">
                      Market Hub
                    </Text>
                  </Stack>

                  {/* Active Van position */}
                  <Stack align="center" gap="1.5" className="relative -translate-x-3 sm:-translate-x-4">
                    <Flex
                      align="center"
                      justify="center"
                      className="size-10 rounded-full bg-fresh text-[#06100b] shadow-glow"
                    >
                      <Truck className="size-5" />
                    </Flex>
                    <Text as="span" className="text-fs-11 font-semibold text-brand-ink whitespace-nowrap">
                      On the way
                    </Text>
                  </Stack>

                  {/* Destination */}
                  <Stack align="center" gap="1.5">
                    <Flex
                      align="center"
                      justify="center"
                      className="size-9 rounded-full border-2 border-background bg-primary text-primary-foreground shadow-xs"
                    >
                      <Home className="size-4" />
                    </Flex>
                    <Text as="span" tone="muted" className="text-fs-11 font-medium whitespace-nowrap">
                      Your Door
                    </Text>
                  </Stack>
                </Flex>
              </Box>
            </Box>

            {/* Bottom 3 Delivery Features */}
            <Grid cols="3" gap="2" className="pt-1">
              <Box className="rounded-xl border border-border/60 bg-card/60 p-2.5 text-center sm:p-3">
                <Text as="span" weight="bold" className="block text-fs-13 text-foreground">
                  $0 min
                </Text>
                <Text as="span" tone="muted" className="text-fs-11">
                  Any cart size
                </Text>
              </Box>
              <Box className="rounded-xl border border-border/60 bg-card/60 p-2.5 text-center sm:p-3">
                <Text as="span" weight="bold" className="block text-fs-13 text-foreground">
                  Chilled
                </Text>
                <Text as="span" tone="muted" className="text-fs-11">
                  Insulated bags
                </Text>
              </Box>
              <Box className="rounded-xl border border-border/60 bg-card/60 p-2.5 text-center sm:p-3">
                <Text as="span" weight="bold" className="block text-fs-13 text-foreground">
                  Live GPS
                </Text>
                <Text as="span" tone="muted" className="text-fs-11">
                  Step-by-step
                </Text>
              </Box>
            </Grid>
          </Card>
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

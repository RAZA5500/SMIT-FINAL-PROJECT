import { ArrowRight, Check, ShieldCheck, Sparkles, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Heading, Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { packshotUrl } from "@/lib/merchandising";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

const POPULAR_SEARCHES = ["Bananas", "Chicken", "Milk", "Bread", "Spinach"];

const TRUST_POINTS = [
  "Free delivery on every order",
  "Click & collect anytime",
  "Freshness guaranteed",
];

/** "Today's crate" — demo packshots */
const CRATE = [
  { image: "premium-bananas", label: "Bananas" },
  { image: "fresh-whole-milk-1l", label: "Whole milk" },
  { image: "fresh-bell-peppers", label: "Peppers" },
  { image: "whole-wheat-bread-loaf", label: "Wholemeal" },
  { image: "royal-gala-apples", label: "Gala apples" },
  { image: "fresh-chicken-breast", label: "Chicken" },
];

export function HeroSection() {
  return (
    <Container as="section" aria-labelledby="hero-heading" className={cn("pt-6 sm:pt-10")}>
      <Grid align="center" gap="10" className={cn("lg:grid-cols-12 lg:gap-12")}>
        <Stack gap="6" className={cn("animate-fade-up lg:col-span-6")}>
          <Badge variant="brand" className={cn("w-fit px-3.5 py-1 text-xs font-semibold")}>
            <Box as="span" aria-hidden="true" className={cn("size-2 animate-pulse rounded-full bg-brand-green")} />
            Open today · Fresh groceries, delivered free
          </Badge>
          <Heading id="hero-heading" size="display" family="serif" className={cn("text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground font-serif")}>
            Your fresh market,{" "}
            <Text as="span" className={cn("text-brand-green font-bold italic")}>
              delivered to your door.
            </Text>
          </Heading>
          <Text variant="lead" className={cn("max-w-lg text-muted-foreground text-base sm:text-lg")}>
            Fresh fruit &amp; veg, poultry, dairy, and everyday pantry essentials — free delivery on every order, or click &amp;
            collect when it suits you.
          </Text>
          <Flex wrap gap="3" className={cn("pt-1")}>
            <ButtonLink href={shopUrl()} size="xl" variant="default" className={cn("shadow-md shadow-brand-green/20")}>
              Start shopping
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#how-it-works" size="xl" variant="outline">
              How it works
            </ButtonLink>
          </Flex>
          <Flex wrap align="center" gap="2" className={cn("pt-1")}>
            <Text as="span" variant="small" tone="muted" className={cn("font-medium")}>
              Popular:
            </Text>
            {POPULAR_SEARCHES.map((term) => (
              <Badge
                key={term}
                variant="outline"
                render={<Link href={shopUrl({ q: term })} />}
                className={cn("h-7 px-3 hover:border-brand-green hover:text-brand-green transition-colors font-medium")}
              >
                {term}
              </Badge>
            ))}
          </Flex>

          <Flex wrap gap="5" className={cn("border-t border-border/80 pt-5 text-sm text-muted-foreground")}>
            {TRUST_POINTS.map((point) => (
              <Flex key={point} align="center" gap="2">
                <Box as="span" className={cn("flex size-5 items-center justify-center rounded-full bg-icon-green text-brand-green-forest")}>
                  <Check className="size-3" strokeWidth={3} />
                </Box>
                <span>{point}</span>
              </Flex>
            ))}
          </Flex>
        </Stack>

        <Box className={cn("relative lg:col-span-6")}>
          <div aria-hidden="true" className="absolute -inset-4 rounded-full bg-brand-green/10 blur-3xl pointer-events-none" />
          <HeroCrate />
        </Box>
      </Grid>
    </Container>
  );
}

function HeroCrate() {
  return (
    <Box aria-hidden="true" className={cn("relative pb-10 sm:pb-0")}>
      <Card className={cn("relative gap-4 border-border/80 bg-gradient-to-b from-info-card-bg to-secondary p-4 shadow-lift ring-1 ring-border/40 sm:p-6 rounded-3xl overflow-hidden")}>
        <Flex align="center" justify="between" className={cn("px-1 pb-1")}>
          <Flex align="center" gap="2">
            <Sparkles className="size-4 text-brand-green" />
            <Text as="span" weight="bold" className={cn("text-sm font-bold uppercase tracking-wider text-brand-green")}>
              Today&apos;s Fresh Crate
            </Text>
          </Flex>
          <Badge variant="brand" className={cn("text-xs font-semibold")}>
            Handpicked Daily
          </Badge>
        </Flex>
        <Grid cols="3" gap="2.5" className={cn("sm:gap-3.5")}>
          {CRATE.map((item, index) => (
            <Card key={item.image} size="sm" className={cn("gap-1.5 rounded-2xl border-border/60 bg-card p-2.5 shadow-xs transition-all duration-300 hover:scale-105 hover:shadow-soft", index % 2 === 1 && "sm:translate-y-3")}>
              <AspectRatio ratio={1} className={cn("rounded-xl bg-info-card-bg")}>
                <Image
                  src={packshotUrl(item.image)}
                  alt=""
                  fill
                  loading="eager"
                  sizes="(min-width: 1024px) 180px, 30vw"
                  className={cn("object-contain p-2")}
                />
              </AspectRatio>
              <Text as="span" weight="medium" className={cn("truncate text-center text-xs font-semibold text-foreground")}>
                {item.label}
              </Text>
            </Card>
          ))}
        </Grid>

        <Flex align="center" justify="between" className={cn("mt-2 rounded-2xl bg-card p-3.5 shadow-xs border border-border/60")}>
          <Flex align="center" gap="2.5">
            <Flex align="center" justify="center" className={cn("size-9 rounded-xl bg-icon-green text-brand-green-forest")}>
              <Truck className="size-5" />
            </Flex>
            <Stack gap="0">
              <Text as="span" weight="semibold" className={cn("text-sm font-semibold leading-tight text-foreground")}>
                Free Delivery
              </Text>
              <Text as="span" variant="small" tone="muted" className={cn("text-xs text-muted-foreground")}>
                On all fresh grocery orders
              </Text>
            </Stack>
          </Flex>
          <Flex align="center" gap="1.5" className={cn("text-xs font-semibold text-brand-green")}>
            <ShieldCheck className="size-4" />
            <span>Guaranteed</span>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}

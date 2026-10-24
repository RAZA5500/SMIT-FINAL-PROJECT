"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Reveal } from "@/components/ui/reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading, Text } from "@/components/ui/typography";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { categoryTheme, packshotUrl } from "@/lib/merchandising";
import { shopUrl } from "@/lib/routes/routes";
import { cn, pluralize } from "@/lib/utils";
import { useAisles } from "../shop/use-aisles";

/** Editorial photos jo aisle ke naam se milti hain — na milein to aura + tairti photo */
const EDITORIAL: { pattern: RegExp; image: string }[] = [
  { pattern: /veg|produce|salad|green/i, image: "/images/editorial/produce-aisle.webp" },
  { pattern: /fruit|citrus|orchard/i, image: "/images/editorial/fruit-crates.webp" },
  { pattern: /bak|bread|pastr|loaf/i, image: "/images/editorial/artisan-bread.webp" },
  { pattern: /chees/i, image: "/images/editorial/cheese-board.webp" },
  { pattern: /dairy|milk|egg/i, image: "/images/editorial/milk-bottle.webp" },
  { pattern: /poultry|chicken/i, image: "/images/editorial/chicken-packs.webp" },
  { pattern: /meat|beef|butcher|steak/i, image: "/images/editorial/butcher-mince.webp" },
];

const PANEL_LIMIT = 7;

/**
 * "Walk the aisles" — tasveeron ke khade panel; hover/focus wala panel phail kar khulta hai
 * (flex-grow, expo easing) aur naam, sub-aisles aur button dikhata hai. Phone par swipe cards.
 */
export function HomeAisles() {
  const { aisles, isLoading } = useAisles();
  const [active, setActive] = useState(0);
  const panels = aisles.slice(0, PANEL_LIMIT);

  return (
    <Stack as="section" id="aisles" aria-labelledby="aisles-heading" gap="8" className="scroll-mt-header">
      <Reveal>
        <SectionHeading
          id="aisles-heading"
          eyebrow="Explore"
          title={
            <>
              Walk the{" "}
              <Text as="em" variant="accent">
                aisles
              </Text>
            </>
          }
          description="Every aisle of the market — hover to step inside, tap to start shopping."
          href={shopUrl()}
          hrefLabel="All products"
        />
      </Reveal>

      <Reveal variant="scale">
        <Flex
          gap="3"
          className="no-scrollbar -mx-4 snap-x snap-mandatory overflow-x-auto px-4 pb-2 md:mx-0 md:h-[30rem] md:overflow-visible md:px-0 md:pb-0"
        >
          {isLoading &&
            Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-[24rem] w-[72vw] shrink-0 rounded-[2rem] md:h-full md:w-auto md:flex-1" />
            ))}
          {panels.map((aisle, index) => {
            const theme = categoryTheme(aisle.name);
            const photo = EDITORIAL.find((item) => item.pattern.test(aisle.name))?.image;
            const open = index === active;
            return (
              <Card
                key={aisle.id}
                render={<Link href={shopUrl({ category: aisle.id })} transitionTypes={["nav-forward"]} />}
                onPointerEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                data-open={open || undefined}
                style={{ "--aura": theme.aura } as CSSProperties}
                className={cn(
                  "group/panel relative isolate h-[24rem] w-[72vw] shrink-0 snap-start justify-end gap-0 overflow-hidden rounded-[2rem] border-0 p-0 text-white shadow-none transition-[flex-grow] duration-700 ease-out-expo md:h-full md:w-auto md:min-w-0 md:flex-1 md:data-open:flex-[3.4]",
                  !photo && "aura-wash",
                )}
              >
                {photo ? (
                  <Image
                    src={photo}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 45vw, 72vw"
                    className="-z-20 object-cover transition-[scale] duration-1000 ease-out-expo group-hover/panel:scale-105"
                  />
                ) : (
                  <>
                    <Box aria-hidden="true" className="aura absolute inset-[-10%] -z-20" />
                    {theme.image && (
                      <Image
                        src={packshotUrl(theme.image)}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 30vw, 60vw"
                        className="product-float -z-10 animate-float-slow object-contain p-[18%]"
                      />
                    )}
                  </>
                )}
                <Box
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-linear-to-t from-[#06100b]/85 via-[#06100b]/20 to-transparent"
                />

                {/* Band panel: khada naam (desktop) */}
                <Text
                  as="span"
                  aria-hidden="true"
                  tone="inherit"
                  className="absolute bottom-6 left-1/2 hidden origin-center -translate-x-1/2 font-display text-lg font-semibold tracking-[-0.02em] whitespace-nowrap transition-opacity duration-300 [writing-mode:vertical-rl] md:block md:rotate-180 md:group-data-open/panel:opacity-0"
                >
                  {aisle.name}
                </Text>

                <Stack
                  gap="3"
                  className="p-6 transition-[opacity,translate] duration-700 ease-out-expo md:translate-y-6 md:opacity-0 md:group-data-open/panel:translate-y-0 md:group-data-open/panel:opacity-100 md:group-data-open/panel:delay-150"
                >
                  <Text variant="eyebrow" tone="inherit" className="text-white/70">
                    {aisle.children.length > 0 ? pluralize(aisle.children.length, "sub-aisle") : "Aisle"}
                  </Text>
                  <Flex align="end" justify="between" gap="4">
                    <Heading as="h3" size="2" tone="inherit" className="leading-none md:text-4xl">
                      {aisle.name}
                    </Heading>
                    <Flex
                      as="span"
                      align="center"
                      justify="center"
                      aria-hidden="true"
                      className="size-12 shrink-0 rounded-full bg-fresh text-[#06100b] shadow-glow transition-transform duration-500 ease-spring group-hover/panel:rotate-45"
                    >
                      <ArrowUpRight className="size-5" />
                    </Flex>
                  </Flex>
                  {aisle.children.length > 0 && (
                    <Flex wrap gap="1.5" className="hidden md:flex">
                      {aisle.children.slice(0, 4).map((child) => (
                        <Text
                          as="span"
                          key={child.id}
                          tone="inherit"
                          className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-fs-12 font-semibold backdrop-blur"
                        >
                          {child.name}
                        </Text>
                      ))}
                    </Flex>
                  )}
                </Stack>
              </Card>
            );
          })}
        </Flex>
      </Reveal>
    </Stack>
  );
}

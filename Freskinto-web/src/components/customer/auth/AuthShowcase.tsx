"use client";

import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Heading, Text } from "@/components/ui/typography";
import { STORE } from "@/constants/store";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useAisles } from "../shop/use-aisles";

/**
 * Bento tiles — store ke chaar aisles, har ek apni editorial photo ke saath. `pattern` se asli
 * category dhoondte hain (link us aisle par); API na chale to tile poori shop kholta hai.
 */
const TILES = [
  {
    name: "Fruit & veg",
    note: "Picked for crunch and colour",
    pattern: /veg|produce|fruit/i,
    image: "/images/editorial/produce-aisle.webp",
    className: "row-span-2",
  },
  { name: "Bakery", note: "Warm loaves", pattern: /bak|bread/i, image: "/images/editorial/artisan-bread.webp", className: "" },
  { name: "Dairy", note: "Milk, eggs & more", pattern: /dairy|milk|egg/i, image: "/images/editorial/milk-bottle.webp", className: "" },
  {
    name: "Meat & poultry",
    note: "Butcher-counter cuts",
    pattern: /meat|butcher|beef|poultry|chicken/i,
    image: "/images/editorial/butcher-mince.webp",
    className: "col-span-2",
  },
];

const PERKS = ["Free delivery", "Click & collect", `Pay in ${STORE.paymentWindowMinutes} minutes`];

/** Auth page ka right panel: brand-green panel par tagline, aisles ka bento grid aur store ke wade */
export function AuthShowcase() {
  const { aisles } = useAisles();

  return (
    <Stack
      as="aside"
      aria-label={`Shop the ${STORE.name} aisles`}
      gap="6"
      className="sticky top-3 m-3 hidden h-[calc(100dvh-1.5rem)] overflow-hidden rounded-[2.5rem] bg-[linear-gradient(150deg,#0f5c42_0%,#0b3a2b_55%,#06100b_100%)] p-8 text-white lg:flex xl:p-10"
    >
      <Box aria-hidden="true" className="absolute -top-32 -right-24 -z-0 size-[28rem] rounded-full bg-[radial-gradient(closest-side,rgb(34_211_138/0.35),transparent)]" />
      <Box aria-hidden="true" className="grain absolute inset-0 opacity-[0.06] mix-blend-screen" />

      <Stack gap="2" className="relative animate-fade-up">
        <Text variant="eyebrow" tone="inherit" className="text-white/60">
          Why {STORE.name}
        </Text>
        <Heading as="h2" size="display" tone="inherit">
          The neighbourhood market,{" "}
          <Text as="em" variant="accent">
            delivered
          </Text>
          .
        </Heading>
      </Stack>

      <Grid gap="3" className="relative min-h-0 flex-1 grid-cols-[1.25fr_1fr_1fr] grid-rows-2">
        {TILES.map((tile, index) => {
          const aisle = aisles.find((item) => tile.pattern.test(item.name));
          return (
            <Card
              key={tile.name}
              render={<Link href={aisle ? shopUrl({ category: aisle.id }) : shopUrl()} transitionTypes={["nav-forward"]} />}
              className={cn(
                "group/tile relative isolate min-h-0 animate-fade-up justify-end gap-0 overflow-hidden rounded-[1.75rem] border-0 p-0 text-white shadow-none ring-1 ring-white/10 transition-[translate,box-shadow] duration-500 ease-out-expo outline-none hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgb(0_0_0/0.6)] hover:ring-fresh/50 focus-visible:ring-3 focus-visible:ring-fresh",
                tile.className,
              )}
              style={{ animationDelay: `${120 + index * 80}ms` }}
            >
              <Image
                src={tile.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 0px"
                priority={index < 2}
                className="-z-20 object-cover transition-[scale] duration-1000 ease-out-expo group-hover/tile:scale-110"
              />
              <Box
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-linear-to-t from-[#06100b]/85 via-[#06100b]/15 to-transparent transition-opacity duration-500 group-hover/tile:opacity-90"
              />

              <Flex align="end" justify="between" gap="3" className="p-4 xl:p-5">
                <Stack gap="0.5" className="min-w-0">
                  <Text as="span" tone="inherit" weight="semibold" className="font-display text-lg leading-tight tracking-[-0.02em] xl:text-xl">
                    {tile.name}
                  </Text>
                  <Text
                    as="span"
                    tone="inherit"
                    className="max-h-0 truncate text-fs-12 text-white/75 opacity-0 transition-all duration-500 ease-out-expo group-hover/tile:max-h-5 group-hover/tile:opacity-100 group-focus-visible/tile:max-h-5 group-focus-visible/tile:opacity-100"
                  >
                    {tile.note}
                  </Text>
                </Stack>
                <Flex
                  as="span"
                  align="center"
                  justify="center"
                  aria-hidden="true"
                  className="size-9 shrink-0 rounded-full bg-white/15 text-white backdrop-blur transition-[rotate,background-color,color] duration-500 ease-spring group-hover/tile:rotate-45 group-hover/tile:bg-fresh group-hover/tile:text-[#06100b]"
                >
                  <ArrowUpRight className="size-4" />
                </Flex>
              </Flex>
            </Card>
          );
        })}
      </Grid>

      <Flex as="ul" wrap gap="2" className="relative">
        {PERKS.map((perk) => (
          <Flex
            as="li"
            key={perk}
            align="center"
            gap="1.5"
            className="rounded-full border border-white/15 bg-white/[0.06] py-1.5 pr-3.5 pl-2 text-fs-13 font-semibold"
          >
            <Flex as="span" align="center" justify="center" aria-hidden="true" className="size-5 rounded-full bg-fresh text-[#06100b]">
              <Check className="size-3" strokeWidth={3} />
            </Flex>
            {perk}
          </Flex>
        ))}
      </Flex>
    </Stack>
  );
}

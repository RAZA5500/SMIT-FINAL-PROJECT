"use client";

import { ArrowUpRight, LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading, Text } from "@/components/ui/typography";
import { aisleNumber } from "@/components/shared/AisleTag";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { categoryTheme, TONE_CLASSES } from "@/lib/merchandising";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useAisles } from "../shop/use-aisles";

/** Editorial photos jo aisle ke naam se milti hain — na milein to tinted icon tile */
const EDITORIAL: { pattern: RegExp; image: string }[] = [
  { pattern: /veg|produce|salad|green/i, image: "/images/editorial/produce-market.webp" },
  { pattern: /fruit|citrus|orchard/i, image: "/images/editorial/fruit-crates.webp" },
  { pattern: /bak|bread|pastr|loaf/i, image: "/images/editorial/artisan-bread.webp" },
  { pattern: /chees/i, image: "/images/editorial/cheese-board.webp" },
  { pattern: /dairy|milk|egg/i, image: "/images/editorial/milk-bottle.webp" },
  { pattern: /poultry|chicken/i, image: "/images/editorial/chicken-packs.webp" },
  { pattern: /meat|beef|butcher|steak/i, image: "/images/editorial/butcher-mince.webp" },
];

const BENTO_LIMIT = 7;
/** Pehla tile bara (2×2), baqi chhote — bento rhythm */
const SPANS = ["sm:col-span-2 sm:row-span-2", "", "", "sm:col-span-2", "", "", ""];

/** Home "aisles" bento — asli categories, hover par photo zoom aur sticker tilt */
export function HomeAisles() {
  const { aisles, isLoading } = useAisles();
  const tiles = aisles.slice(0, BENTO_LIMIT);

  return (
    <Stack as="section" aria-labelledby="aisles-heading" gap="6">
      <SectionHeading
        id="aisles-heading"
        eyebrow="Walk the aisles"
        title="Explore Market Stalls"
        description="Every aisle in the market — tap one to see what's on the shelves today."
        href={shopUrl()}
        hrefLabel="All aisles"
      />

      {/* Fixed row height se bento ke tiles barabar rehte hain (span 2 = do rows) */}
      <Grid className="auto-rows-[11rem] grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {isLoading &&
          Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className={cn("rounded-3xl", SPANS[index])} />
          ))}

        {tiles.map((aisle, index) => {
          const visual = categoryTheme(aisle.name);
          const Icon = visual.icon;
          const photo = EDITORIAL.find((item) => item.pattern.test(aisle.name))?.image;
          const big = index === 0;
          return (
            <Card
              key={aisle.id}
              render={<Link href={shopUrl({ category: aisle.id })} />}
              className={cn(
                "group/aisle pop-hover relative isolate justify-end gap-1 rounded-3xl border-2 p-4 shadow-none sm:p-5",
                photo ? "text-night-foreground" : cn("text-ink", TONE_CLASSES[visual.tone].tile),
                SPANS[index],
              )}
            >
              {photo ? (
                <>
                  <Image
                    src={photo}
                    alt=""
                    fill
                    sizes={big ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 640px) 25vw, 50vw"}
                    className="-z-20 object-cover transition-transform duration-700 group-hover/aisle:scale-110"
                  />
                  <Box aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-night/90 via-night/40 to-transparent" />
                </>
              ) : (
                <Icon
                  aria-hidden="true"
                  strokeWidth={1.4}
                  className={cn(
                    "absolute -top-4 -right-4 -z-10 size-32 opacity-40 transition-transform duration-500 group-hover/aisle:-rotate-12",
                    TONE_CLASSES[visual.tone].icon,
                  )}
                />
              )}

              <Flex
                as="span"
                align="center"
                justify="center"
                className="absolute top-4 right-4 size-9 rounded-full border-2 border-pop bg-lime text-lime-foreground transition-transform group-hover/aisle:rotate-45"
              >
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Flex>

              <Text as="span" variant="eyebrow" tone="inherit" family="mono" className="opacity-80">
                Aisle {aisleNumber(index)}
              </Text>
              <Heading as="h3" size={big ? "2" : "4"} tone="inherit" className="leading-tight">
                {aisle.name}
              </Heading>
              {big && aisle.children.length > 0 && (
                <Text tone="inherit" className="line-clamp-1 opacity-80">
                  {aisle.children.map((child) => child.name).join(" · ")}
                </Text>
              )}
            </Card>
          );
        })}

        {!isLoading && (
          <Card
            render={<Link href={shopUrl()} />}
            className="group/aisle pop-hover justify-between rounded-3xl border-2 border-dashed bg-card p-4 shadow-none sm:p-5"
          >
            <LayoutGrid aria-hidden="true" className="size-8 text-primary transition-transform group-hover/aisle:rotate-90" />
            <Heading as="h3" size="4">
              Browse everything
            </Heading>
          </Card>
        )}
      </Grid>
    </Stack>
  );
}

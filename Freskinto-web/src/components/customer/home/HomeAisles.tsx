"use client";

import Image from "next/image";
import Link from "next/link";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading, Text } from "@/components/ui/typography";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { categoryTheme, TILE_CLASSES } from "@/lib/merchandising";
import { shopUrl } from "@/lib/routes/routes";
import { cn, pluralize } from "@/lib/utils";
import { useAisles } from "../shop/use-aisles";

/** Editorial photos jo aisle ke naam se milti hain — na milein to grey icon tile */
const EDITORIAL: { pattern: RegExp; image: string }[] = [
  { pattern: /veg|produce|salad|green/i, image: "/images/editorial/produce-aisle.webp" },
  { pattern: /fruit|citrus|orchard/i, image: "/images/editorial/fruit-crates.webp" },
  { pattern: /bak|bread|pastr|loaf/i, image: "/images/editorial/artisan-bread.webp" },
  { pattern: /chees/i, image: "/images/editorial/cheese-board.webp" },
  { pattern: /dairy|milk|egg/i, image: "/images/editorial/milk-bottle.webp" },
  { pattern: /poultry|chicken/i, image: "/images/editorial/chicken-packs.webp" },
  { pattern: /meat|beef|butcher|steak/i, image: "/images/editorial/butcher-mince.webp" },
];

const AISLE_LIMIT = 6;

/** "Shop by aisle" — asli categories ki saada grid: photo (ya icon), naam, sub-aisles */
export function HomeAisles() {
  const { aisles, isLoading } = useAisles();

  return (
    <Stack as="section" id="aisles" aria-labelledby="aisles-heading" gap="6" className="scroll-mt-header">
      <SectionHeading id="aisles-heading" title="Shop by aisle" href={shopUrl()} hrefLabel="All products" />

      <Grid gap="3" className="grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        {isLoading && Array.from({ length: AISLE_LIMIT }, (_, index) => <Skeleton key={index} className="aspect-4/5 rounded-xl" />)}

        {aisles.slice(0, AISLE_LIMIT).map((aisle) => {
          const Icon = categoryTheme(aisle.name).icon;
          const photo = EDITORIAL.find((item) => item.pattern.test(aisle.name))?.image;
          return (
            <Card
              key={aisle.id}
              render={<Link href={shopUrl({ category: aisle.id })} />}
              className="group/aisle gap-0 p-2 transition-[border-color,box-shadow] duration-200 hover:border-foreground/15 hover:shadow-soft"
            >
              <Flex
                align="center"
                justify="center"
                className={cn("relative aspect-square overflow-hidden rounded-lg", TILE_CLASSES.tile)}
              >
                {photo ? (
                  <Image
                    src={photo}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 200px, (min-width: 768px) 30vw, 45vw"
                    className="object-cover transition-transform duration-300 group-hover/aisle:scale-105"
                  />
                ) : (
                  <Icon aria-hidden="true" strokeWidth={1.4} className={cn("size-1/3", TILE_CLASSES.icon)} />
                )}
              </Flex>
              <Box className="px-1 pt-3 pb-1">
                <Heading as="h3" size="5" className="truncate font-medium">
                  {aisle.name}
                </Heading>
                <Text tone="muted" className="text-fs-12">
                  {aisle.children.length > 0 ? pluralize(aisle.children.length, "sub-aisle") : "Shop now"}
                </Text>
              </Box>
            </Card>
          );
        })}
      </Grid>
    </Stack>
  );
}

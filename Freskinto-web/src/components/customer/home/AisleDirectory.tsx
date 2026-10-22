"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
import { aisleNumber } from "@/components/shared/AisleTag";
import { ErrorState } from "@/components/shared/ErrorState";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { categoryTheme, packshotUrl } from "@/lib/merchandising";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import type { CategoryNode } from "../shop/category-tree";
import { useAisles } from "../shop/use-aisles";

const SUB_AISLES_SHOWN = 3;

/** Directory line — sub-aisles ke naam (product count nahi: us mein hidden products bhi hote hain) */
function caption(aisle: CategoryNode): string {
  if (aisle.children.length === 0) return "Shop the aisle";
  const names = aisle.children.slice(0, SUB_AISLES_SHOWN).map((child) => child.name);
  const more = aisle.children.length - SUB_AISLES_SHOWN;
  return more > 0 ? `${names.join(" · ")} +${more}` : names.join(" · ");
}

/** "Find your aisle" — supermarket ka directory board: numbered aisles, har ek ka packshot */
export function AisleDirectory() {
  const { aisles, isLoading, isError, error, refetch } = useAisles();

  // Categories hi nahi (naya store) — section chhupao, khali dabba nahi
  if (!isLoading && !isError && aisles.length === 0) return null;

  return (
    <Container as="section" aria-labelledby="aisles-heading">
      <Stack gap="6">
        <SectionHeading
          id="aisles-heading"
          eyebrow="Store directory"
          title="Find your aisle"
          description="Everything for the week, neatly signposted."
          href={shopUrl()}
          hrefLabel="All products"
        />

        {isError ? (
          <ErrorState title="Couldn't load the aisles" message={error.message} onRetry={() => void refetch()} />
        ) : (
          <Card className={cn("gap-0 py-0")}>
            <Grid as="ul" className={cn("gap-px bg-border sm:grid-cols-2 lg:grid-cols-3")}>
              {isLoading
                ? Array.from({ length: 6 }, (_, i) => (
                    <Box as="li" key={i} className={cn("bg-card p-4")}>
                      <Skeleton className={cn("h-16 w-full rounded-xl")} />
                    </Box>
                  ))
                : aisles.map((aisle, index) => {
                    const theme = categoryTheme(aisle.name);
                    const Icon = theme.icon;
                    return (
                      <Box as="li" key={aisle.id} className={cn("bg-card")}>
                        <Item
                          render={<Link href={shopUrl({ category: aisle.id })} />}
                          className={cn("group/aisle h-full gap-4 rounded-none border-0 p-4 sm:p-5")}
                        >
                          <ItemMedia>
                            <Text as="span" weight="bold" className={cn("text-2xl font-bold leading-none tracking-tight text-brand-green/80")}>
                              {aisleNumber(index)}
                            </Text>
                          </ItemMedia>
                          <ItemContent className={cn("min-w-0")}>
                            <ItemTitle className={cn("font-heading text-lg font-semibold")}>{aisle.name}</ItemTitle>
                            <ItemDescription className={cn("line-clamp-1")}>{caption(aisle)}</ItemDescription>
                          </ItemContent>
                          <ItemActions className={cn("gap-3")}>
                            <Flex
                              align="center"
                              justify="center"
                              className={cn("relative size-14 shrink-0 overflow-hidden rounded-xl bg-icon-green text-brand-green")}
                            >
                              {theme.image ? (
                                <Image
                                  src={packshotUrl(theme.image)}
                                  alt=""
                                  fill
                                  sizes="56px"
                                  className={cn("blend-packshot object-contain p-1.5 transition-transform duration-300 group-hover/aisle:scale-110")}
                                />
                              ) : (
                                <Icon aria-hidden="true" className={cn("size-6")} />
                              )}
                            </Flex>
                            <ArrowUpRight
                              aria-hidden="true"
                              className={cn("size-4 text-muted-foreground transition-transform group-hover/aisle:rotate-45 group-hover/aisle:text-brand-green")}
                            />
                          </ItemActions>
                        </Item>
                      </Box>
                    );
                  })}
            </Grid>
          </Card>
        )}
      </Stack>
    </Container>
  );
}

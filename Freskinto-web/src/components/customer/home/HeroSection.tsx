import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import {
  Receipt,
  ReceiptBarcode,
  ReceiptFooter,
  ReceiptLines,
  ReceiptMeta,
  ReceiptRow,
  ReceiptSeparator,
} from "@/components/ui/receipt";
import { Heading, Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { packshotUrl } from "@/lib/merchandising";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

const POPULAR_SEARCHES = ["Bananas", "Chicken", "Milk", "Bread", "Spinach"];

/** "Today's crate" — demo packshots (illustration, not live stock) */
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
    <Container as="section" aria-labelledby="hero-heading" className={cn("pt-8 sm:pt-12")}>
      <Grid align="center" gap="10" className={cn("lg:grid-cols-12 lg:gap-12")}>
        <Stack gap="6" className={cn("animate-fade-up lg:col-span-6")}>
          <Badge variant="tag" className={cn("text-foreground")}>
            <Box as="span" aria-hidden="true" className={cn("size-1.5 animate-pulse rounded-full bg-primary")} />
            Open today · Free delivery on every order
          </Badge>
          <Heading id="hero-heading" size="display" className={cn("serif-soft")}>
            The neighbourhood market,{" "}
            <Text as="em" family="serif" tone="brand" className={cn("italic")}>
              delivered.
            </Text>
          </Heading>
          <Text variant="lead" className={cn("max-w-lg")}>
            Fruit &amp; veg, poultry, dairy and everyday essentials — free delivery on every order, or click &amp;
            collect at a time that suits you.
          </Text>
          <Flex wrap gap="3">
            <ButtonLink href={shopUrl()} size="xl">
              Start shopping
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#how-it-works" size="xl" variant="outline">
              How it works
            </ButtonLink>
          </Flex>
          <Flex wrap align="center" gap="2">
            <Text as="span" variant="code" tone="muted" className={cn("uppercase")}>
              Popular:
            </Text>
            {POPULAR_SEARCHES.map((term) => (
              <Badge key={term} variant="outline" render={<Link href={shopUrl({ q: term })} />} className={cn("h-7 px-3")}>
                {term}
              </Badge>
            ))}
          </Flex>
        </Stack>

        <Box className={cn("relative lg:col-span-6")}>
          <HeroCrate />
        </Box>
      </Grid>
    </Container>
  );
}

function HeroCrate() {
  return (
    <Box aria-hidden="true" className={cn("relative pb-10 sm:pb-0")}>
      <Card className={cn("gap-3 bg-muted p-3 ring-0 sm:p-4")}>
        <Flex align="center" justify="between" className={cn("px-1")}>
          <Text as="span" variant="eyebrow">
            Today&apos;s crate
          </Text>
          <Text as="span" variant="code" tone="muted">
            No. 042
          </Text>
        </Flex>
        <Grid cols="3" gap="2" className={cn("sm:gap-3")}>
          {CRATE.map((item, index) => (
            <Card key={item.image} size="sm" className={cn("gap-1 p-2 shadow-xs", index % 2 === 1 && "sm:translate-y-3")}>
              <AspectRatio ratio={1} className={cn("bg-background")}>
                <Image
                  src={packshotUrl(item.image)}
                  alt=""
                  fill
                  loading="eager"
                  sizes="(min-width: 1024px) 180px, 30vw"
                  className={cn("object-contain p-1.5")}
                />
              </AspectRatio>
              <Text as="span" variant="code" tone="muted" className={cn("truncate text-center uppercase")}>
                {item.label}
              </Text>
            </Card>
          ))}
        </Grid>
      </Card>

      <Receipt className={cn("absolute -bottom-2 -left-2 w-56 -rotate-3 sm:-bottom-10 sm:-left-8 sm:w-64")}>
        <Stack gap="1" className={cn("text-center")}>
          <Text as="span" family="serif" weight="semibold" className={cn("text-base")}>
            Sample basket
          </Text>
          <ReceiptMeta>4 items</ReceiptMeta>
        </Stack>
        <ReceiptSeparator />
        <ReceiptLines className={cn("gap-1.5 text-xs")}>
          <ReceiptRow label="Gala apples ×4" value="£2.40" />
          <ReceiptRow label="Whole milk 1L" value="£1.15" />
          <ReceiptRow label="Wholemeal loaf" value="£1.40" />
          <ReceiptRow label="Delivery" value="Free" />
        </ReceiptLines>
        <ReceiptFooter>
          <ReceiptBarcode className={cn("h-6 w-32")} />
        </ReceiptFooter>
      </Receipt>
    </Box>
  );
}

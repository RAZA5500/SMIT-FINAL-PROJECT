"use client";

import { ArrowRight, CalendarClock, Check, Store, Truck, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { STORE } from "@/constants/store";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

/** Do asli raste (FLOW-MD 01 §14): DELIVERY (shipping 0) aur PICKUP (customer ka waqt) */
const OPTIONS: {
  value: "delivery" | "pickup";
  label: string;
  icon: LucideIcon;
  image: string;
  points: { title: string; text: string }[];
}[] = [
  {
    value: "delivery",
    label: "Home delivery",
    icon: Truck,
    image: "/images/editorial/fruit-crates.webp",
    points: [
      { title: "Free on every order", text: "No minimum spend and no surprise fees at the till." },
      { title: "Saved addresses", text: "Keep home and work on file — your default is pre-selected." },
      { title: "Track every step", text: "From confirmed to on its way to delivered." },
    ],
  },
  {
    value: "pickup",
    label: "Click & collect",
    icon: Store,
    image: "/images/editorial/produce-aisle.webp",
    points: [
      { title: "You pick the time", text: "Choose a collection slot at checkout — today or tomorrow." },
      { title: "Packed and waiting", text: "We tell you the moment your order is ready." },
      { title: "Still free", text: "Collection costs nothing extra, just like delivery." },
    ],
  },
];

/** "Two ways to get your shop" — shadcn Tabs, har tab ki apni tasveer */
export function FulfilmentTabs() {
  return (
    <Container as="section" aria-labelledby="fulfilment-heading">
      <Tabs defaultValue="delivery" className={cn("gap-8")}>
        <Grid align="center" gap="10" className={cn("lg:grid-cols-2")}>
          <Stack gap="6">
            <SectionHeading
              id="fulfilment-heading"
              eyebrow="Two ways to shop"
              title="Delivered to your door, or ready when you are."
            />
            <TabsList className={cn("h-11 rounded-full p-1")}>
              {OPTIONS.map(({ value, label, icon: Icon }) => (
                <TabsTrigger key={value} value={value} className={cn("rounded-full px-4")}>
                  <Icon data-icon="inline-start" aria-hidden="true" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            {OPTIONS.map(({ value, points }) => (
              <TabsContent key={value} value={value}>
                <Stack gap="5">
                  <ItemGroup className={cn("gap-1")}>
                    {points.map((point) => (
                      <Item key={point.title} className={cn("px-0")}>
                        <ItemMedia className={cn("size-8 rounded-full bg-primary text-primary-foreground [&_svg]:size-4")}>
                          <Check aria-hidden="true" strokeWidth={3} />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle className={cn("font-semibold")}>{point.title}</ItemTitle>
                          <ItemDescription>{point.text}</ItemDescription>
                        </ItemContent>
                      </Item>
                    ))}
                  </ItemGroup>
                  <ButtonLink href={shopUrl()} className={cn("w-fit")}>
                    Fill your basket
                    <ArrowRight data-icon="inline-end" aria-hidden="true" />
                  </ButtonLink>
                </Stack>
              </TabsContent>
            ))}
          </Stack>

          <Box className={cn("relative")}>
            {OPTIONS.map(({ value, image, label }) => (
              <TabsContent key={value} value={value}>
                <AspectRatio ratio={4 / 3} className={cn("overflow-hidden rounded-3xl bg-muted")}>
                  <Image src={image} alt={label} fill sizes="(min-width: 1024px) 50vw, 100vw" className={cn("object-cover")} />
                </AspectRatio>
              </TabsContent>
            ))}
            <Card size="sm" className={cn("absolute -bottom-5 left-4 w-60 gap-1.5 shadow-lift sm:left-6")}>
              <Flex align="center" gap="2" className={cn("px-4")}>
                <CalendarClock aria-hidden="true" className={cn("size-4 text-brand")} />
                <Text as="span" weight="semibold">
                  Pay within {STORE.paymentWindowMinutes} minutes
                </Text>
              </Flex>
              <Text variant="small" tone="muted" className={cn("px-4")}>
                Your order is confirmed the moment you pay.
              </Text>
              <Box className={cn("px-4")}>
                <Badge variant="tag">Then we start packing</Badge>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Tabs>
    </Container>
  );
}

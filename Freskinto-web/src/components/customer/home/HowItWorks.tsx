import { CreditCard, PackageCheck, ShoppingBasket } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/typography";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { STORE } from "@/constants/store";
import { cn } from "@/lib/utils";

/** Asli flow: basket → delivery/pickup + pay (5 min window) → status timeline */
const STEPS = [
  {
    icon: ShoppingBasket,
    title: "Fill your basket",
    text: "Browse the aisles or search for what you need. Your basket is saved to your account.",
  },
  {
    icon: CreditCard,
    title: "Choose delivery or collection",
    text: `Delivery is free, or pick a collection time. Pay within ${STORE.paymentWindowMinutes} minutes to confirm.`,
  },
  {
    icon: PackageCheck,
    title: "Track it to your door",
    text: "Follow every step from confirmed to delivered — and cancel any time before we start packing.",
  },
];

export function HowItWorks() {
  return (
    <Container as="section" id="how-it-works" aria-labelledby="how-heading" className={cn("scroll-mt-28")}>
      <Stack gap="8">
        <SectionHeading id="how-heading" eyebrow="How it works" title="Fresh food in three easy steps" />
        <Grid as="ol" gap="4" className={cn("md:grid-cols-3")}>
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <Box as="li" key={title} className={cn("relative")}>
              <Card className={cn("h-full")}>
                <CardHeader>
                  <Flex align="center" justify="between">
                    <Flex
                      align="center"
                      justify="center"
                      className={cn("size-12 rounded-2xl bg-brand-green text-white shadow-xs [&_svg]:size-6")}
                    >
                      <Icon aria-hidden="true" />
                    </Flex>
                    <Text as="span" weight="bold" className={cn("text-3xl font-bold tracking-tight text-brand-green/30")}>
                      0{index + 1}
                    </Text>
                  </Flex>
                </CardHeader>
                <CardContent className={cn("flex flex-col gap-2")}>
                  <CardTitle className={cn("text-xl")}>{title}</CardTitle>
                  <CardDescription className={cn("leading-relaxed")}>{text}</CardDescription>
                </CardContent>
              </Card>
              {index < STEPS.length - 1 && (
                <Box
                  aria-hidden="true"
                  className={cn("absolute top-1/2 -right-4 hidden w-4 border-t-2 border-dashed border-input md:block")}
                />
              )}
            </Box>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}

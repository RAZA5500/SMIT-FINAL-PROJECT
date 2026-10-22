import { ArrowLeft, PackageCheck, Store, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Heading, Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { STORE } from "@/constants/store";
import { packshotUrl } from "@/lib/merchandising";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

/** Store ke asli features — panel par marketing claims nahi */
const PERKS = [
  { icon: Truck, text: "Free delivery on every order" },
  { icon: Store, text: "Click & collect at a time you choose" },
  { icon: PackageCheck, text: "Track every order from basket to door" },
];

/** Panel par tairti packshots — sirf dikhawa */
const FLOATERS = [
  { image: "royal-gala-apples", className: "top-10 right-10 size-36 rotate-6 animate-float" },
  { image: "fresh-bell-peppers", className: "top-48 right-48 size-28 -rotate-12 animate-float-slow" },
  { image: "whole-wheat-bread-loaf", className: "top-16 left-12 size-28 -rotate-6 animate-float-slow" },
];

/** Module load par ek dafa — render ke dauran current date nahi padhte */
const YEAR = new Date().getFullYear();

/** /login aur /register ka split-screen frame: form left, night aubergine panel right (lg+) */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <Grid className="min-h-dvh flex-1 lg:grid-cols-2">
      <Stack as="main" id="content" className="px-5 py-6 sm:px-10">
        <Flex align="center" justify="between" gap="4">
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href={publicRoutes.home} aria-label={`${STORE.name} home`} />}
            className="h-auto rounded-xl px-1 py-1 hover:bg-transparent"
          >
            <Logo size="md" />
          </Button>
          <Flex align="center" gap="1">
            <ThemeToggle />
            <ButtonLink href={publicRoutes.shop} variant="ghost" size="sm" className="rounded-full">
              <ArrowLeft aria-hidden="true" />
              Back to shop
            </ButtonLink>
          </Flex>
        </Flex>

        <Stack justify="center" gap="8" className="mx-auto w-full max-w-form flex-1 py-12">
          {children}
        </Stack>

        <Text tone="muted" className="text-fs-12">
          © {YEAR} {STORE.name} · Demo store — no real payments are taken.
        </Text>
      </Stack>

      <Box
        as="aside"
        aria-label={`Why shop with ${STORE.name}`}
        className="relative isolate m-3 hidden flex-col justify-end gap-8 overflow-hidden rounded-3xl bg-night p-12 text-night-foreground lg:flex xl:p-16"
      >
        <Box aria-hidden="true" className="texture-dots absolute inset-0 -z-20 text-night-foreground/5" />
        <Box aria-hidden="true" className="absolute -top-20 -right-20 -z-10 size-96 rounded-full bg-primary/50 blur-3xl" />
        <Box aria-hidden="true" className="absolute -bottom-24 -left-16 -z-10 size-72 rounded-full bg-tangerine/30 blur-3xl" />
        {FLOATERS.map((item) => (
          <Box
            key={item.image}
            aria-hidden="true"
            className={cn("absolute -z-10 overflow-hidden rounded-3xl border-2 border-night-border bg-tile-lilac shadow-lift", item.className)}
          >
            <Image src={packshotUrl(item.image)} alt="" fill sizes="144px" className="blend-packshot object-contain p-3" />
          </Box>
        ))}

        <Stack gap="4" className="max-w-lg">
          <Badge variant="sticker" className="w-fit">
            The neighbourhood market
          </Badge>
          <Heading as="h2" size="hero" tone="night" className="xl:text-fs-56">
            Fresh from the stalls, <Text as="span" tone="inherit" className="marker">straight to you.</Text>
          </Heading>
        </Stack>

        <ItemGroup className="gap-2 rounded-2xl border border-night-border bg-night-foreground/5 p-3 backdrop-blur-md">
          {PERKS.map(({ icon: Icon, text }) => (
            <Item key={text} role="listitem" size="sm" className="border-0">
              <ItemMedia className="size-10 rounded-xl bg-lime text-lime-foreground">
                <Icon aria-hidden="true" className="size-5" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="font-semibold text-night-foreground">{text}</ItemTitle>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </Box>
    </Grid>
  );
}

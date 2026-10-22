import { ArrowLeft, PackageCheck, Store, Truck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Heading, Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { STORE } from "@/constants/store";
import { publicRoutes } from "@/lib/routes/routes";

/** Store ke asli features — panel par marketing claims nahi */
const PERKS = [
  { icon: Truck, title: "Free delivery", text: "On every order, no minimum spend." },
  { icon: Store, title: "Click & collect", text: "Pick a slot that suits you." },
  { icon: PackageCheck, title: "Live order tracking", text: "From basket to your door." },
];

/** Module load par ek dafa — render ke dauran current date nahi padhte */
const YEAR = new Date().getFullYear();

/** /login aur /register ka frame: form left, quiet grey panel with store perks right (lg+) */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <Grid className="min-h-dvh flex-1 lg:grid-cols-2">
      <Stack as="main" id="content" className="px-5 py-5 sm:px-10">
        <Flex align="center" justify="between" gap="4">
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href={publicRoutes.home} aria-label={`${STORE.name} home`} />}
            className="h-auto px-1 py-1 hover:bg-transparent"
          >
            <Logo size="md" />
          </Button>
          <Flex align="center" gap="1">
            <ThemeToggle />
            <ButtonLink href={publicRoutes.shop} variant="ghost" size="sm">
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
        className="hidden flex-col justify-center border-l bg-workspace p-12 lg:flex xl:p-20"
      >
        <Stack gap="8" className="max-w-md">
          <Stack gap="3">
            <Heading as="h2" size="1">
              {STORE.tagline}
            </Heading>
            <Text tone="muted" className="text-base">
              Fresh produce, dairy and everyday essentials from your local market.
            </Text>
          </Stack>

          <ItemGroup className="gap-3">
            {PERKS.map(({ icon: Icon, title, text }) => (
              <Item key={title} role="listitem" variant="outline" className="bg-background">
                <ItemMedia variant="icon" className="size-9 rounded-md bg-muted">
                  <Icon aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{title}</ItemTitle>
                  <ItemDescription>{text}</ItemDescription>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </Stack>
      </Box>
    </Grid>
  );
}

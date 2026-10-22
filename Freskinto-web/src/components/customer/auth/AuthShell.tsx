import { ArrowLeft, Check, PackageCheck, Store, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Heading, Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { TextLink } from "@/components/shared/TextLink";
import { STORE } from "@/constants/store";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

/** Store ke asli features — panel par marketing claims nahi */
const PERKS = [
  { icon: Truck, text: "Free delivery on every order" },
  { icon: Store, text: "Click & collect at a time you choose" },
  { icon: PackageCheck, text: "Track every order from basket to door" },
];

const LIST = [
  { item: "Gala apples", done: true },
  { item: "Whole milk, 1 litre", done: true },
  { item: "Wholemeal loaf", done: true },
  { item: "Chicken thighs", done: false },
  { item: "Spinach", done: false },
];

const YEAR = new Date().getFullYear();

interface AuthShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** /login, /register, /forgot-password ka frame — form left, shopping-list panel right */
export function AuthShell({ eyebrow, title, subtitle, children }: AuthShellProps) {
  return (
    <Grid className={cn("min-h-dvh flex-1 lg:grid-cols-2")}>
      <Stack as="main" id="content" className={cn("px-5 py-6 sm:px-10")}>
        <Flex align="center" justify="between" gap="4">
          <TextLink href={publicRoutes.home} aria-label={`${STORE.name} home`}>
            <Logo size="sm" />
          </TextLink>
          <ButtonLink href={publicRoutes.shop} variant="ghost" size="sm">
            <ArrowLeft data-icon="inline-start" aria-hidden="true" />
            Back to shop
          </ButtonLink>
        </Flex>
        <Container size="form" className={cn("flex flex-1 flex-col justify-center gap-8 px-0 py-12 sm:px-0 lg:px-0")}>
          <Stack gap="3">
            <Text variant="eyebrow">{eyebrow}</Text>
            <Heading size="1" className={cn("serif-soft")}>
              {title}
            </Heading>
            <Text tone="muted" className={cn("sm:text-base")}>
              {subtitle}
            </Text>
          </Stack>
          {children}
        </Container>
        <Text variant="small" tone="muted">
          © {YEAR} {STORE.name} · Demo store — no real payments are taken.
        </Text>
      </Stack>

      <Flex
        as="aside"
        direction="col"
        justify="center"
        gap="10"
        aria-label={`Why shop with ${STORE.name}`}
        className={cn("relative isolate hidden overflow-hidden bg-muted p-12 lg:flex xl:p-16")}
      >
        <Box aria-hidden="true" className={cn("texture-dots absolute inset-0 -z-10 text-foreground/5")} />
        <Card className={cn("texture-ruled w-full max-w-sm rotate-2 gap-2 bg-paper shadow-lift")}>
          <CardHeader>
            <Text as="span" family="serif" className={cn("serif-soft text-3xl italic")}>
              Today&apos;s list
            </Text>
          </CardHeader>
          <CardContent>
            <Stack as="ul" aria-label="Sample shopping list">
              {LIST.map(({ item, done }) => (
                <Flex as="li" key={item} align="center" gap="3" className={cn("h-11")}>
                  <Flex
                    as="span"
                    align="center"
                    justify="center"
                    aria-hidden="true"
                    className={cn(
                      "size-5 rounded-md border",
                      done ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background",
                    )}
                  >
                    {done && <Check strokeWidth={3} className={cn("size-3.5")} />}
                  </Flex>
                  <Text
                    as="span"
                    family="serif"
                    className={cn("text-lg", done && "text-muted-foreground line-through decoration-primary")}
                  >
                    {item}
                  </Text>
                </Flex>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Stack gap="5" className={cn("max-w-md")}>
          <Heading as="p" size="2" className={cn("serif-soft")}>
            Your neighbourhood market,{" "}
            <Text as="em" family="serif" tone="brand" className={cn("italic")}>
              one tap away.
            </Text>
          </Heading>
          <ItemGroup className={cn("gap-1")}>
            {PERKS.map(({ icon: Icon, text }) => (
              <Item key={text} size="sm" className={cn("px-0")}>
                <ItemMedia className={cn("size-9 rounded-xl border bg-background text-brand [&_svg]:size-4")}>
                  <Icon aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className={cn("font-medium text-foreground/80")}>{text}</ItemTitle>
                </ItemContent>
              </Item>
            ))}
          </ItemGroup>
        </Stack>
      </Flex>
    </Grid>
  );
}

import { ArrowLeft, PackageCheck, Store, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
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
            <Heading size="1" className={cn("font-bold tracking-tight text-foreground font-serif")}>
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
        gap="8"
        aria-label={`Why shop with ${STORE.name}`}
        className={cn("relative isolate hidden overflow-hidden bg-hero-gradient p-12 text-white lg:flex xl:p-16")}
      >
        <div className="bg-dots absolute inset-0 -z-10 text-white/5" aria-hidden="true" />
        <Card className={cn("w-full max-w-md gap-5 rounded-3xl border-white/15 bg-white/10 p-8 text-white shadow-lift backdrop-blur-md")}>
          <Heading as="h3" size="3" className={cn("font-bold text-white text-2xl font-serif")}>
            Your fresh market, one tap away.
          </Heading>
          <Text className={cn("text-sm text-emerald-100/90 leading-relaxed")}>
            Join thousands of happy customers who get fresh, high quality groceries delivered straight to their doorstep every week.
          </Text>

          <Stack as="ul" gap="4" className={cn("pt-2")}>
            {PERKS.map(({ icon: Icon, text }) => (
              <Flex as="li" key={text} align="center" gap="3">
                <Flex
                  as="span"
                  align="center"
                  justify="center"
                  className={cn("size-10 shrink-0 rounded-xl bg-brand-green-vivid/20 text-brand-green-vivid ring-1 ring-brand-green-vivid/30")}
                >
                  <Icon className="size-5" />
                </Flex>
                <Text as="span" weight="medium" className={cn("text-sm font-medium text-white/95")}>
                  {text}
                </Text>
              </Flex>
            ))}
          </Stack>
        </Card>
      </Flex>
    </Grid>
  );
}

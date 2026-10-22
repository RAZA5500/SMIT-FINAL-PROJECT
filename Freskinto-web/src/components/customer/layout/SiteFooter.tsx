"use client";

import { Clock, FlaskConical, Mail, RotateCcw, Store, Truck } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Container } from "@/components/ui/container";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/typography";
import { Logo } from "@/components/shared/Logo";
import { TextLink } from "@/components/shared/TextLink";
import { STORE } from "@/constants/store";
import { customerRoutes, publicRoutes, shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useAisles } from "../shop/use-aisles";
import { isCheckoutPath } from "./checkout-path";

const YEAR = new Date().getFullYear();

/** Store ke asli rules (FLOW-MD 01): free shipping, pickup slot, 5 min payment window, cancel before packing */
const PROMISES = [
  { icon: Truck, title: "Free delivery", text: "On every order, no minimum spend." },
  { icon: Store, title: "Click & collect", text: "Pick a collection time at checkout." },
  { icon: Clock, title: "Quick to confirm", text: `Pay within ${STORE.paymentWindowMinutes} minutes to lock it in.` },
  { icon: RotateCcw, title: "Changed your mind?", text: "Cancel any time before we start packing." },
];

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack gap="4">
      <Text as="div" variant="eyebrow" className={cn("text-foreground")}>
        {title}
      </Text>
      <Stack as="ul" gap="2.5">
        {children}
      </Stack>
    </Stack>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Box as="li">
      <TextLink href={href} tone="muted" className={cn("font-normal")}>
        {children}
      </TextLink>
    </Box>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const { aisles } = useAisles();

  if (isCheckoutPath(pathname)) {
    return (
      <Box as="footer" className={cn("border-t bg-background py-6")}>
        <Container>
          <Text variant="small" tone="muted" className={cn("text-center")}>
            © {YEAR} {STORE.name} · Need help?{" "}
            <TextLink href={`mailto:${STORE.supportEmail}`}>{STORE.supportEmail}</TextLink>
          </Text>
        </Container>
      </Box>
    );
  }

  const isCustomer = Boolean(token) && user?.role === "CUSTOMER";

  return (
    <Box as="footer" className={cn("mt-auto border-t bg-muted")}>
      <Container>
        <Grid as="ul" gap="2" className={cn("py-8 sm:grid-cols-2 lg:grid-cols-4")}>
          {PROMISES.map(({ icon: Icon, title, text }) => (
            <Box as="li" key={title}>
              <Item className={cn("px-0")}>
                <ItemMedia className={cn("size-11 rounded-xl border bg-background text-brand [&_svg]:size-5")}>
                  <Icon aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className={cn("font-semibold")}>{title}</ItemTitle>
                  <ItemDescription>{text}</ItemDescription>
                </ItemContent>
              </Item>
            </Box>
          ))}
        </Grid>

        <Separator />

        <Grid gap="10" className={cn("py-12 md:grid-cols-12")}>
          <Stack gap="4" className={cn("md:col-span-5")}>
            <TextLink href={publicRoutes.home} aria-label={`${STORE.name} home`} className={cn("w-fit")}>
              <Logo />
            </TextLink>
            <Text tone="muted" className={cn("max-w-sm")}>
              Your neighbourhood market, online. Fresh produce, poultry, dairy and everyday essentials — delivered
              free or ready to collect.
            </Text>
            <TextLink href={`mailto:${STORE.supportEmail}`} className={cn("inline-flex w-fit items-center gap-2")}>
              <Mail aria-hidden="true" className={cn("size-4")} />
              {STORE.supportEmail}
            </TextLink>
          </Stack>

          <Grid as="nav" aria-label="Footer" gap="8" className={cn("grid-cols-2 md:col-span-7 md:grid-cols-3")}>
            <FooterColumn title="Shop">
              <FooterLink href={shopUrl()}>All products</FooterLink>
              {aisles.slice(0, 5).map((aisle) => (
                <FooterLink key={aisle.id} href={shopUrl({ category: aisle.id })}>
                  {aisle.name}
                </FooterLink>
              ))}
            </FooterColumn>
            <FooterColumn title="Account">
              {isCustomer ? (
                <>
                  <FooterLink href={customerRoutes.orders}>My orders</FooterLink>
                  <FooterLink href={customerRoutes.addresses}>Addresses</FooterLink>
                  <FooterLink href={customerRoutes.cart}>Basket</FooterLink>
                </>
              ) : (
                <>
                  <FooterLink href={publicRoutes.login}>Sign in</FooterLink>
                  <FooterLink href={publicRoutes.register}>Create an account</FooterLink>
                </>
              )}
            </FooterColumn>
            <FooterColumn title="Help">
              <FooterLink href={`${publicRoutes.home}#how-it-works`}>How it works</FooterLink>
              <FooterLink href={`mailto:${STORE.supportEmail}`}>Contact us</FooterLink>
            </FooterColumn>
          </Grid>
        </Grid>

        <Text
          as="div"
          aria-hidden="true"
          family="serif"
          weight="semibold"
          className={cn(
            "serif-soft overflow-hidden pb-2 text-center text-7xl leading-none tracking-tighter text-foreground/5 select-none sm:text-9xl",
          )}
        >
          {STORE.name}
        </Text>

        <Separator />

        <Flex
          direction="col"
          gap="2"
          className={cn("py-5 pb-24 sm:flex-row sm:items-center sm:justify-between md:pb-5")}
        >
          <Text variant="small" tone="muted">
            © {YEAR} {STORE.name}. Prices in GBP.
          </Text>
          <Text variant="small" tone="muted" className={cn("flex items-center gap-1.5")}>
            <FlaskConical aria-hidden="true" className={cn("size-3.5 shrink-0")} />
            Demo store — checkout uses a test payment gateway; no real cards are charged.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
}

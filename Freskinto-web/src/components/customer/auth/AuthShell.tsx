import { ArrowLeft, Leaf, PackageCheck, ShieldCheck, Star, Store, Truck, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Aurora } from "@/components/ui/aurora";
import { Grid } from "@/components/ui/grid";
import { Heading, Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { STORE } from "@/constants/store";
import { publicRoutes } from "@/lib/routes/routes";

/** Store ke asli wade — glass chips mein saaf dikhte hain */
const PERKS = [
  { icon: Truck, title: "Free delivery", text: "On every order, no minimum spend." },
  { icon: Store, title: "Click & collect", text: "Pick a slot that suits you." },
  { icon: PackageCheck, title: "Live order tracking", text: "From basket to your door." },
];

/** Module load par ek dafa — render ke dauran current date nahi padhte */
const YEAR = new Date().getFullYear();

/**
 * Editorial Static Mart Showcase
 * Note: Rolling 3D animations have been removed from the auth portal to keep
 * sign-in/up calm, distraction-free, and hyper-focused.
 */
function AuthVisualShowcase() {
  return (
    <Box className="relative my-auto flex w-full flex-col items-center justify-center py-2">
      {/* Soft ambient backlights (static) */}
      <Box aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <Box className="size-72 rounded-full bg-fresh/15 blur-3xl" />
        <Box className="-mt-10 -ml-24 size-60 rounded-full bg-sky-500/15 blur-2xl" />
      </Box>

      {/* Layered Packshot Arrangement — static, crisp & mouth-watering cutouts */}
      <Box className="relative h-64 w-full max-w-md">
        {/* Left product: Butter Croissant */}
        <Box className="absolute top-10 left-3 z-10 w-32 drop-shadow-2xl transition-transform duration-500 hover:-translate-y-1">
          <Image
            src="/images/cutouts/butter-croissants.webp"
            alt="Artisanal Bakery"
            width={140}
            height={140}
            className="size-auto object-contain"
            priority
          />
        </Box>

        {/* Center hero product: Fresh Bell Peppers */}
        <Box className="absolute top-0 left-1/2 z-20 w-44 -translate-x-1/2 drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:-translate-y-1">
          <Image
            src="/images/cutouts/fresh-bell-peppers.webp"
            alt="Farm Fresh Produce"
            width={180}
            height={180}
            className="size-auto object-contain"
            priority
          />
        </Box>

        {/* Right product: Farm Whole Milk */}
        <Box className="absolute top-8 right-3 z-10 w-28 drop-shadow-2xl transition-transform duration-500 hover:-translate-y-1">
          <Image
            src="/images/cutouts/fresh-whole-milk-1l.webp"
            alt="Organic Dairy"
            width={130}
            height={130}
            className="size-auto object-contain"
            priority
          />
        </Box>

        {/* Live Delivery Status Badge */}
        <Box className="glass absolute -bottom-3 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-2xl border border-white/20 bg-background/60 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
          <Flex align="center" gap="2.5">
            <Box as="span" className="relative flex size-2.5">
              <Box as="span" className="absolute inline-flex size-full animate-ping-soft rounded-full bg-fresh" />
              <Box as="span" className="relative inline-flex size-2.5 rounded-full bg-fresh" />
            </Box>
            <Stack gap="0">
              <Text as="span" weight="bold" className="text-fs-12 text-white">
                25–35 Min Express Delivery
              </Text>
              <Text as="span" className="text-[11px] text-white/70">
                Freshly hand-picked from the market
              </Text>
            </Stack>
          </Flex>
        </Box>
      </Box>

      {/* Customer Trust Quote */}
      <Box className="mt-8 w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
        <Flex align="center" gap="1" className="mb-1.5 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="size-3.5 fill-current" />
          ))}
          <Text as="span" className="ml-1.5 text-fs-12 font-semibold text-white">4.9 / 5</Text>
          <Text as="span" className="ml-auto text-[11px] text-white/50">Verified Order</Text>
        </Flex>
        <Text className="text-fs-13 leading-snug text-white/90">
          &ldquo;Freskinto changed how our family shops. The vegetables are always super crisp and arrive within 30 minutes!&rdquo;
        </Text>
        <Text className="mt-2 text-[11px] font-medium text-white/60">
          Sarah M. · 40+ orders completed
        </Text>
      </Box>
    </Box>
  );
}

/**
 * /login aur /register ka frame:
 * Left: Elevated frosted glass auth card with reassurance trust pills
 * Right (lg+): Static dark editorial showcase with real cutouts (no dizzying orbits)
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <Grid className="relative isolate min-h-dvh flex-1 lg:grid-cols-[1fr_1.05fr]">
      <Aurora />
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
            <ButtonLink href={publicRoutes.shop} transitionTypes={["nav-back"]} variant="ghost" size="sm">
              <ArrowLeft aria-hidden="true" />
              Back to shop
            </ButtonLink>
          </Flex>
        </Flex>

        {/* Elevated Centered Auth Container */}
        <Flex align="center" justify="center" className="flex-1 py-6 sm:py-10">
          <Box className="w-full max-w-form animate-fade-up">
            <Box className="glass rounded-[2rem] border border-glass-border p-6 shadow-lift sm:p-9">
              {children}
            </Box>

            {/* Security & Reassurance pills below card */}
            <Flex wrap align="center" justify="center" gap="3" className="mt-6 text-fs-12 text-muted-foreground">
              <Flex align="center" gap="1.5">
                <ShieldCheck aria-hidden="true" className="size-4 text-brand" />
                <Text as="span">256-bit SSL encrypted</Text>
              </Flex>
              <Text as="span" className="opacity-40">•</Text>
              <Flex align="center" gap="1.5">
                <Zap aria-hidden="true" className="size-4 text-brand" />
                <Text as="span">Instant access</Text>
              </Flex>
              <Text as="span" className="opacity-40">•</Text>
              <Flex align="center" gap="1.5">
                <Leaf aria-hidden="true" className="size-4 text-brand" />
                <Text as="span">100% fresh guarantee</Text>
              </Flex>
            </Flex>
          </Box>
        </Flex>

        <Text tone="muted" className="text-center text-fs-12 sm:text-left">
          © {YEAR} {STORE.name} · Demo store — no real payments are taken.
        </Text>
      </Stack>

      <Stack
        as="aside"
        aria-label={`Why shop with ${STORE.name}`}
        justify="between"
        gap="6"
        className="dark sticky top-3 m-3 hidden h-[calc(100dvh-1.5rem)] overflow-hidden rounded-[2.5rem] bg-background p-10 text-foreground lg:flex xl:p-14"
      >
        <Box aria-hidden="true" className="absolute -top-1/4 -right-1/4 size-[70%] animate-drift rounded-full bg-[radial-gradient(closest-side,rgb(34_211_138/0.28),transparent)]" />
        <Box aria-hidden="true" className="absolute -bottom-1/4 -left-1/4 size-[70%] animate-drift-slow rounded-full bg-[radial-gradient(closest-side,rgb(42_168_242/0.22),transparent)]" />
        <Box aria-hidden="true" className="grain absolute inset-0 opacity-[0.08] mix-blend-screen" />

        <Stack gap="3" className="relative max-w-xl animate-fade-up">
          <Text variant="eyebrow" tone="muted">
            Why {STORE.name}
          </Text>
          <Heading as="h2" size="display">
            The neighbourhood market,{" "}
            <Text as="em" variant="accent">
              delivered
            </Text>
            .
          </Heading>
        </Stack>

        {/* Center Editorial Showcase — No spinning / rolling animations */}
        <AuthVisualShowcase />

        <Flex as="ul" wrap gap="2" className="relative">
          {PERKS.map(({ icon: Icon, title, text }, index) => (
            <Flex
              as="li"
              key={title}
              align="center"
              gap="2.5"
              title={text}
              className="glass animate-fade-up rounded-full border border-glass-border py-2 pr-4 pl-2"
              style={{ animationDelay: `${300 + index * 90}ms` }}
            >
              <Flex as="span" align="center" justify="center" aria-hidden="true" className="size-8 rounded-full bg-fresh text-[#06100b]">
                <Icon className="size-4" />
              </Flex>
              <Stack as="span" gap="0">
                <Text as="span" weight="bold" className="text-fs-13">
                  {title}
                </Text>
                <Text as="span" tone="muted" className="text-fs-12">
                  {text}
                </Text>
              </Stack>
            </Flex>
          ))}
        </Flex>
      </Stack>
    </Grid>
  );
}

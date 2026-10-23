import { ArrowRight, UserPlus } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import { Reveal } from "@/components/ui/reveal";
import { Heading, Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { productVisual } from "@/lib/merchandising";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

/** Panel mein tairti asli products (decorative) */
const FLOATERS = [
  { name: "Royal Gala Apples", className: "left-[4%] top-[12%] size-24 sm:size-32 [animation-delay:-1s]" },
  { name: "Fresh Bell Peppers", className: "right-[6%] top-[8%] size-24 sm:size-36 [animation-delay:-4s]" },
  { name: "Mature Cheddar Cheese", className: "left-[10%] bottom-[8%] size-20 sm:size-28 [animation-delay:-6s]" },
  { name: "Premium Bananas", className: "right-[10%] bottom-[6%] size-24 sm:size-32 [animation-delay:-2s]" },
];

/** Aakhri dawat — dark aurora panel, tairte products, bari headline aur do raaste */
export function HomeCta() {
  return (
    <Reveal variant="scale">
      <Box className="relative isolate overflow-hidden rounded-[2.5rem] bg-[#0b1611] px-6 py-20 text-white sm:py-28 dark:border dark:border-white/[0.06]">
        <Box aria-hidden="true" className="absolute -top-32 left-1/4 -z-20 size-[36rem] animate-drift rounded-full bg-[radial-gradient(closest-side,rgb(34_211_138/0.35),transparent)]" />
        <Box aria-hidden="true" className="absolute -right-24 -bottom-40 -z-20 size-[32rem] animate-drift-slow rounded-full bg-[radial-gradient(closest-side,rgb(42_168_242/0.3),transparent)]" />
        <Box aria-hidden="true" className="grain absolute inset-0 -z-20 opacity-[0.06] mix-blend-screen" />
        {FLOATERS.map(({ name, className }) => {
          const visual = productVisual(name);
          return (
            visual.image && (
              <Box
                key={name}
                aria-hidden="true"
                style={{ "--aura": visual.aura } as CSSProperties}
                className={cn("absolute -z-10 hidden animate-float opacity-90 md:block", className)}
              >
                <Box className="aura absolute -inset-1/4 rounded-full opacity-70" />
                <Image src={visual.image} alt="" fill sizes="144px" className="product-float object-contain" />
              </Box>
            )
          );
        })}

        <Stack align="center" gap="7" className="mx-auto max-w-2xl text-center">
          <Heading as="h2" size="display" tone="inherit">
            Your basket is{" "}
            <Text as="em" variant="accent">
              waiting
            </Text>
            .
          </Heading>
          <Text tone="inherit" className="max-w-md text-lg text-white/70">
            Fill it with the good stuff — we&apos;ll bring it to your door for free, or have it ready to collect.
          </Text>
          <Flex wrap justify="center" gap="3">
            <ButtonLink href={publicRoutes.shop} variant="fresh" size="xl">
              Start shopping
              <ArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover/button:translate-x-1" />
            </ButtonLink>
            <ButtonLink
              href={publicRoutes.register}
              variant="outline"
              size="xl"
              className="border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
            >
              <UserPlus aria-hidden="true" />
              Create an account
            </ButtonLink>
          </Flex>
        </Stack>
      </Box>
    </Reveal>
  );
}

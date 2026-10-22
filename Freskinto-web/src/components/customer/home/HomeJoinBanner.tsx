import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Heading } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { packshotUrl } from "@/lib/merchandising";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

/** Account ke asli faide — koi naqli voucher nahi */
const BENEFITS = ["Your basket follows you on every device", "Track every order from shelf to door", "Save addresses for one-tap checkout"];

const STICKERS = [
  { image: "premium-bananas", className: "top-2 left-6 size-32 -rotate-12 animate-float" },
  { image: "fresh-whole-milk-1l", className: "top-20 right-4 size-36 rotate-6 animate-float-slow" },
  { image: "mature-cheddar-cheese", className: "bottom-0 left-24 size-28 rotate-3 animate-float" },
];

/** Tangerine "join the market" banner — register / sign in */
export function HomeJoinBanner() {
  return (
    <Box
      as="section"
      aria-labelledby="join-heading"
      className="relative isolate overflow-hidden rounded-4xl border-2 border-pop bg-tangerine text-ink shadow-pop"
    >
      <Box aria-hidden="true" className="texture-dots absolute inset-0 -z-10 text-ink/10" />
      <Grid align="center" gap="8" className="p-6 sm:p-10 lg:grid-cols-12 lg:p-14">
        <Stack gap="5" className="lg:col-span-7">
          <Badge variant="night" className="w-fit">
            Free account
          </Badge>
          <Heading id="join-heading" size="display" tone="inherit">
            Join the neighbourhood market.
          </Heading>
          <Stack as="ul" gap="2">
            {BENEFITS.map((benefit) => (
              <Flex as="li" key={benefit} align="center" gap="2" className="font-semibold">
                <Flex align="center" justify="center" className="size-6 rounded-full bg-ink text-lime">
                  <Check aria-hidden="true" className="size-3.5" />
                </Flex>
                {benefit}
              </Flex>
            ))}
          </Stack>
          <Flex wrap gap="3" className="pt-1">
            <ButtonLink href={publicRoutes.register} variant="night" size="xl" className="dark:bg-night dark:text-night-foreground dark:hover:bg-night/90">
              Create an account
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              href={publicRoutes.login}
              variant="outline"
              size="xl"
              className="rounded-full border-2 border-ink bg-transparent text-ink hover:bg-ink/10"
            >
              I already have one
            </ButtonLink>
          </Flex>
        </Stack>
        <Box aria-hidden="true" className="relative hidden h-72 lg:col-span-5 lg:block">
          {STICKERS.map((sticker) => (
            <Box
              key={sticker.image}
              className={cn("absolute overflow-hidden rounded-3xl border-2 border-ink bg-tile-peach shadow-pop-sm", sticker.className)}
            >
              <Image src={packshotUrl(sticker.image)} alt="" fill sizes="144px" className="blend-packshot object-contain p-3" />
            </Box>
          ))}
        </Box>
      </Grid>
    </Box>
  );
}

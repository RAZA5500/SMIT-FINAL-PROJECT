import type { Metadata } from "next";
import Image from "next/image";
import { Aurora } from "@/components/ui/aurora";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import { Heading, Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { packshotUrl } from "@/lib/merchandising";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Page not found" };

/** "404" ke gird bhatakte products — position + float delay */
const STRAYS = [
  { image: "royal-gala-apples", className: "-top-[18%] -left-[14%] size-24 sm:size-36 [animation-delay:-1s]" },
  { image: "premium-bananas", className: "-top-[24%] -right-[12%] size-24 sm:size-36 [animation-delay:-3s]" },
  { image: "mature-cheddar-cheese", className: "-bottom-[20%] left-[30%] size-20 sm:size-28 [animation-delay:-5s]" },
];

/** 404 — chamakti gradient "404", us ke gird bhatakte products, "Sold out!" sticker, wapas jaane ke do raaste */
export default function NotFound() {
  return (
    <Stack as="main" id="content" align="center" justify="center" gap="10" className="relative isolate min-h-dvh flex-1 px-6 py-16 text-center">
      <Aurora />
      <Logo size="md" />
      <Box aria-hidden="true" className="relative animate-pop-in">
        <Text
          as="span"
          tone="inherit"
          className="block animate-shimmer font-display text-[7.5rem] leading-none font-bold tracking-[-0.07em] text-fresh sm:text-[14rem]"
        >
          404
        </Text>
        {STRAYS.map(({ image, className }) => (
          <Box key={image} className={cn("absolute animate-float", className)}>
            <Image src={packshotUrl(image)} alt="" fill sizes="144px" className="product-float object-contain" />
          </Box>
        ))}
        <Badge variant="fresh" className="absolute top-[8%] -right-2 h-7 rotate-12 px-3 text-fs-13 shadow-glow">
          Sold out!
        </Badge>
      </Box>
      <Stack align="center" gap="3" className="animate-fade-up [animation-delay:150ms]">
        <Heading as="h1" size="display">
          Page not{" "}
          <Text as="em" variant="accent">
            found
          </Text>
        </Heading>
        <Text tone="muted" className="max-w-md text-base">
          This aisle doesn&apos;t exist — the page may have moved. Everything else is right where you left it.
        </Text>
      </Stack>
      <Flex wrap justify="center" gap="3" className="animate-fade-up [animation-delay:250ms]">
        <ButtonLink href={publicRoutes.shop} variant="fresh" size="xl">
          Back to the shop
        </ButtonLink>
        <ButtonLink href={customerRoutes.orders} variant="outline" size="xl">
          My orders
        </ButtonLink>
      </Flex>
    </Stack>
  );
}

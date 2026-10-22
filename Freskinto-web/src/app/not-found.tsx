import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import { Heading, Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";

export const metadata: Metadata = { title: "Page not found" };

/** 404 — giant tilted "404" sticker, ek line, aur wapas jaane ke do raaste */
export default function NotFound() {
  return (
    <Stack as="main" id="content" align="center" justify="center" gap="8" className="min-h-dvh flex-1 px-6 py-16 text-center">
      <Logo size="md" />
      <Stack align="center" gap="4">
        <Box aria-hidden="true" className="relative">
          <Text
            as="span"
            weight="semibold"
            tone="inherit"
            className="block text-6xl tracking-tighter text-primary sm:text-[10rem] sm:leading-none"
          >
            404
          </Text>
          <Badge variant="brand" className="absolute -top-2 -right-6">
            Sold out!
          </Badge>
        </Box>
        <Heading as="h1" size="1">
          Page not found
        </Heading>
        <Text tone="muted" className="max-w-md text-base">
          The page you&apos;re looking for has moved or doesn&apos;t exist.
        </Text>
      </Stack>
      <Flex wrap justify="center" gap="3">
        <ButtonLink href={publicRoutes.shop} size="xl">
          Back to the shop
        </ButtonLink>
        <ButtonLink href={customerRoutes.orders} variant="outline" size="xl" className="border">
          My orders
        </ButtonLink>
      </Flex>
    </Stack>
  );
}

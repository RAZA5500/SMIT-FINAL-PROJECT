import { ArrowRight, House } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Flex, Stack } from "@/components/ui/flex";
import { Heading, Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { TextLink } from "@/components/shared/TextLink";
import { STORE } from "@/constants/store";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <Stack
      as="main"
      id="content"
      align="center"
      justify="center"
      gap="8"
      className={cn("min-h-dvh flex-1 px-6 py-16 text-center")}
    >
      <TextLink href={publicRoutes.home} aria-label={`${STORE.name} home`}>
        <Logo />
      </TextLink>
      <Stack align="center" gap="4">
        <Badge variant="brand">Aisle 404</Badge>
        <Text
          as="div"
          aria-hidden="true"
          className={cn("font-heading font-black text-8xl leading-none text-brand-green sm:text-9xl")}
        >
          404
        </Text>
        <Heading size="1">This aisle doesn&apos;t exist</Heading>
        <Text tone="muted" className={cn("max-w-md sm:text-base")}>
          The page you&apos;re looking for has moved or never existed. Let&apos;s get you back to the fresh stuff.
        </Text>
      </Stack>
      <Flex wrap justify="center" gap="3">
        <ButtonLink href={shopUrl()} size="lg" variant="brand">
          Browse the shop
          <ArrowRight data-icon="inline-end" aria-hidden="true" />
        </ButtonLink>
        <ButtonLink href={publicRoutes.home} size="lg" variant="outline">
          <House data-icon="inline-start" aria-hidden="true" />
          Home
        </ButtonLink>
      </Flex>
    </Stack>
  );
}

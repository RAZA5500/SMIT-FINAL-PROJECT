import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import { Heading, Text } from "@/components/ui/typography";

interface AuthHeadingProps {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
}

/** Auth form ke upar live status pill + headline + friendly subtitle */
export function AuthHeading({ eyebrow, title, subtitle }: AuthHeadingProps) {
  return (
    <Stack gap="2" className="mb-5">
      <Flex align="center" gap="2">
        <Box as="span" className="relative flex size-2">
          <Box as="span" className="absolute inline-flex size-full animate-ping-soft rounded-full bg-fresh" />
          <Box as="span" className="relative inline-flex size-2 rounded-full bg-fresh" />
        </Box>
        <Text variant="eyebrow" tone="muted" className="text-fs-12 font-semibold tracking-wider uppercase">
          {eyebrow}
        </Text>
      </Flex>
      <Heading size="1" className="text-[1.625rem] sm:text-[1.875rem]">
        {title}
      </Heading>
      <Text tone="muted" className="text-fs-14 leading-relaxed sm:text-fs-15">
        {subtitle}
      </Text>
    </Stack>
  );
}

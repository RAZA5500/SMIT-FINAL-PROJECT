import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import { Heading, Text } from "@/components/ui/typography";

interface AuthHeadingProps {
  /** Optional — login/register par Sign in ↔ Create account switch hi kaafi hai */
  eyebrow?: string;
  title: ReactNode;
  subtitle: string;
}

/** Auth form ke upar live status pill + headline + friendly subtitle */
export function AuthHeading({ eyebrow, title, subtitle }: AuthHeadingProps) {
  return (
    <Stack gap="2" className="mb-3.5">
      {eyebrow && (
        <Flex align="center" gap="2">
          <Box as="span" className="relative flex size-2">
            <Box as="span" className="absolute inline-flex size-full animate-ping-soft rounded-full bg-fresh" />
            <Box as="span" className="relative inline-flex size-2 rounded-full bg-fresh" />
          </Box>
          <Text variant="eyebrow" tone="muted" className="text-fs-12 font-semibold tracking-wider uppercase">
            {eyebrow}
          </Text>
        </Flex>
      )}
      <Heading size="1" className="text-[1.625rem] sm:text-[1.875rem]">
        {title}
      </Heading>
      {/* Kam height wali screens par subtitle chhupa — form bina scroll ke ek screen mein aaye */}
      <Text tone="muted" className="text-fs-14 leading-relaxed sm:text-fs-15 [@media(max-height:860px)]:hidden">
        {subtitle}
      </Text>
    </Stack>
  );
}

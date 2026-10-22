import type { ReactNode } from "react";
import { Stack } from "@/components/ui/flex";
import { Heading, Text } from "@/components/ui/typography";

interface AuthHeadingProps {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
}

/** Auth form ke upar kicker + headline + ek line — page.tsx sirf compose karta hai */
export function AuthHeading({ eyebrow, title, subtitle }: AuthHeadingProps) {
  return (
    <Stack gap="2">
      <Text variant="eyebrow" tone="muted">
        {eyebrow}
      </Text>
      <Heading size="1">{title}</Heading>
      <Text tone="muted" className="sm:text-base">
        {subtitle}
      </Text>
    </Stack>
  );
}

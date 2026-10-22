import type { ReactNode } from "react";
import { Stack } from "@/components/ui/flex";
import { Heading, Text } from "@/components/ui/typography";

interface AuthHeadingProps {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
}

/** Auth form ke upar kicker + display headline + ek line — page.tsx sirf compose karta hai */
export function AuthHeading({ eyebrow, title, subtitle }: AuthHeadingProps) {
  return (
    <Stack gap="3">
      <Text variant="eyebrow" tone="primary">
        {eyebrow}
      </Text>
      <Heading size="display">{title}</Heading>
      <Text tone="muted" className="sm:text-base">
        {subtitle}
      </Text>
    </Stack>
  );
}

import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Flex, Stack } from "@/components/ui/flex";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { ButtonLink } from "./ButtonLink";

interface SectionHeadingProps {
  id?: string;
  title: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  /** "View all" link */
  href?: string;
  hrefLabel?: string;
  /** Extra controls (e.g. carousel arrows) */
  actions?: ReactNode;
  className?: string;
}

/** Home / rails section ka sar — eyebrow, serif title, "View all" */
export function SectionHeading({
  id,
  title,
  eyebrow,
  description,
  href,
  hrefLabel = "View all",
  actions,
  className,
}: SectionHeadingProps) {
  return (
    <Flex align="end" justify="between" gap="4" className={cn(className)}>
      <Stack gap="2" className={cn("min-w-0")}>
        {eyebrow && (
          <Text as="div" variant="eyebrow">
            {eyebrow}
          </Text>
        )}
        <Heading id={id} size="2">
          {title}
        </Heading>
        {description && (
          <Text tone="muted" className={cn("sm:text-base")}>
            {description}
          </Text>
        )}
      </Stack>
      <Flex align="center" gap="2" className={cn("shrink-0")}>
        {href && (
          <ButtonLink href={href} variant="ghost" size="sm" className={cn("text-brand hover:text-brand-strong")}>
            {hrefLabel}
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </ButtonLink>
        )}
        {actions}
      </Flex>
    </Flex>
  );
}

import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
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
  /** Extra controls */
  actions?: ReactNode;
  className?: string;
}

/** Section ka sar — gradient dot wala eyebrow, bari display title, ek line, pill "View all" */
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
    <Flex wrap align="end" justify="between" gap="5" className={cn(className)}>
      <Stack gap="3" className="min-w-0">
        {eyebrow && (
          <Flex align="center" gap="2">
            <Box as="span" aria-hidden="true" className="size-1.5 rounded-full bg-fresh" />
            <Text as="span" variant="eyebrow" tone="muted">
              {eyebrow}
            </Text>
          </Flex>
        )}
        <Heading id={id} as="h2" size="1">
          {title}
        </Heading>
        {description && (
          <Text tone="muted" className="max-w-xl text-base">
            {description}
          </Text>
        )}
      </Stack>
      {(href || actions) && (
        <Flex align="center" gap="2" className="shrink-0">
          {actions}
          {href && (
            <ButtonLink href={href} variant="outline">
              {hrefLabel}
              <ArrowRight aria-hidden="true" className="transition-transform duration-300 group-hover/button:translate-x-1" />
            </ButtonLink>
          )}
        </Flex>
      )}
    </Flex>
  );
}

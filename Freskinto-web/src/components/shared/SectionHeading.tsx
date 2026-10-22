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
  /** Extra controls */
  actions?: ReactNode;
  className?: string;
}

/** Section ka sar — optional muted eyebrow, title, one-line description, quiet "View all" link */
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
    <Flex wrap align="end" justify="between" gap="4" className={cn(className)}>
      <Stack gap="1.5" className="min-w-0">
        {eyebrow && (
          <Text as="div" variant="eyebrow" tone="muted">
            {eyebrow}
          </Text>
        )}
        <Heading id={id} size="2">
          {title}
        </Heading>
        {description && (
          <Text tone="muted" className="max-w-2xl">
            {description}
          </Text>
        )}
      </Stack>
      {(href || actions) && (
        <Flex align="center" gap="2" className="shrink-0">
          {actions}
          {href && (
            <ButtonLink href={href} variant="ghost" size="sm" className="group/more -mr-3">
              {hrefLabel}
              <ArrowRight aria-hidden="true" className="transition-transform group-hover/more:translate-x-0.5" />
            </ButtonLink>
          )}
        </Flex>
      )}
    </Flex>
  );
}

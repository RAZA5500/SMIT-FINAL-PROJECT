import { ArrowUpRight } from "lucide-react";
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
  /** Night (dark) blocks par roshan text */
  inverse?: boolean;
  className?: string;
}

/** Section ka sar — eyebrow, chunky display title, "View all" */
export function SectionHeading({
  id,
  title,
  eyebrow,
  description,
  href,
  hrefLabel = "View all",
  actions,
  inverse = false,
  className,
}: SectionHeadingProps) {
  return (
    <Flex wrap align="end" justify="between" gap="4" className={cn(className)}>
      <Stack gap="2" className="min-w-0">
        {eyebrow && (
          <Text as="div" variant="eyebrow" tone={inverse ? "inherit" : "primary"} className={cn(inverse && "text-lime")}>
            {eyebrow}
          </Text>
        )}
        <Heading id={id} size="1" tone={inverse ? "night" : "default"}>
          {title}
        </Heading>
        {description && (
          <Text tone={inverse ? "night-muted" : "muted"} className="max-w-2xl sm:text-base">
            {description}
          </Text>
        )}
      </Stack>
      {(href || actions) && (
        <Flex align="center" gap="2" className="shrink-0">
          {actions}
          {href && (
            <ButtonLink href={href} variant={inverse ? "glass" : "outline"} className="group/more rounded-full">
              {hrefLabel}
              <ArrowUpRight
                aria-hidden="true"
                className="transition-transform group-hover/more:translate-x-0.5 group-hover/more:-translate-y-0.5"
              />
            </ButtonLink>
          )}
        </Flex>
      )}
    </Flex>
  );
}

import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Title ke upar chhota kicker (e.g. "My account") */
  eyebrow?: ReactNode;
  /** Title ke neeche badges ki line (status, payment) */
  meta?: ReactNode;
  actions?: ReactNode;
  /** Breadcrumbs ya back link — sab se upar */
  breadcrumbs?: ReactNode;
  /** `page`: storefront title · `compact`: admin workspace */
  size?: "page" | "compact";
  className?: string;
}

/** Har page ka sar: breadcrumbs → kicker (gradient dot) → bari title → description, actions right */
export function PageHeader({
  title,
  description,
  eyebrow,
  meta,
  actions,
  breadcrumbs,
  size = "page",
  className,
}: PageHeaderProps) {
  const page = size === "page";
  return (
    <Stack gap="4" className={cn(className)}>
      {breadcrumbs}
      <Flex wrap align="end" justify="between" gap="4">
        <Stack gap={page ? "2.5" : "1.5"} className={cn("min-w-0", page && "animate-fade-up")}>
          {eyebrow && (
            <Flex align="center" gap="2">
              {page && <Box as="span" aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-fresh" />}
              <Text as="div" variant="eyebrow" tone="muted">
                {eyebrow}
              </Text>
            </Flex>
          )}
          <Heading as={page ? "h1" : "h2"} size={page ? "display" : "2"}>
            {title}
          </Heading>
          {description && (
            <Text as="div" tone="muted" className="max-w-2xl">
              {description}
            </Text>
          )}
          {meta && (
            <Flex wrap align="center" gap="2" className="pt-1">
              {meta}
            </Flex>
          )}
        </Stack>
        {actions && (
          <Box>
            <Flex wrap align="center" gap="2.5">
              {actions}
            </Flex>
          </Box>
        )}
      </Flex>
    </Stack>
  );
}

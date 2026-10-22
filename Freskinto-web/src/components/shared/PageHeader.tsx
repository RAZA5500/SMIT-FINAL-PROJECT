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
  /** `page`: storefront ka bada display title · `compact`: admin workspace */
  size?: "page" | "compact";
  className?: string;
}

/** Har page ka sar: breadcrumbs → kicker → title → description, actions right */
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
  return (
    <Stack gap="4" className={cn(className)}>
      {breadcrumbs}
      <Flex wrap align="end" justify="between" gap="4">
        <Stack gap="2" className="min-w-0">
          {eyebrow && (
            <Text as="div" variant="eyebrow" tone="primary">
              {eyebrow}
            </Text>
          )}
          <Heading size={size === "page" ? "display" : "2"} className={cn(size === "compact" && "sm:text-2xl")}>
            {title}
          </Heading>
          {description && (
            <Text as="div" tone="muted" className={cn("max-w-2xl", size === "page" ? "text-base" : "text-sm")}>
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

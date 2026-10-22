import type { ReactNode } from "react";
import { Flex, Stack } from "@/components/ui/flex";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Title ke upar chhota mono label (e.g. "My account") */
  eyebrow?: ReactNode;
  /** Title ke neeche badges ki line (status, payment) */
  meta?: ReactNode;
  actions?: ReactNode;
  /** Breadcrumbs ya back link — sab se upar */
  breadcrumbs?: ReactNode;
  size?: "1" | "2";
  className?: string;
}

/** Har page ka sar: breadcrumbs → eyebrow → serif title → description, actions right */
export function PageHeader({
  title,
  description,
  eyebrow,
  meta,
  actions,
  breadcrumbs,
  size = "1",
  className,
}: PageHeaderProps) {
  return (
    <Stack gap="4" className={cn(className)}>
      {breadcrumbs}
      <Flex wrap align="end" justify="between" gap="4">
        <Stack gap="2" className={cn("min-w-0")}>
          {eyebrow && (
            <Text as="div" variant="eyebrow">
              {eyebrow}
            </Text>
          )}
          <Heading size={size} as="h1">
            {title}
          </Heading>
          {description && (
            <Text as="div" tone="muted" className={cn("max-w-2xl sm:text-base")}>
              {description}
            </Text>
          )}
          {meta && (
            <Flex wrap align="center" gap="2" className={cn("pt-1")}>
              {meta}
            </Flex>
          )}
        </Stack>
        {actions && (
          <Flex wrap align="center" gap="2.5">
            {actions}
          </Flex>
        )}
      </Flex>
    </Stack>
  );
}

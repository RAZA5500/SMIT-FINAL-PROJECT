import { CircleX, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Flex, Stack } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { cn, formatDateTime } from "@/lib/utils";

export interface TimelineStep {
  key: string;
  label: string;
  icon: LucideIcon;
  /** Backend timestamp — null = abhi nahi hua */
  at: string | null;
}

interface OrderTimelineProps {
  steps: TimelineStep[];
  /** Cancel hua to sirf wohi steps jo ho chuke the, phir "Cancelled" */
  cancelledAt?: string | null;
  className?: string;
}

/** Vertical order tracking: har step ka timestamp, agla step "Up next" (pulsing tangerine) */
export function OrderTimeline({ steps, cancelledAt, className }: OrderTimelineProps) {
  const cancelled = Boolean(cancelledAt);
  const visible = cancelled ? steps.filter((step) => step.at) : steps;
  const nextIndex = visible.findIndex((step) => !step.at);

  return (
    <Stack as="ol" className={cn(className)}>
      {visible.map((step, index) => {
        const Icon = step.icon;
        const done = Boolean(step.at);
        const isNext = index === nextIndex && !cancelled;
        const last = index === visible.length - 1 && !cancelled;
        return (
          <Flex as="li" key={step.key} gap="4" className="relative pb-6 last:pb-0">
            {!last && (
              <Box
                as="span"
                aria-hidden="true"
                className={cn(
                  "absolute top-11 bottom-1 left-5 w-0.5 -translate-x-1/2 rounded-full",
                  done ? "bg-primary" : "bg-border",
                )}
              />
            )}
            <Flex
              as="span"
              align="center"
              justify="center"
              className={cn(
                "relative z-10 size-10 shrink-0 rounded-full [&_svg]:size-5",
                done && "bg-primary text-primary-foreground",
                isNext && "border-2 border-pop bg-tangerine text-tangerine-foreground shadow-pop-sm",
                !done && !isNext && "border border-border bg-card text-muted-foreground",
              )}
            >
              <Icon aria-hidden="true" />
            </Flex>
            <Stack gap="0.5" className="pt-1.5">
              <Flex wrap align="center" gap="2">
                <Text weight="semibold" tone={done || isNext ? "default" : "muted"}>
                  {step.label}
                </Text>
                {isNext && (
                  <Badge variant="lime" className="h-5 animate-pulse px-2 text-fs-11">
                    Up next
                  </Badge>
                )}
              </Flex>
              <Text tone="muted" numeric className="text-fs-13">
                {done ? formatDateTime(step.at) : "Pending"}
              </Text>
            </Stack>
          </Flex>
        );
      })}
      {cancelled && (
        <Flex as="li" gap="4" className="relative">
          <Flex
            as="span"
            align="center"
            justify="center"
            className="relative z-10 size-10 shrink-0 rounded-full bg-destructive text-white dark:text-background [&_svg]:size-5"
          >
            <CircleX aria-hidden="true" />
          </Flex>
          <Stack gap="0.5" className="pt-1.5">
            <Text weight="semibold" tone="destructive">
              Cancelled
            </Text>
            <Text tone="muted" numeric className="text-fs-13">
              {formatDateTime(cancelledAt)}
            </Text>
          </Stack>
        </Flex>
      )}
    </Stack>
  );
}

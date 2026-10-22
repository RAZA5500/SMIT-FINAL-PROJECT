import { CircleX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { IOrder } from "@/services/orders/types";
import { orderSteps } from "./order-steps";

/** Har status change ka timestamp backend rakhta hai (confirmedAt, processedAt, ...) */
export function OrderTimelineCard({ order }: { order: IOrder }) {
  const steps = orderSteps(order);
  const cancelled = Boolean(order.cancelledAt);
  // Cancel hua to sirf woh steps jo ho chuke the, phir "Cancelled"
  const visible = cancelled ? steps.filter((step) => step.at) : steps;
  const nextIndex = visible.findIndex((step) => !step.at);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack as="ol">
          {visible.map((step, index) => {
            const Icon = step.icon;
            const done = Boolean(step.at);
            const isNext = index === nextIndex;
            const last = index === visible.length - 1 && !cancelled;
            return (
              <Flex as="li" key={step.key} gap="4" className={cn("relative pb-6 last:pb-0")}>
                {!last && (
                  <Box
                    as="span"
                    aria-hidden="true"
                    className={cn(
                      "absolute top-10 bottom-0 left-5 w-px -translate-x-1/2 border-l-2",
                      done ? "border-primary" : "border-muted",
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
                    isNext && "border-2 border-primary bg-primary/10 text-brand-green",
                    !done && !isNext && "border border-border bg-background text-muted-foreground",
                  )}
                >
                  <Icon aria-hidden="true" />
                </Flex>
                <Stack gap="1" className={cn("pt-1.5")}>
                  <Flex align="center" gap="2" wrap>
                    <Text weight="semibold" tone={done || isNext ? "default" : "muted"}>
                      {step.label}
                    </Text>
                    {isNext && <Badge variant="tag">Up next</Badge>}
                  </Flex>
                  <Text variant="small" tone="muted" numeric>
                    {done ? formatDateTime(step.at) : "Pending"}
                  </Text>
                </Stack>
              </Flex>
            );
          })}
          {cancelled && (
            <Flex as="li" gap="4">
              <Flex
                as="span"
                align="center"
                justify="center"
                className={cn("relative z-10 size-10 shrink-0 rounded-full bg-destructive text-white [&_svg]:size-5")}
              >
                <CircleX aria-hidden="true" />
              </Flex>
              <Stack gap="1" className={cn("pt-1.5")}>
                <Text weight="semibold" tone="destructive">
                  Cancelled
                </Text>
                <Text variant="small" tone="muted" numeric>
                  {formatDateTime(order.cancelledAt)}
                </Text>
              </Stack>
            </Flex>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

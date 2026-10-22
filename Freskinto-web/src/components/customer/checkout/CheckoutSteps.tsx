import { Check } from "lucide-react";
import { Fragment } from "react";
import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const STEPS = ["Basket", "Delivery", "Payment", "Confirmed"] as const;

/** Checkout progress — `current` 0-based (Basket hamesha mukammal) */
export function CheckoutSteps({ current }: { current: 1 | 2 }) {
  return (
    <Flex as="ol" align="center" gap="2" aria-label="Checkout progress" className={cn("sm:gap-3")}>
      {STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <Fragment key={step}>
            {index > 0 && (
              <Box
                as="li"
                aria-hidden="true"
                className={cn("h-0.5 flex-1", done ? "bg-primary" : "bg-muted")}
              />
            )}
            <Flex as="li" align="center" gap="2" aria-current={active ? "step" : undefined} className={cn("shrink-0")}>
              <Flex
                as="span"
                align="center"
                justify="center"
                className={cn(
                  "size-8 rounded-full text-xs font-bold transition-colors",
                  done && "bg-primary text-primary-foreground",
                  active && "border-2 border-primary bg-primary/10 text-brand-green",
                  !done && !active && "border border-border bg-muted/50 text-muted-foreground",
                )}
              >
                {done ? <Check aria-hidden="true" strokeWidth={3} className={cn("size-4")} /> : index + 1}
              </Flex>
              <Text
                as="span"
                weight={active ? "semibold" : "medium"}
                tone={done || active ? "default" : "muted"}
                className={cn("hidden sm:inline")}
              >
                {step}
              </Text>
              <Text as="span" className={cn("sr-only")}>
                {done ? " (done)" : active ? " (current step)" : ""}
              </Text>
            </Flex>
          </Fragment>
        );
      })}
    </Flex>
  );
}

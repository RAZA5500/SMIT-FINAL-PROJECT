import { Check } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const STEPS = ["Basket", "Delivery details", "Payment"] as const;

/** Page-level progress: Basket → Delivery details → Payment (`current` 0-based); abhi wala step gradient mein */
export function CheckoutSteps({ current }: { current: 0 | 1 | 2 }) {
  return (
    <Box as="nav" aria-label="Checkout progress">
      <Flex as="ol" align="center" gap="2" className="sm:gap-3">
        {STEPS.map((label, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <Flex
              as="li"
              key={label}
              align="center"
              gap="2"
              className="sm:gap-3"
              aria-current={active ? "step" : undefined}
            >
              <Flex
                as="span"
                align="center"
                justify="center"
                className={cn(
                  "size-8 shrink-0 rounded-full text-fs-12 font-bold transition-colors",
                  done && "bg-primary text-primary-foreground",
                  active && "animate-pop-in bg-fresh text-[#06100b] shadow-glow",
                  !done && !active && "border border-border bg-card/70 text-muted-foreground",
                )}
              >
                {done ? <Check aria-hidden="true" className="size-4" /> : index + 1}
              </Flex>
              <Text
                as="span"
                weight={active ? "bold" : "medium"}
                tone={active ? "default" : "muted"}
                className={cn("text-fs-13", !active && "hidden sm:inline")}
              >
                {label}
              </Text>
              {index < STEPS.length - 1 && (
                <Box
                  as="span"
                  aria-hidden="true"
                  className={cn("h-0.5 w-6 rounded-full sm:w-14", done ? "bg-fresh" : "bg-input")}
                />
              )}
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
}

"use client";

import { Check } from "lucide-react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { PRODUCT_FORM_TABS, type ProductFormTab } from "@/modules/zod/product.model";

const TAB_LABELS: Record<ProductFormTab, string> = {
  basic: "Basics",
  pricing: "Price & limits",
  review: "Review",
};

interface ProductFormStepsProps {
  current: ProductFormTab;
  /** Step click — parent pichle steps validate karke hi aage jane deta hai */
  onSelect: (step: ProductFormTab) => void;
}

/** Multi-step form ka header — 01 Basics → 02 Price & limits → 03 Review */
export function ProductFormSteps({ current, onSelect }: ProductFormStepsProps) {
  const currentIndex = PRODUCT_FORM_TABS.indexOf(current);

  return (
    <Grid as="ol" cols="3" gap="2" aria-label="Form steps">
      {PRODUCT_FORM_TABS.map((step, index) => {
        const done = index < currentIndex;
        const active = step === current;
        return (
          <Box as="li" key={step}>
            <Button
              variant="outline"
              aria-current={active ? "step" : undefined}
              onClick={() => onSelect(step)}
              className={cn(
                "h-auto w-full justify-start gap-2.5 px-3 py-2.5",
                active && "border-primary/60 bg-accent/50 hover:bg-accent/50",
              )}
            >
              <Flex
                as="span"
                align="center"
                justify="center"
                className={cn(
                  "size-6 shrink-0 rounded-full text-xs",
                  active
                    ? "border border-primary bg-background text-primary"
                    : done
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check aria-hidden="true" className="size-3.5" /> : index + 1}
              </Flex>
              <Text as="span" weight="medium" className="truncate">
                {TAB_LABELS[step]}
              </Text>
            </Button>
          </Box>
        );
      })}
    </Grid>
  );
}

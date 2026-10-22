"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <ol className="grid grid-cols-3 gap-2" aria-label="Form steps">
      {PRODUCT_FORM_TABS.map((step, index) => {
        const done = index < currentIndex;
        const active = step === current;
        return (
          <li key={step}>
            <Button
              variant="outline"
              aria-current={active ? "step" : undefined}
              onClick={() => onSelect(step)}
              className={cn(
                "h-auto w-full justify-start gap-2.5 rounded-xl px-3 py-2.5",
                active && "border-primary ring-1 ring-primary hover:border-primary",
              )}
            >
              <span
                className={cn(
                  "font-mono text-xs flex size-6 shrink-0 items-center justify-center rounded-full",
                  done || active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check aria-hidden="true" className="size-3.5" /> : index + 1}
              </span>
              <span className="font-semibold truncate">
                {TAB_LABELS[step]}
              </span>
            </Button>
          </li>
        );
      })}
    </ol>
  );
}

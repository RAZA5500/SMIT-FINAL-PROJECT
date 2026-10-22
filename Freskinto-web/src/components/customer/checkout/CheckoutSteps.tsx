import { Check } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

const STEPS = ["Basket", "Delivery", "Payment", "Confirmed"] as const;

/** Checkout progress — `current` 0-based (Basket hamesha mukammal) */
export function CheckoutSteps({ current }: { current: 1 | 2 }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3" aria-label="Checkout progress">
      {STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <Fragment key={step}>
            {index > 0 && (
              <li aria-hidden="true" className={cn("h-0.5 flex-1 rounded-full", done || active ? "bg-primary" : "bg-border")} />
            )}
            <li
              aria-current={active ? "step" : undefined}
              className="flex shrink-0 items-center gap-2 text-sm font-medium"
            >
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-xs font-bold",
                  done && "bg-primary text-primary-foreground",
                  active && "bg-primary text-primary-foreground ring-4 ring-muted",
                  !done && !active && "bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check className="size-4" strokeWidth={3} aria-hidden="true" /> : index + 1}
              </span>
              <span className={cn("hidden sm:inline", !done && !active && "text-muted-foreground")}>{step}</span>
              <span className="sr-only">{done ? " (done)" : active ? " (current step)" : ""}</span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}

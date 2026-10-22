import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Basket", "Delivery details", "Payment"] as const;

/** Page-level progress: Basket → Delivery details → Payment (`current` 0-based) */
export function CheckoutSteps({ current }: { current: 0 | 1 | 2 }) {
  return (
    <nav aria-label="Checkout progress">
      <ol className="flex items-center gap-2 sm:gap-3">
        {STEPS.map((label, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li key={label} className="flex items-center gap-2 sm:gap-3" aria-current={active ? "step" : undefined}>
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-fs-12 font-semibold transition-colors",
                  done && "bg-brand-green text-white",
                  active && "bg-brand-green-forest text-white",
                  !done && !active && "border border-input bg-card text-muted-foreground",
                )}
              >
                {done ? <Check aria-hidden="true" className="size-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-fs-13 font-medium",
                  active ? "text-foreground" : "text-muted-foreground",
                  !active && "hidden sm:inline",
                )}
              >
                {label}
              </span>
              {index < STEPS.length - 1 && (
                <span aria-hidden="true" className={cn("h-px w-6 sm:w-12", done ? "bg-brand-green" : "bg-input")} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

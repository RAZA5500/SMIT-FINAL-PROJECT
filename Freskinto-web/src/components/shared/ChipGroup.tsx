"use client";

import { cn } from "@/lib/utils";

/** `null` option (e.g. "All orders") ka key */
const ALL = "__all__";

export interface ChipOption<T extends string | null> {
  value: T;
  label: string;
  /** Optional count (e.g. products in aisle) */
  count?: number;
}

interface ChipGroupProps<T extends string | null> {
  options: ChipOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  "aria-label": string;
  size?: "sm" | "default";
  className?: string;
}

/**
 * Single-select filter pills. Pressed chip dobara click karne se clear nahi hota — hamesha
 * ek selection rehti hai. Phones par row sideways scroll hoti hai.
 */
export function ChipGroup<T extends string | null>({
  options,
  value,
  onValueChange,
  "aria-label": ariaLabel,
  size = "default",
  className,
}: ChipGroupProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("no-scrollbar -mx-1 flex max-w-full items-center gap-2 overflow-x-auto px-1 py-1", className)}
    >
      {options.map((option) => {
        const pressed = (option.value ?? ALL) === (value ?? ALL);
        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={pressed}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card font-medium whitespace-nowrap text-foreground transition-colors outline-none hover:border-foreground/30 focus-visible:ring-3 focus-visible:ring-ring/35 aria-pressed:border-transparent aria-pressed:bg-brand-green-forest aria-pressed:text-white",
              size === "sm" ? "h-8 px-3 text-fs-13" : "h-9 px-4 text-sm",
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span className="rounded-full bg-muted px-1.5 text-xs text-muted-foreground tabular-nums">
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

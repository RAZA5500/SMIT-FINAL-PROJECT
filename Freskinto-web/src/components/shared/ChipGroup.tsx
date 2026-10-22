"use client";

import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

/** `null` option (e.g. "All orders") ka key */
const ALL = "__all__";

export interface ChipOption<T extends string | null> {
  value: T;
  label: string;
  /** Optional count (e.g. orders per status) */
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
 * Single-select filter pills (shadcn ToggleGroup). Pressed chip dobara click karne se clear nahi
 * hota — hamesha ek selection rehti hai. Phones par row sideways scroll hoti hai.
 */
export function ChipGroup<T extends string | null>({
  options,
  value,
  onValueChange,
  "aria-label": ariaLabel,
  size = "default",
  className,
}: ChipGroupProps<T>) {
  const keyOf = (option: T) => option ?? ALL;

  return (
    <ToggleGroup
      aria-label={ariaLabel}
      variant="chip"
      size={size}
      value={[keyOf(value)]}
      onValueChange={(next) => {
        const picked = next[0];
        if (picked === undefined) return;
        const option = options.find((item) => keyOf(item.value) === picked);
        if (option) onValueChange(option.value);
      }}
      className={cn("no-scrollbar -mx-1 max-w-full overflow-x-auto px-1 py-1", className)}
    >
      {options.map((option) => (
        <ToggleGroupItem key={option.label} value={keyOf(option.value)} className="shrink-0">
          {option.label}
          {option.count !== undefined && (
            <Badge variant="secondary" className="h-5 px-1.5 tabular-nums group-aria-pressed/toggle:bg-primary-foreground/20 group-aria-pressed/toggle:text-primary-foreground">
              {option.count}
            </Badge>
          )}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

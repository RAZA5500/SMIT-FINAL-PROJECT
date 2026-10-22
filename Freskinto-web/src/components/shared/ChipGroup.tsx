"use client";

import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

/** `null` option (e.g. "All orders") ka toggle value */
const ALL = "__all__";

export interface ChipOption<T extends string | null> {
  value: T;
  label: string;
  /** Optional count badge (e.g. unread) */
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
 * Single-select filter pills (shadcn ToggleGroup, `chip` variant). A pressed
 * chip can't be cleared by clicking it again — there is always a selection.
 * Phones scroll the row sideways.
 */
export function ChipGroup<T extends string | null>({
  options,
  value,
  onValueChange,
  "aria-label": ariaLabel,
  size = "default",
  className,
}: ChipGroupProps<T>) {
  const toKey = (option: T) => option ?? ALL;

  return (
    <ToggleGroup
      aria-label={ariaLabel}
      variant="chip"
      size={size}
      spacing={2}
      value={[toKey(value)]}
      onValueChange={(next: string[]) => {
        const picked = options.find((option) => toKey(option.value) === next[0]);
        if (picked) onValueChange(picked.value);
      }}
      className={cn("no-scrollbar relative -mx-1 w-auto max-w-full overflow-x-auto px-1 py-1", className)}
    >
      {options.map((option) => (
        <ToggleGroupItem key={option.label} value={toKey(option.value)} className={cn("shrink-0")}>
          {option.label}
          {option.count !== undefined && (
            <Badge variant="secondary" className={cn("h-5 min-w-5 px-1.5 tabular-nums group-aria-pressed/toggle:bg-primary-foreground/20 group-aria-pressed/toggle:text-primary-foreground")}>
              {option.count}
            </Badge>
          )}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

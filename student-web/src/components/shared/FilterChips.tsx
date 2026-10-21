"use client";

import { cn } from "@/lib/utils";

export interface FilterChipOption<T> {
  value: T;
  label: string;
  /** Optional count badge (e.g. unread) */
  count?: number;
}

interface FilterChipsProps<T> {
  options: FilterChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  "aria-label": string;
  className?: string;
}

/** Ek line ke filter pills (aria-pressed) — chhoti screen par side scroll */
export function FilterChips<T extends string | null>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
}: FilterChipsProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("no-scrollbar scroll-fade-x -mx-1 flex gap-2 overflow-x-auto px-1 py-1", className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium whitespace-nowrap ring-1 transition-colors",
              active ? "bg-primary text-primary-foreground ring-primary" : "bg-card ring-border hover:ring-foreground/30",
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span
                className={cn(
                  "numeric min-w-5 rounded-full px-1.5 text-center text-xs",
                  active ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground",
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

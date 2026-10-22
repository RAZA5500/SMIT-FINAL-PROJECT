"use client";

import type { ReactNode } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export interface ChoiceOption<T extends string = string> {
  value: T;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Right side (e.g. "Free" badge, Default badge) */
  aside?: ReactNode;
  disabled?: boolean;
}

interface ChoiceCardsProps<T extends string> {
  /** Har option ke radio ka id prefix */
  id: string;
  options: ChoiceOption<T>[];
  value: T | "" | undefined;
  onValueChange: (value: T) => void;
  "aria-label": string;
  invalid?: boolean;
  "aria-describedby"?: string;
  disabled?: boolean;
  className?: string;
  optionClassName?: string;
}

/**
 * Radio group as big tappable cards. Checked card gets a forest border and a soft
 * brand wash — selection ek nazar mein samajh aati hai.
 */
export function ChoiceCards<T extends string>({
  id,
  options,
  value,
  onValueChange,
  "aria-label": ariaLabel,
  invalid,
  "aria-describedby": ariaDescribedBy,
  disabled,
  className,
  optionClassName,
}: ChoiceCardsProps<T>) {
  return (
    <RadioGroup
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      aria-describedby={ariaDescribedBy}
      value={value ?? ""}
      onValueChange={(next) => onValueChange(next as T)}
      disabled={disabled}
      className={cn("grid gap-3 sm:grid-cols-2", className)}
    >
      {options.map((option) => {
        const optionId = `${id}-${option.value}`;
        return (
          <label
            key={option.value}
            htmlFor={optionId}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-foreground/30 has-data-checked:border-primary has-data-checked:bg-brand-soft/60 has-data-checked:ring-1 has-data-checked:ring-primary has-disabled:cursor-not-allowed has-disabled:opacity-60",
              optionClassName,
            )}
          >
            {option.icon && (
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-brand-green [&_svg]:size-5"
              >
                {option.icon}
              </span>
            )}
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-sm font-semibold text-foreground">{option.title}</span>
              {option.description && <span className="text-fs-13 text-muted-foreground">{option.description}</span>}
            </span>
            {option.aside}
            <RadioGroupItem value={option.value} id={optionId} disabled={option.disabled} />
          </label>
        );
      })}
    </RadioGroup>
  );
}

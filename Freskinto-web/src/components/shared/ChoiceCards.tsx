"use client";

import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
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
 * Radio group as big tappable cards (shadcn Field "choice card" pattern). Checked
 * card gets an emerald border — no tinted fill.
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
          <FieldLabel
            key={option.value}
            htmlFor={optionId}
            className={cn(
              "rounded-2xl! bg-background transition-colors has-data-checked:border-primary has-data-checked:bg-background has-data-checked:ring-1 has-data-checked:ring-primary",
              optionClassName,
            )}
          >
            <Field orientation="horizontal" data-disabled={option.disabled || undefined} className={cn("items-center! gap-3 p-4!")}>
              {option.icon && (
                <Box
                  aria-hidden="true"
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-brand [&_svg]:size-5",
                  )}
                >
                  {option.icon}
                </Box>
              )}
              <FieldContent>
                <FieldTitle>{option.title}</FieldTitle>
                {option.description && <FieldDescription>{option.description}</FieldDescription>}
              </FieldContent>
              {option.aside}
              <RadioGroupItem value={option.value} id={optionId} disabled={option.disabled} />
            </Field>
          </FieldLabel>
        );
      })}
    </RadioGroup>
  );
}

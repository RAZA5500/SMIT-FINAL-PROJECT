"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { describedBy, FieldMessage } from "./FieldMessage";
import { RequiredMark } from "./RequiredMark";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SelectFieldProps<T extends string = string> {
  id: string;
  label?: string;
  options: SelectOption<T>[];
  value: T | null | undefined;
  onValueChange: (value: T | null) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  /** Toolbar filters ke liye chhota trigger */
  size?: "sm" | "default";
  "aria-label"?: string;
  className?: string;
  containerClassName?: string;
}

/** shadcn (Base UI) Select + label + error — RHF ke saath `Controller` se */
export function SelectField<T extends string = string>({
  id,
  label,
  options,
  value,
  onValueChange,
  placeholder = "Select…",
  error,
  hint,
  required,
  disabled,
  size = "default",
  "aria-label": ariaLabel,
  className,
  containerClassName,
}: SelectFieldProps<T>) {
  return (
    <Field data-invalid={error ? true : undefined} className={cn(containerClassName)}>
      {label && (
        <FieldLabel htmlFor={id}>
          {label}
          {required && <RequiredMark />}
        </FieldLabel>
      )}
      <Select
        items={options}
        value={value ?? null}
        onValueChange={(next) => onValueChange((next as T | null) ?? null)}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          size={size}
          aria-label={label ? undefined : ariaLabel}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn("w-full", className)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldMessage id={id} error={error} hint={hint} />
    </Field>
  );
}

"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FieldMessage } from "./FieldMessage";

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
  placeholder = "Select...",
  error,
  required,
  disabled,
  size = "default",
  "aria-label": ariaLabel,
  className,
  containerClassName,
}: SelectFieldProps<T>) {
  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <Label htmlFor={id} className="text-foreground">
          {label}
          {required && (
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </Label>
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
          aria-describedby={error ? `${id}-error` : undefined}
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
      <FieldMessage id={id} error={error} />
    </div>
  );
}

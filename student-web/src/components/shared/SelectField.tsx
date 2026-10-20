"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
  className,
  containerClassName,
}: SelectFieldProps<T>) {
  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <Label htmlFor={id} className="font-normal text-slate-deep">
          {label}
          {required && <span className="text-red-500">*</span>}
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
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn("h-11 w-full rounded-15 border-gray-200 bg-white text-sm", className)}
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
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

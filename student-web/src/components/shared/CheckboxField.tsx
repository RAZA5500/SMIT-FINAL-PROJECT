"use client";

import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface CheckboxFieldProps {
  id: string;
  label: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

/** shadcn (Base UI) Checkbox + label + error — RHF ke saath `Controller` se */
export function CheckboxField({
  id,
  label,
  checked,
  onCheckedChange,
  error,
  disabled,
  className,
}: CheckboxFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <label htmlFor={id} className="cursor-pointer text-sm text-gray-600 select-none">
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

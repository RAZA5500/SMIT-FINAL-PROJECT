"use client";

import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { FieldMessage } from "./FieldMessage";

interface CheckboxFieldProps {
  id: string;
  label: ReactNode;
  /** Label ke neeche chhoti wazahat */
  description?: string;
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
  description,
  checked,
  onCheckedChange,
  error,
  disabled,
  className,
}: CheckboxFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-start gap-2.5">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className="mt-0.5"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <label htmlFor={id} className="flex cursor-pointer flex-col gap-0.5 text-sm text-foreground select-none">
          <span>{label}</span>
          {description && <span className="text-xs text-muted-foreground">{description}</span>}
        </label>
      </div>
      <FieldMessage id={id} error={error} />
    </div>
  );
}

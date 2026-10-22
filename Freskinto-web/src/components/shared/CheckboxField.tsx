"use client";

import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
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
    <Field orientation="horizontal" data-invalid={error ? true : undefined} className={cn(className)}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <FieldContent>
        <FieldLabel htmlFor={id} className={cn("font-normal")}>
          {label}
        </FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
        <FieldMessage id={id} error={error} />
      </FieldContent>
    </Field>
  );
}

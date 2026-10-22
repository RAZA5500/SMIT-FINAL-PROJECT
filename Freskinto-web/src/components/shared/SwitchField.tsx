"use client";

import type { ReactNode } from "react";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface SwitchFieldProps {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/** On/off setting row — poori row label hai, switch right par (shadcn choice-card pattern) */
export function SwitchField({ id, label, description, checked, onCheckedChange, disabled, className }: SwitchFieldProps) {
  return (
    <FieldLabel htmlFor={id} className={cn("rounded-xl! bg-background has-data-checked:bg-background", className)}>
      <Field orientation="horizontal" className={cn("p-4!")}>
        <FieldContent>
          <FieldTitle>{label}</FieldTitle>
          {description && <FieldDescription>{description}</FieldDescription>}
        </FieldContent>
        <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
      </Field>
    </FieldLabel>
  );
}

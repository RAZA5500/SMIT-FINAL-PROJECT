"use client";

import type { ReactNode } from "react";
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

/** On/off setting row — label + wazahat left, switch right (poori row clickable label) */
export function SwitchField({ id, label, description, checked, onCheckedChange, disabled, className }: SwitchFieldProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 rounded-xl border bg-card px-4 py-3.5", className)}>
      <label htmlFor={id} className="flex min-w-0 cursor-pointer flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}

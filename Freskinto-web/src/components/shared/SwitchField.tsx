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

/** On/off setting row — poori row label hai, switch right par */
export function SwitchField({ id, label, description, checked, onCheckedChange, disabled, className }: SwitchFieldProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/25",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-medium">{label}</span>
        {description && <span className="text-fs-13 text-muted-foreground">{description}</span>}
      </span>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </label>
  );
}

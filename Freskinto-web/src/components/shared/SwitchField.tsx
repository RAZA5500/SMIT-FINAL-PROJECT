"use client";

import type { ReactNode } from "react";
import { Stack } from "@/components/ui/flex";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/typography";
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
    <Label
      htmlFor={id}
      className={cn(
        "cursor-pointer justify-between gap-4 rounded-xl border border-border bg-card p-4 font-normal transition-colors hover:border-foreground/25",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <Stack as="span" gap="0.5" className="min-w-0">
        <Text as="span" weight="medium">
          {label}
        </Text>
        {description && (
          <Text as="span" tone="muted" className="text-fs-13 leading-snug">
            {description}
          </Text>
        )}
      </Stack>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </Label>
  );
}

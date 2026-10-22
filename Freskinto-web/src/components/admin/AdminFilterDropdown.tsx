"use client";

import { SelectField } from "@/components/shared/SelectField";
import { ALL_VALUE, type FilterOption } from "@/constants/filters";
import { cn } from "@/lib/utils";

interface AdminFilterDropdownProps<T extends string> {
  id: string;
  /** Screen-reader label (visible label nahi — toolbar mein jagah kam hoti hai) */
  label: string;
  /** "All statuses" jaisa pehla option */
  allLabel: string;
  options: FilterOption<T>[];
  value: T | null;
  onValueChange: (value: T | null) => void;
  className?: string;
}

/** Admin tables ka compact filter dropdown — "All" = `null` (API ko filter nahi jata) */
export function AdminFilterDropdown<T extends string>({
  id,
  label,
  allLabel,
  options,
  value,
  onValueChange,
  className,
}: AdminFilterDropdownProps<T>) {
  return (
    <SelectField<string>
      id={id}
      aria-label={label}
      size="sm"
      options={[{ value: ALL_VALUE, label: allLabel }, ...options]}
      value={value ?? ALL_VALUE}
      onValueChange={(next) => onValueChange(next === null || next === ALL_VALUE ? null : (next as T))}
      containerClassName={cn("w-full sm:w-44", className)}
    />
  );
}

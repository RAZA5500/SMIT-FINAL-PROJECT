"use client";

import { SelectField } from "@/components/shared/SelectField";
import type { ComponentProps } from "react";

export type AdminFilterDropdownProps = ComponentProps<typeof SelectField>;

/**
 * Filter dropdown for admin tables (FLOW-MD 07 §1)
 */
export function AdminFilterDropdown(props: AdminFilterDropdownProps) {
  return <SelectField size="sm" {...props} />;
}

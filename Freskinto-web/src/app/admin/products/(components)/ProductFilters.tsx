"use client";

import { ToolbarFilters } from "@/components/admin/DataTableCard";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { cn } from "@/lib/utils";
import type { ProductSort } from "@/services/products/types";

export interface ProductFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  categoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  categoryOptions: { value: string; label: string }[];
  isActive: boolean | null;
  onStatusChange: (status: boolean | null) => void;
  sortBy: ProductSort;
  onSortChange: (sort: ProductSort) => void;
}

const ALL = "ALL";

const STATUS_OPTIONS = [
  { value: ALL, label: "All statuses" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export function ProductFilters({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  categoryOptions,
  isActive,
  onStatusChange,
  sortBy,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <>
      <SearchInput
        value={search}
        onValueChange={onSearchChange}
        placeholder="Search by name or SKU…"
        className={cn("w-full md:max-w-xs")}
      />
      <ToolbarFilters>
        <SelectField
          id="product-category-filter"
          aria-label="Filter by category"
          size="sm"
          options={categoryOptions}
          value={categoryId ?? ALL}
          onValueChange={(value) => onCategoryChange(!value || value === ALL ? null : value)}
          containerClassName={cn("w-48")}
        />
        <SelectField
          id="product-status-filter"
          aria-label="Filter by status"
          size="sm"
          options={STATUS_OPTIONS}
          value={isActive === null ? ALL : String(isActive)}
          onValueChange={(value) => onStatusChange(!value || value === ALL ? null : value === "true")}
          containerClassName={cn("w-36")}
        />
        <SelectField
          id="product-sort"
          aria-label="Sort products"
          size="sm"
          options={SORT_OPTIONS}
          value={sortBy}
          onValueChange={(value) => onSortChange(value ?? "newest")}
          containerClassName={cn("w-44")}
        />
      </ToolbarFilters>
    </>
  );
}

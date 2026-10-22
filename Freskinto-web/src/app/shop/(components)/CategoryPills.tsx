"use client";

import { findCategory, findParent, type CategoryNode } from "@/components/customer/shop/category-tree";
import { Stack } from "@/components/ui/flex";
import { ChipGroup } from "@/components/shared/ChipGroup";

interface CategoryPillsProps {
  aisles: CategoryNode[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

/**
 * Sticky aisle pills: upar top-level aisles, neeche (agar aisle chuni ho) uski sub-aisles.
 * Sticky header ke theek neeche chipakte hain; desktop par sidebar ki aisle list kaafi hai.
 */
export function CategoryPills({ aisles, selected, onSelect }: CategoryPillsProps) {
  const current = findCategory(aisles, selected);
  const root = findParent(aisles, selected) ?? current;
  const hasChildren = Boolean(root && root.children.length > 0 && selected);

  return (
    <Stack
      id="aisles"
      gap="1"
      className="glass sticky top-header z-30 -mx-4 border-b px-4 py-2 sm:-mx-6 sm:px-6 lg:hidden"
    >
      <ChipGroup<string | null>
        aria-label="Aisles"
        options={[{ value: null, label: "All aisles" }, ...aisles.map((aisle) => ({ value: aisle.id, label: aisle.name }))]}
        value={root?.id ?? null}
        onValueChange={onSelect}
      />
      {hasChildren && root && (
        <ChipGroup<string | null>
          aria-label={`${root.name} sub-aisles`}
          size="sm"
          options={[
            { value: root.id, label: `All ${root.name}` },
            ...root.children.map((child) => ({ value: child.id, label: child.name })),
          ]}
          value={selected}
          onValueChange={onSelect}
          className="animate-fade-up"
        />
      )}
    </Stack>
  );
}

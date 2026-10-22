"use client";

import { findCategory, findParent, type CategoryNode } from "@/components/customer/shop/category-tree";
import { ChipGroup } from "@/components/shared/ChipGroup";

interface CategoryPillsProps {
  aisles: CategoryNode[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

/**
 * Sticky aisle pills: upar top-level aisles, neeche (agar aisle chuni ho) uski sub-aisles.
 * Phone par header ke saath chhup-nikalta hai, isliye wahan top-0.
 */
export function CategoryPills({ aisles, selected, onSelect }: CategoryPillsProps) {
  const current = findCategory(aisles, selected);
  const root = findParent(aisles, selected) ?? current;
  const hasChildren = Boolean(root && root.children.length > 0 && selected);

  return (
    <div
      id="aisles"
      className="sticky top-0 z-30 -mx-4 flex flex-col gap-1 border-b border-border/60 bg-background/90 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6 lg:top-header lg:-mx-8 lg:px-8"
    >
      <ChipGroup<string | null>
        aria-label="Aisles"
        options={[
          { value: null, label: "All aisles" },
          ...aisles.map((aisle) => ({ value: aisle.id, label: aisle.name })),
        ]}
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
        />
      )}
    </div>
  );
}

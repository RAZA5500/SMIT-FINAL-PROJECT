"use client";

import { findCategory, findParent, type CategoryNode } from "@/components/customer/shop/category-tree";
import { ChipGroup } from "@/components/shared/ChipGroup";

interface SubcategoryChipsProps {
  tree: CategoryNode[];
  selected: string | null;
  onSelect: (id: string) => void;
}

/** Aisle ke andar jaldi refine: "All Fruit" + us ki sub-categories (child ho to siblings) */
export function SubcategoryChips({ tree, selected, onSelect }: SubcategoryChipsProps) {
  const current = findCategory(tree, selected);
  const root = findParent(tree, selected) ?? current;
  if (!root || root.children.length === 0 || !selected) return null;

  return (
    <ChipGroup
      aria-label={`${root.name} sub-categories`}
      options={[
        { value: root.id, label: `All ${root.name}` },
        ...root.children.map((child) => ({ value: child.id, label: child.name })),
      ]}
      value={selected}
      onValueChange={onSelect}
    />
  );
}

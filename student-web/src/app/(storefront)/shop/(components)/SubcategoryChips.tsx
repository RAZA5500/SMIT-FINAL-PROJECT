"use client";

import { findCategory, findParent, type CategoryNode } from "@/components/customer/shop/category-tree";
import { cn } from "@/lib/utils";

interface SubcategoryChipsProps {
  tree: CategoryNode[];
  selected: string | null;
  onSelect: (id: string) => void;
}

/** Aisle ke andar jaldi refine: "All Fruit" + us ki sub-categories (child ho to siblings) */
export function SubcategoryChips({ tree, selected, onSelect }: SubcategoryChipsProps) {
  const current = findCategory(tree, selected);
  const root = findParent(tree, selected) ?? current;
  if (!root || root.children.length === 0) return null;

  const chips = [{ id: root.id, label: `All ${root.name}` }, ...root.children.map((c) => ({ id: c.id, label: c.name }))];

  return (
    <div className="no-scrollbar scroll-fade-x -mx-1 flex gap-2 overflow-x-auto px-1 py-1" role="group" aria-label={`${root.name} sub-categories`}>
      {chips.map((chip) => {
        const active = chip.id === selected;
        return (
          <button
            key={chip.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(chip.id)}
            className={cn(
              "h-9 shrink-0 rounded-full px-4 text-sm font-medium whitespace-nowrap ring-1 transition-colors",
              active ? "bg-primary text-primary-foreground ring-primary" : "bg-card ring-border hover:ring-foreground/30",
            )}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
}

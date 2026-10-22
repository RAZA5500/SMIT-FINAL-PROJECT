"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetCategories } from "@/services/categories/queries";
import { CATEGORY_LIST_LIMIT } from "../layout/CategoryBar";
import { buildCategoryTree, type CategoryNode } from "./category-tree";

const ROW_CLASS =
  "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors";

function CategoryRow({
  label,
  active,
  depth = 0,
  onSelect,
}: {
  label: string;
  active: boolean;
  depth?: 0 | 1;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        ROW_CLASS,
        depth === 1 && "pl-4",
        active ? "bg-brand-soft font-semibold text-brand" : "text-foreground/80 hover:bg-muted hover:text-foreground",
      )}
    >
      <span className="truncate">{label}</span>
    </button>
  );
}

function RootCategory({
  node,
  selected,
  onSelect,
}: {
  node: CategoryNode;
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const containsSelected = node.children.some((child) => child.id === selected);
  const [open, setOpen] = useState(containsSelected || node.id === selected);

  if (node.children.length === 0) {
    return (
      <CategoryRow label={node.name} active={selected === node.id} onSelect={() => onSelect(node.id)} />
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-1">
        <div className="min-w-0 flex-1">
          <CategoryRow
            label={node.name}
            active={selected === node.id}
            onSelect={() => {
              onSelect(node.id);
              setOpen(true);
            }}
          />
        </div>
        <CollapsibleTrigger
          aria-label={open ? `Collapse ${node.name}` : `Expand ${node.name}`}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden="true" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="ml-3 flex flex-col gap-0.5 border-l py-0.5 pl-1">
        {node.children.map((child) => (
          <CategoryRow
            key={child.id}
            depth={1}
            label={child.name}
            active={selected === child.id}
            onSelect={() => onSelect(child.id)}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

/**
 * Category tree. Counts nahi dikhate — backend `productCount` mein hidden (inactive) products
 * bhi gine jate hain, jo grid ke "N products" se match nahi karte.
 */
export function CategoryFilter({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  const { data, isLoading, isError, refetch } = useGetCategories({ limit: CATEGORY_LIST_LIMIT });
  const tree = useMemo(() => buildCategoryTree(data?.data ?? []), [data]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5" aria-label="Loading categories" aria-busy="true">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-5 w-4/5" />
        ))}
      </div>
    );
  }
  if (isError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-1 text-sm text-muted-foreground">
        Couldn&apos;t load categories.
        <button type="button" className="font-semibold text-brand hover:underline" onClick={() => void refetch()}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <CategoryRow label="All products" active={selected === null} onSelect={() => onSelect(null)} />
      {tree.map((node) => (
        // key mein selected — doosri category select hone par expand state naye sire se
        <RootCategory key={`${node.id}-${selected ?? ""}`} node={node} selected={selected} onSelect={onSelect} />
      ))}
    </div>
  );
}

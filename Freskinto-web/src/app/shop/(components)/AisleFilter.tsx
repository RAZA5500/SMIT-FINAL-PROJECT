"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { aisleNumber } from "@/components/shared/AisleTag";
import type { CategoryNode } from "@/components/customer/shop/category-tree";
import { useAisles } from "@/components/customer/shop/use-aisles";
import { cn } from "@/lib/utils";

function AisleRow({
  number,
  label,
  active,
  child = false,
  onSelect,
}: {
  number?: string;
  label: string;
  active: boolean;
  child?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        "flex w-full min-w-0 items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/35",
        child && "pl-3",
        active
          ? "bg-brand-green-forest font-semibold text-white"
          : "text-foreground/80 hover:bg-muted",
      )}
    >
      {number && (
        <span className={cn("font-mono text-fs-11 font-semibold", active ? "text-brand-green-vivid" : "text-brand-green")}>
          {number}
        </span>
      )}
      <span className="truncate">{label}</span>
    </button>
  );
}

function AisleGroup({
  aisle,
  index,
  selected,
  onSelect,
}: {
  aisle: CategoryNode;
  index: number;
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const containsSelected = aisle.children.some((child) => child.id === selected);
  const [open, setOpen] = useState(containsSelected || aisle.id === selected);
  const number = aisleNumber(index);

  if (aisle.children.length === 0) {
    return <AisleRow number={number} label={aisle.name} active={selected === aisle.id} onSelect={() => onSelect(aisle.id)} />;
  }

  return (
    <div>
      <div className="flex items-center gap-1">
        <AisleRow
          number={number}
          label={aisle.name}
          active={selected === aisle.id}
          onSelect={() => {
            onSelect(aisle.id);
            setOpen(true);
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-expanded={open}
          aria-label={open ? `Collapse ${aisle.name}` : `Expand ${aisle.name}`}
          className="shrink-0 text-muted-foreground"
          onClick={() => setOpen((value) => !value)}
        >
          <ChevronDown aria-hidden="true" className={cn("transition-transform", open && "rotate-180")} />
        </Button>
      </div>
      {open && (
        <div className="my-1 ml-5 flex flex-col gap-0.5 border-l border-border pl-2">
          {aisle.children.map((child) => (
            <AisleRow key={child.id} child label={child.name} active={selected === child.id} onSelect={() => onSelect(child.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Aisle (category) tree. Counts nahi dikhate — backend `productCount` mein hidden
 * (inactive) products bhi gine jate hain, jo grid ke "N products" se match nahi karte.
 */
export function AisleFilter({ selected, onSelect }: { selected: string | null; onSelect: (id: string | null) => void }) {
  const { aisles, isLoading, isError, refetch } = useAisles();

  if (isLoading) {
    return (
      <div aria-label="Loading categories" aria-busy="true" className="flex flex-col gap-2.5">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-5 w-4/5" />
        ))}
      </div>
    );
  }
  if (isError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-1 text-sm text-muted-foreground">
        Couldn&apos;t load aisles.
        <Button variant="link" size="sm" onClick={() => void refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <AisleRow label="All products" active={selected === null} onSelect={() => onSelect(null)} />
      {aisles.map((aisle, index) => (
        // key mein selected — doosri category select hone par expand state naye sire se
        <AisleGroup key={`${aisle.id}-${selected ?? ""}`} aisle={aisle} index={index} selected={selected} onSelect={onSelect} />
      ))}
    </div>
  );
}

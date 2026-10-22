"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Flex, Stack } from "@/components/ui/flex";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
import { aisleNumber } from "@/components/shared/AisleTag";
import { cn } from "@/lib/utils";
import type { CategoryNode } from "./category-tree";
import { useAisles } from "./use-aisles";

const ROW_CLASS = "h-auto w-full justify-start gap-2.5 rounded-lg px-2.5 py-2 text-left font-normal";

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
    <Button
      variant="ghost"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        ROW_CLASS,
        child && "pl-3",
        active
          ? "bg-primary font-semibold text-primary-foreground hover:bg-brand-strong hover:text-primary-foreground"
          : "text-foreground/80",
      )}
    >
      {number && (
        <Text as="span" variant="code" className={cn(active ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {number}
        </Text>
      )}
      <Text as="span" className={cn("truncate")}>
        {label}
      </Text>
    </Button>
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
    <Collapsible open={open} onOpenChange={setOpen}>
      <Flex align="center" gap="1">
        <AisleRow
          number={number}
          label={aisle.name}
          active={selected === aisle.id}
          onSelect={() => {
            onSelect(aisle.id);
            setOpen(true);
          }}
        />
        <CollapsibleTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={open ? `Collapse ${aisle.name}` : `Expand ${aisle.name}`}
              className={cn("shrink-0 text-muted-foreground")}
            />
          }
        >
          <ChevronDown aria-hidden="true" className={cn("transition-transform", open && "rotate-180")} />
        </CollapsibleTrigger>
      </Flex>
      <CollapsibleContent>
        <Stack gap="0.5" className={cn("my-1 ml-5 border-l border-dashed border-input pl-2")}>
          {aisle.children.map((child) => (
            <AisleRow key={child.id} child label={child.name} active={selected === child.id} onSelect={() => onSelect(child.id)} />
          ))}
        </Stack>
      </CollapsibleContent>
    </Collapsible>
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
      <Stack gap="2.5" aria-label="Loading categories" aria-busy="true">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className={cn("h-5 w-4/5")} />
        ))}
      </Stack>
    );
  }
  if (isError) {
    return (
      <Stack role="alert" align="start" gap="1">
        <Text tone="muted">Couldn&apos;t load aisles.</Text>
        <Button variant="link" size="sm" onClick={() => void refetch()}>
          Try again
        </Button>
      </Stack>
    );
  }

  return (
    <Stack gap="0.5">
      <AisleRow label="All products" active={selected === null} onSelect={() => onSelect(null)} />
      {aisles.map((aisle, index) => (
        // key mein selected — doosri category select hone par expand state naye sire se
        <AisleGroup key={`${aisle.id}-${selected ?? ""}`} aisle={aisle} index={index} selected={selected} onSelect={onSelect} />
      ))}
    </Stack>
  );
}

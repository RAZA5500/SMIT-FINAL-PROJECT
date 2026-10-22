"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Flex, Stack } from "@/components/ui/flex";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
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
    <Button
      type="button"
      variant="ghost"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        "h-9 w-full min-w-0 justify-start gap-2.5 rounded-xl px-2.5 font-normal",
        child && "pl-3",
        active && "bg-primary font-semibold text-primary-foreground hover:bg-primary/90",
      )}
    >
      {number && (
        <Text as="span" tone="inherit" family="mono" weight="semibold" className={cn("text-fs-11", active ? "text-lime" : "text-primary")}>
          {number}
        </Text>
      )}
      <Text as="span" tone="inherit" className="truncate">
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
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={open ? `Collapse ${aisle.name}` : `Expand ${aisle.name}`}
              className="shrink-0 rounded-full text-muted-foreground"
            />
          }
        >
          <ChevronDown aria-hidden="true" className={cn("transition-transform duration-200", open && "rotate-180")} />
        </CollapsibleTrigger>
      </Flex>
      <CollapsibleContent>
        <Stack gap="0.5" className="my-1 ml-5 border-l-2 border-border pl-2">
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
      <Stack aria-label="Loading categories" aria-busy="true" gap="2.5">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-5 w-4/5" />
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
        <Box key={`${aisle.id}-${selected ?? ""}`}>
          <AisleGroup aisle={aisle} index={index} selected={selected} onSelect={onSelect} />
        </Box>
      ))}
    </Stack>
  );
}

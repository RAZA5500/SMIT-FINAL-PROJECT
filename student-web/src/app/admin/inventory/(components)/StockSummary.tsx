"use client";

import { Boxes, PackageX, TriangleAlert, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { StockStatus } from "@/constants/enums";
import { cn } from "@/lib/utils";
import { useGetInventory } from "@/services/inventory/queries";

const TILES: { status: StockStatus | null; label: string; hint: string; icon: LucideIcon; tone: string }[] = [
  { status: null, label: "Tracked products", hint: "All inventory rows", icon: Boxes, tone: "bg-brand-soft text-brand" },
  { status: "LOW_STOCK", label: "Low stock", hint: "At or below threshold", icon: TriangleAlert, tone: "bg-saffron-soft text-warning" },
  { status: "OUT_OF_STOCK", label: "Out of stock", hint: "Can't be ordered", icon: PackageX, tone: "bg-tomato-soft text-destructive" },
];

/** Har tile ka count `meta.total` se (limit 1 — sirf ginti chahiye) */
function SummaryTile({
  tile,
  active,
  onSelect,
}: {
  tile: (typeof TILES)[number];
  active: boolean;
  onSelect: () => void;
}) {
  const { data, isLoading } = useGetInventory({ limit: 1, stockStatus: tile.status ?? undefined });
  const Icon = tile.icon;
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        "flex items-center gap-4 rounded-2xl bg-card p-4 text-left shadow-soft ring-1 transition hover:-translate-y-0.5 hover:shadow-lift",
        active ? "ring-2 ring-primary" : "ring-border",
      )}
    >
      <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl", tile.tone)}>
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-medium text-muted-foreground">{tile.label}</span>
        {isLoading ? (
          <Skeleton className="my-1 h-7 w-12" />
        ) : (
          // Stat value: UI sans, proportional figures (dataviz figure rules)
          <span className="font-sans text-3xl leading-tight font-semibold">{data?.meta.total ?? "—"}</span>
        )}
        <span className="text-xs text-muted-foreground">{tile.hint}</span>
      </span>
    </button>
  );
}

export function StockSummary({ active, onSelect }: { active: StockStatus | null; onSelect: (status: StockStatus | null) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {TILES.map((tile) => (
        <SummaryTile key={tile.label} tile={tile} active={active === tile.status} onSelect={() => onSelect(tile.status)} />
      ))}
    </div>
  );
}

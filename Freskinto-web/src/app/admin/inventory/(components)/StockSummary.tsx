"use client";

import { Boxes, PackageX, TriangleAlert, type LucideIcon } from "lucide-react";
import { StatTile } from "@/components/admin/StatTile";
import type { StockStatus } from "@/constants/enums";
import { useGetInventory } from "@/services/inventory/queries";

const TILES: { status: StockStatus | null; label: string; hint: string; icon: LucideIcon; tone: string }[] = [
  { status: null, label: "Tracked products", hint: "All inventory rows", icon: Boxes, tone: "text-brand-green" },
  { status: "LOW_STOCK", label: "Low stock", hint: "At or below threshold", icon: TriangleAlert, tone: "text-warning" },
  { status: "OUT_OF_STOCK", label: "Out of stock", hint: "Can't be ordered", icon: PackageX, tone: "text-destructive" },
];

/** Har tile ka count `meta.total` se (limit 1 — sirf ginti chahiye); tile click = filter */
function SummaryTile({ tile, active, onSelect }: { tile: (typeof TILES)[number]; active: boolean; onSelect: () => void }) {
  const { data, isLoading } = useGetInventory({ limit: 1, stockStatus: tile.status ?? undefined });

  return (
    <StatTile
      label={tile.label}
      value={data?.meta.total}
      hint={tile.hint}
      icon={tile.icon}
      tone={tile.tone}
      isLoading={isLoading}
      active={active}
      onSelect={onSelect}
    />
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

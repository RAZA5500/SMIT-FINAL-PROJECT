"use client";

import { Boxes, PackageX, TriangleAlert, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
import type { StockStatus } from "@/constants/enums";
import { cn } from "@/lib/utils";
import { useGetInventory } from "@/services/inventory/queries";

const TILES: { status: StockStatus | null; label: string; hint: string; icon: LucideIcon; tone: string }[] = [
  { status: null, label: "Tracked products", hint: "All inventory rows", icon: Boxes, tone: "text-brand" },
  { status: "LOW_STOCK", label: "Low stock", hint: "At or below threshold", icon: TriangleAlert, tone: "text-warning" },
  { status: "OUT_OF_STOCK", label: "Out of stock", hint: "Can't be ordered", icon: PackageX, tone: "text-destructive" },
];

/** Har tile ka count `meta.total` se (limit 1 — sirf ginti chahiye); tile click = filter */
function SummaryTile({ tile, active, onSelect }: { tile: (typeof TILES)[number]; active: boolean; onSelect: () => void }) {
  const { data, isLoading } = useGetInventory({ limit: 1, stockStatus: tile.status ?? undefined });
  const Icon = tile.icon;

  return (
    <Button
      variant="outline"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        "h-auto justify-start gap-4 rounded-2xl p-4 text-left whitespace-normal hover:-translate-y-0.5 hover:shadow-soft",
        active && "border-primary ring-1 ring-primary hover:border-primary",
      )}
    >
      <Flex align="center" justify="center" className={cn("size-12 shrink-0 rounded-2xl border bg-muted [&_svg]:size-6", tile.tone)}>
        <Icon aria-hidden="true" />
      </Flex>
      <Stack gap="1" className={cn("min-w-0")}>
        <Text as="span" variant="code" tone="muted" className={cn("uppercase")}>
          {tile.label}
        </Text>
        {isLoading ? (
          <Skeleton className={cn("h-7 w-12")} />
        ) : (
          // Stat value: UI sans, proportional figures (dataviz figure rules)
          <Text as="span" size="3xl" weight="semibold" className={cn("leading-none")}>
            {data?.meta.total ?? "—"}
          </Text>
        )}
        <Text as="span" variant="small" tone="muted" className={cn("font-normal")}>
          {tile.hint}
        </Text>
      </Stack>
    </Button>
  );
}

export function StockSummary({ active, onSelect }: { active: StockStatus | null; onSelect: (status: StockStatus | null) => void }) {
  return (
    <Grid gap="4" className={cn("sm:grid-cols-3")}>
      {TILES.map((tile) => (
        <SummaryTile key={tile.label} tile={tile} active={active === tile.status} onSelect={() => onSelect(tile.status)} />
      ))}
    </Grid>
  );
}

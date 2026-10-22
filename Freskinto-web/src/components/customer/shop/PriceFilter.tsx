"use client";

import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

/** Grocery ke aam budget brackets — `null` = khuli hadd */
const PRESETS: { label: string; min: number | null; max: number | null }[] = [
  { label: "Under £2", min: null, max: 2 },
  { label: "£2 – £5", min: 2, max: 5 },
  { label: "£5 – £10", min: 5, max: 10 },
  { label: "£10+", min: 10, max: null },
];

interface PriceFilterProps {
  min: number | null;
  max: number | null;
  /** Catalog ki sab se mehngi cheez (round up) — slider ki upper hadd */
  ceiling: number;
  onCommit: (min: number | null, max: number | null) => void;
}

/**
 * Slider drag sirf local state badalta hai; chhorne (commit) par URL. Floor/ceiling
 * par value `null` — filter laga hi nahi.
 */
export function PriceFilter({ min, max, ceiling, onCommit }: PriceFilterProps) {
  const [range, setRange] = useState<[number, number]>([min ?? 0, Math.min(max ?? ceiling, ceiling)]);

  const commit = ([low, high]: readonly number[]) => {
    const nextMin = low > 0 ? low : null;
    const nextMax = high < ceiling ? high : null;
    onCommit(nextMin, nextMax);
  };

  const commitInput = (index: 0 | 1, raw: string) => {
    const value = Math.min(ceiling, Math.max(0, Number(raw) || 0));
    const next: [number, number] = index === 0 ? [Math.min(value, range[1]), range[1]] : [range[0], Math.max(value, range[0])];
    setRange(next);
    commit(next);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => {
          const active = preset.min === min && preset.max === max;
          return (
            <button
              key={preset.label}
              type="button"
              aria-pressed={active}
              onClick={() => onCommit(active ? null : preset.min, active ? null : preset.max)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition-colors",
                active ? "bg-primary text-primary-foreground ring-primary" : "bg-card ring-border hover:ring-foreground/30",
              )}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <Slider
        min={0}
        max={ceiling}
        step={1}
        value={range}
        onValueChange={(value) => setRange(value as [number, number])}
        onValueCommitted={(value) => commit(value as readonly number[])}
        aria-label="Price range"
        className="py-2"
      />

      <div className="grid grid-cols-2 gap-2">
        {(["Min", "Max"] as const).map((label, index) => (
          <InputGroup key={label} className="h-9">
            <InputGroupAddon>
              <InputGroupText>£</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              type="number"
              inputMode="decimal"
              min={0}
              max={ceiling}
              aria-label={`${label}imum price`}
              value={range[index]}
              onChange={(event) => {
                const value = Number(event.target.value);
                setRange((current) => (index === 0 ? [value, current[1]] : [current[0], value]));
              }}
              onBlur={(event) => commitInput(index as 0 | 1, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") commitInput(index as 0 | 1, event.currentTarget.value);
              }}
              className="numeric"
            />
          </InputGroup>
        ))}
      </div>
    </div>
  );
}

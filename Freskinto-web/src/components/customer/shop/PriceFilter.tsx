"use client";

import { useState } from "react";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Text } from "@/components/ui/typography";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Grocery ke aam budget brackets — `null` = khuli hadd */
const PRESETS: { key: string; label: string; min: number | null; max: number | null }[] = [
  { key: "u2", label: "Under £2", min: null, max: 2 },
  { key: "2-5", label: "£2 – £5", min: 2, max: 5 },
  { key: "5-10", label: "£5 – £10", min: 5, max: 10 },
  { key: "10+", label: "£10+", min: 10, max: null },
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
  const activePreset = PRESETS.find((preset) => preset.min === min && preset.max === max);

  const commit = ([low, high]: readonly number[]) => {
    onCommit(low > 0 ? low : null, high < ceiling ? high : null);
  };

  const commitInput = (index: 0 | 1, raw: string) => {
    const value = Math.min(ceiling, Math.max(0, Number(raw) || 0));
    const next: [number, number] =
      index === 0 ? [Math.min(value, range[1]), range[1]] : [range[0], Math.max(value, range[0])];
    setRange(next);
    commit(next);
  };

  return (
    <Stack gap="4">
      <ToggleGroup
        aria-label="Price brackets"
        variant="chip"
        size="sm"
        spacing={1.5}
        value={activePreset ? [activePreset.key] : []}
        onValueChange={(next: string[]) => {
          const preset = PRESETS.find((item) => item.key === next[0]);
          onCommit(preset?.min ?? null, preset?.max ?? null);
        }}
        className={cn("flex-wrap")}
      >
        {PRESETS.map((preset) => (
          <ToggleGroupItem key={preset.key} value={preset.key}>
            {preset.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Stack gap="2.5">
        <Flex justify="between">
          <Text variant="code" tone="muted" numeric>
            {formatMoney(range[0])}
          </Text>
          <Text variant="code" tone="muted" numeric>
            {range[1] >= ceiling ? `${formatMoney(ceiling)}+` : formatMoney(range[1])}
          </Text>
        </Flex>
        <Slider
          min={0}
          max={ceiling}
          step={1}
          value={range}
          onValueChange={(value) => setRange(value as [number, number])}
          onValueCommitted={(value) => commit(value as readonly number[])}
          aria-label="Price range"
        />
      </Stack>

      <Grid cols="2" gap="2">
        {(["Min", "Max"] as const).map((label, index) => (
          <InputGroup key={label} className={cn("h-9")}>
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
              className={cn("tabular-nums")}
            />
          </InputGroup>
        ))}
      </Grid>
    </Stack>
  );
}

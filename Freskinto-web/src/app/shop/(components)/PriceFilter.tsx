"use client";

import { useState } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Slider } from "@/components/ui/slider";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/typography";
import { ChipGroup } from "@/components/shared/ChipGroup";
import { PRICE_PRESETS } from "@/constants/filters";
import { formatMoney } from "@/lib/utils";

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
  const activePreset = PRICE_PRESETS.find((preset) => preset.min === min && preset.max === max);
  const anyPrice = min === null && max === null;

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
      <ChipGroup<string | null>
        aria-label="Price brackets"
        size="sm"
        options={[
          { value: null, label: "Any price" },
          ...PRICE_PRESETS.map((preset) => ({ value: preset.key, label: preset.label })),
        ]}
        value={anyPrice ? null : (activePreset?.key ?? "custom")}
        onValueChange={(key) => {
          const preset = PRICE_PRESETS.find((item) => item.key === key);
          onCommit(preset?.min ?? null, preset?.max ?? null);
        }}
        className="flex-wrap overflow-visible"
      />

      <Stack gap="3">
        <Flex justify="between">
          <Text as="span" family="mono" weight="bold" className="rounded-md bg-plum-soft px-2 py-0.5 text-fs-12 text-accent-foreground">
            {formatMoney(range[0])}
          </Text>
          <Text as="span" family="mono" weight="bold" className="rounded-md bg-plum-soft px-2 py-0.5 text-fs-12 text-accent-foreground">
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
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitInput(index as 0 | 1, event.currentTarget.value);
                }
              }}
              className="numeric"
            />
          </InputGroup>
        ))}
      </Grid>
    </Stack>
  );
}

"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Line, LineChart, ReferenceDot, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { COMPARISON_LABEL, type Kpi } from "./dashboard-data";

const sparkConfig = { value: { label: "Trend", color: "var(--chart-1)" } } satisfies ChartConfig;

/** 12-point sparkline: de-emphasised line, current period ka dot accent */
function Sparkline({ points, label }: { points: number[]; label: string }) {
  const data = points.map((value, index) => ({ index, value }));
  const last = data[data.length - 1];

  return (
    <ChartContainer
      config={sparkConfig}
      role="img"
      aria-label={`${label}, 12-period trend`}
      className={cn("aspect-auto h-10 w-28 shrink-0")}
    >
      <LineChart data={data} margin={{ top: 6, right: 6, bottom: 6, left: 6 }}>
        <XAxis dataKey="index" hide />
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Line
          dataKey="value"
          type="monotone"
          stroke="var(--muted-foreground)"
          strokeOpacity={0.45}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <ReferenceDot x={last.index} y={last.value} r={4} fill="var(--color-value)" stroke="var(--card)" strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  );
}

export function StatCard({ kpi }: { kpi: Kpi }) {
  const up = kpi.delta > 0;
  const good = kpi.delta === 0 ? null : up === kpi.upIsGood;
  const Arrow = up ? TrendingUp : TrendingDown;
  const sign = kpi.delta > 0 ? "+" : "";

  return (
    <Card>
      <CardHeader>
        <CardDescription className={cn("font-mono text-xs tracking-widest uppercase")}>{kpi.label}</CardDescription>
      </CardHeader>
      <CardContent>
        <Flex align="end" justify="between" gap="3">
          {/* Stat value: UI sans, proportional figures (dataviz figure rules) */}
          <CardTitle className={cn("font-sans text-3xl leading-none font-semibold")}>{kpi.value}</CardTitle>
          <Sparkline points={kpi.trend} label={kpi.label} />
        </Flex>
      </CardContent>
      <CardFooter className={cn("gap-1.5 border-dashed bg-transparent pt-3")}>
        <Text
          as="span"
          variant="small"
          weight="semibold"
          tone={good === null ? "muted" : good ? "success" : "destructive"}
          className={cn("flex items-center gap-1")}
        >
          <Arrow aria-hidden="true" className={cn("size-3.5")} />
          {sign}
          {kpi.delta}
          {kpi.deltaUnit === "pp" ? " pts" : "%"}
        </Text>
        <Text as="span" variant="small" tone="muted">
          {COMPARISON_LABEL}
        </Text>
      </CardFooter>
    </Card>
  );
}

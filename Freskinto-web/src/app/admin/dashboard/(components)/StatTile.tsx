import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMPARISON_LABEL, type Kpi } from "./dashboard-data";

const SPARK_W = 120;
const SPARK_H = 36;
const PAD = 5;

/** 12-point sparkline: de-emphasis line, current period ka dot accent (2px surface ring) */
function Sparkline({ points, label }: { points: number[]; label: string }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const coords = points.map((value, index) => [
    PAD + (index / (points.length - 1)) * (SPARK_W - PAD * 2),
    PAD + (1 - (value - min) / span) * (SPARK_H - PAD * 2),
  ]);
  const [lastX, lastY] = coords[coords.length - 1];

  return (
    <svg
      viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
      className="h-9 w-30 shrink-0 overflow-visible"
      role="img"
      aria-label={`${label}, 12-period trend`}
    >
      <polyline
        points={coords.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        className="stroke-muted-foreground/45"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={lastX} cy={lastY} r={4} className="fill-chart-1 stroke-card" strokeWidth={2} />
    </svg>
  );
}

export function StatTile({ kpi }: { kpi: Kpi }) {
  const up = kpi.delta > 0;
  const good = kpi.delta === 0 ? null : up === kpi.upIsGood;
  const Arrow = up ? TrendingUp : TrendingDown;
  const sign = kpi.delta > 0 ? "+" : "";

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border">
      <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
      <div className="flex items-end justify-between gap-3">
        {/* Stat value: UI sans, proportional figures (dataviz figure rules) */}
        <p className="font-sans text-3xl leading-none font-semibold tracking-tight">{kpi.value}</p>
        <Sparkline points={kpi.trend} label={kpi.label} />
      </div>
      <p className="flex items-center gap-1.5 text-xs">
        <span
          className={cn(
            "inline-flex items-center gap-1 font-semibold",
            good === null ? "text-muted-foreground" : good ? "text-success" : "text-destructive",
          )}
        >
          <Arrow className="size-3.5" aria-hidden="true" />
          {sign}
          {kpi.delta}
          {kpi.deltaUnit === "pp" ? " pts" : "%"}
        </span>
        <span className="text-muted-foreground">{COMPARISON_LABEL}</span>
      </p>
    </div>
  );
}

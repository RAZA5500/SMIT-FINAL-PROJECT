"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartCard } from "./ChartCard";
import { CATEGORY_SALES, DAILY, PERIOD_LABEL } from "./dashboard-data";

const gbp = (value: number) => `£${value.toLocaleString("en-GB")}`;

const revenueConfig = { revenue: { label: "Revenue", color: "var(--chart-1)" } } satisfies ChartConfig;

/** Tooltip row: value leads (strong), label follows (muted), line key — dataviz interaction rules */
function TooltipValue({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex w-full items-center gap-2">
      <span className="h-3 w-1 shrink-0 rounded-full bg-chart-1" aria-hidden="true" />
      <span className="font-semibold text-foreground tabular-nums">{gbp(value)}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

export function RevenueChart({ className }: { className?: string }) {
  const lastIndex = DAILY.length - 1;

  return (
    <ChartCard
      className={className}
      title="Revenue"
      subtitle={`${PERIOD_LABEL}, by day`}
      chart={
        <ChartContainer config={revenueConfig} className="aspect-auto h-64 w-full">
          <AreaChart data={DAILY} margin={{ top: 20, right: 16, left: 0, bottom: 0 }} accessibilityLayer>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis tickLine={false} axisLine={false} width={48} tickCount={4} tickFormatter={(value: number) => gbp(value)} />
            <ChartTooltip
              cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  formatter={(value) => <TooltipValue value={Number(value)} label="revenue" />}
                />
              }
            />
            <Area
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              fill="var(--color-revenue)"
              fillOpacity={0.1}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--card)" }}
            >
              {/* Direct label sirf aakhri point par (selective labelling) */}
              <LabelList
                dataKey="revenue"
                content={({ x, y, value, index }) =>
                  index === lastIndex ? (
                    <text
                      x={Number(x)}
                      y={Number(y) - 10}
                      textAnchor="end"
                      className="fill-foreground text-xs font-semibold"
                    >
                      {gbp(Number(value))}
                    </text>
                  ) : null
                }
              />
            </Area>
          </AreaChart>
        </ChartContainer>
      }
      table={
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead className="text-right">Orders</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DAILY.map((row) => (
              <TableRow key={row.day}>
                <TableCell>{row.day}</TableCell>
                <TableCell className="numeric text-right">{row.orders}</TableCell>
                <TableCell className="numeric text-right font-medium">{gbp(row.revenue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
    />
  );
}

export function CategorySalesChart({ className }: { className?: string }) {
  const total = CATEGORY_SALES.reduce((sum, row) => sum + row.revenue, 0);

  return (
    <ChartCard
      className={className}
      title="Sales by aisle"
      subtitle={PERIOD_LABEL}
      chart={
        <ChartContainer config={revenueConfig} className="aspect-auto h-64 w-full">
          <BarChart data={CATEGORY_SALES} layout="vertical" margin={{ top: 0, right: 52, left: 0, bottom: 0 }} accessibilityLayer>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="category" tickLine={false} axisLine={false} width={124} />
            <ChartTooltip
              cursor={{ fill: "var(--muted)" }}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, _name, item) => (
                    <TooltipValue value={Number(value)} label={String(item.payload.category)} />
                  )}
                />
              }
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 4, 4, 0]} barSize={20}>
              <LabelList
                dataKey="revenue"
                position="right"
                offset={8}
                className="fill-foreground text-xs font-semibold"
                formatter={(value) => gbp(Number(value))}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      }
      table={
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aisle</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CATEGORY_SALES.map((row) => (
              <TableRow key={row.category}>
                <TableCell>{row.category}</TableCell>
                <TableCell className="numeric text-right font-medium">{gbp(row.revenue)}</TableCell>
                <TableCell className="numeric text-right text-muted-foreground">
                  {Math.round((row.revenue / total) * 1000) / 10}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
    />
  );
}

"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, ReferenceDot, XAxis, YAxis } from "recharts";
import { Box } from "@/components/ui/box";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Flex } from "@/components/ui/flex";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { ChartCard } from "./ChartCard";
import { CATEGORY_SALES, DAILY, PERIOD_LABEL } from "./dashboard-data";

const gbp = (value: number) => `£${value.toLocaleString("en-GB")}`;

const revenueConfig = { revenue: { label: "Revenue", color: "var(--chart-1)" } } satisfies ChartConfig;

/** Tooltip row: value leads (strong), label follows (muted), line key — dataviz interaction rules */
function TooltipValue({ value, label }: { value: number; label: string }) {
  return (
    <Flex align="center" gap="2" className={cn("w-full")}>
      <Box as="span" aria-hidden="true" className={cn("h-3 w-1 shrink-0 rounded-full bg-chart-1")} />
      <Text as="span" weight="semibold" numeric className={cn("text-xs")}>
        {gbp(value)}
      </Text>
      <Text as="span" tone="muted" className={cn("text-xs")}>
        {label}
      </Text>
    </Flex>
  );
}

export function RevenueChart({ className }: { className?: string }) {
  const last = DAILY[DAILY.length - 1];

  return (
    <ChartCard
      className={cn(className)}
      title="Revenue"
      subtitle={`${PERIOD_LABEL}, by day`}
      chart={
        <ChartContainer config={revenueConfig} className={cn("aspect-auto h-64 w-full")}>
          <AreaChart data={DAILY} margin={{ top: 24, right: 16, left: 0, bottom: 0 }} accessibilityLayer>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis tickLine={false} axisLine={false} width={48} tickCount={4} tickFormatter={(value: number) => gbp(value)} />
            <ChartTooltip
              cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1 }}
              content={<ChartTooltipContent formatter={(value) => <TooltipValue value={Number(value)} label="revenue" />} />}
            />
            <Area
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              strokeWidth={2}
              fill="var(--color-revenue)"
              fillOpacity={0.08}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--card)" }}
            />
            {/* Direct label sirf aakhri point par (selective labelling) */}
            <ReferenceDot
              x={last.day}
              y={last.revenue}
              r={4}
              fill="var(--color-revenue)"
              stroke="var(--card)"
              strokeWidth={2}
              label={{ value: gbp(last.revenue), position: "top", offset: 10, fill: "var(--foreground)", fontSize: 12, fontWeight: 600 }}
            />
          </AreaChart>
        </ChartContainer>
      }
      table={
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead className={cn("text-right")}>Orders</TableHead>
              <TableHead className={cn("text-right")}>Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DAILY.map((row) => (
              <TableRow key={row.day}>
                <TableCell>{row.day}</TableCell>
                <TableCell className={cn("text-right tabular-nums")}>{row.orders}</TableCell>
                <TableCell className={cn("text-right font-medium tabular-nums")}>{gbp(row.revenue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
    />
  );
}

export function AisleSalesChart({ className }: { className?: string }) {
  const total = CATEGORY_SALES.reduce((sum, row) => sum + row.revenue, 0);

  return (
    <ChartCard
      className={cn(className)}
      title="Sales by aisle"
      subtitle={PERIOD_LABEL}
      chart={
        <ChartContainer config={revenueConfig} className={cn("aspect-auto h-64 w-full")}>
          <BarChart data={CATEGORY_SALES} layout="vertical" margin={{ top: 0, right: 52, left: 0, bottom: 0 }} accessibilityLayer>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="category" tickLine={false} axisLine={false} width={116} />
            <ChartTooltip
              cursor={{ fill: "var(--muted)" }}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, _name, item) => <TooltipValue value={Number(value)} label={String(item.payload.category)} />}
                />
              }
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 6, 6, 0]} barSize={20}>
              <LabelList
                dataKey="revenue"
                position="right"
                offset={8}
                className={cn("fill-foreground text-xs font-semibold")}
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
              <TableHead className={cn("text-right")}>Revenue</TableHead>
              <TableHead className={cn("text-right")}>Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CATEGORY_SALES.map((row) => (
              <TableRow key={row.category}>
                <TableCell>{row.category}</TableCell>
                <TableCell className={cn("text-right font-medium tabular-nums")}>{gbp(row.revenue)}</TableCell>
                <TableCell className={cn("text-right text-muted-foreground tabular-nums")}>
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

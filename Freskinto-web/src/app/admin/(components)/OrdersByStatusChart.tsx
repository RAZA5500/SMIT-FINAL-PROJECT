"use client";

import { BarChart3, Table2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ORDER_STATUS_LABELS } from "@/constants/labels";
import type { OrderStatus } from "@/constants/enums";

const CHART_CONFIG = {
  count: { label: "Orders", color: "var(--chart-1)" },
} satisfies ChartConfig;

/** Chart labels chhote — "Ready for Delivery" → "Ready (del.)" */
const SHORT_LABELS: Partial<Record<OrderStatus, string>> = {
  READY_FOR_PICKUP: "Ready (pickup)",
  READY_FOR_DELIVERY: "Ready (delivery)",
  REFUND_PENDING: "Refund pending",
};

interface OrdersByStatusChartProps {
  counts: { status: OrderStatus; count: number }[];
  isLoading: boolean;
}

/** Single-series bar chart (ek rang, legend nahi — title naam batata hai) + table view */
export function OrdersByStatusChart({ counts, isLoading }: OrdersByStatusChartProps) {
  const data = counts.map(({ status, count }) => ({
    status: SHORT_LABELS[status] ?? ORDER_STATUS_LABELS[status],
    count,
  }));

  return (
    <Tabs defaultValue="chart" className="gap-0">
      <Card className="gap-4 rounded-[1.5rem]">
        <CardHeader>
          <CardTitle>Orders by status</CardTitle>
          <CardDescription>Every order in the store, grouped by where it is now.</CardDescription>
          <CardAction>
            <TabsList>
              <TabsTrigger value="chart" aria-label="Chart view" className="px-2.5">
                <BarChart3 aria-hidden="true" />
              </TabsTrigger>
              <TabsTrigger value="table" aria-label="Table view" className="px-2.5">
                <Table2 aria-hidden="true" />
              </TabsTrigger>
            </TabsList>
          </CardAction>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-72 w-full rounded-2xl" />
          ) : (
            <>
              <TabsContent value="chart">
                {/* Horizontal bars — lambe status labels Y axis par poore parhe jate hain */}
                <ChartContainer config={CHART_CONFIG} className="h-72 w-full">
                  <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }} barCategoryGap="22%">
                    <CartesianGrid horizontal={false} strokeDasharray="3 4" />
                    <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                    <YAxis
                      type="category"
                      dataKey="status"
                      tickLine={false}
                      axisLine={false}
                      width={112}
                      interval={0}
                      fontSize={12}
                    />
                    <ChartTooltip cursor={{ fill: "var(--muted)", radius: 8 }} content={<ChartTooltipContent hideIndicator />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ChartContainer>
              </TabsContent>
              <TabsContent value="table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Orders</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {counts.map(({ status, count }) => (
                      <TableRow key={status}>
                        <TableCell>{ORDER_STATUS_LABELS[status]}</TableCell>
                        <TableCell className="text-right font-semibold tabular-nums">{count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </>
          )}
        </CardContent>
      </Card>
    </Tabs>
  );
}

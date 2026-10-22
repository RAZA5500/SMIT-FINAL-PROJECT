"use client";

import { ChartColumn, Table2 } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  /** Chart (visual) */
  chart: ReactNode;
  /** Same data as a table — har chart ka accessible twin */
  table: ReactNode;
  className?: string;
}

/** Chart container: title + chart/table tabs (table view sab values bina hover ke deta hai) */
export function ChartCard({ title, subtitle, chart, table, className }: ChartCardProps) {
  return (
    <Tabs defaultValue="chart" className={cn(className)}>
      <Card className={cn("h-full")}>
        <CardHeader>
          <CardTitle className={cn("font-sans text-base")}>{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
          <CardAction>
            <TabsList aria-label={`${title} view`} className={cn("rounded-full")}>
              <TabsTrigger value="chart" className={cn("rounded-full px-2.5")}>
                <ChartColumn aria-hidden="true" />
                Chart
              </TabsTrigger>
              <TabsTrigger value="table" className={cn("rounded-full px-2.5")}>
                <Table2 aria-hidden="true" />
                Table
              </TabsTrigger>
            </TabsList>
          </CardAction>
        </CardHeader>
        <CardContent>
          <TabsContent value="chart">{chart}</TabsContent>
          <TabsContent value="table">{table}</TabsContent>
        </CardContent>
      </Card>
    </Tabs>
  );
}

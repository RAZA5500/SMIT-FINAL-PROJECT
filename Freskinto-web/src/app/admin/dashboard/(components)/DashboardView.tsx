"use client";

import {
  ArrowUpRight,
  Boxes,
  FolderTree,
  Package,
  PackagePlus,
  ReceiptText,
  ShoppingBag,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Box } from "@/components/ui/box";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flex } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Text } from "@/components/ui/typography";
import { AdminPage } from "@/components/admin/AdminPage";
import { adminRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { ACTIVITY, KPIS, PERIOD_LABEL } from "./dashboard-data";
import { AisleSalesChart, RevenueChart } from "./DashboardCharts";
import { StatCard } from "./StatCard";

const ACTIVITY_ICONS: Record<(typeof ACTIVITY)[number]["kind"], LucideIcon> = {
  order: ShoppingBag,
  stock: Boxes,
  customer: UserPlus,
  product: Package,
};

/** Asli admin tools ke shortcuts (yeh links live pages par jaate hain) */
const QUICK_ACTIONS: { label: string; text: string; href: string; icon: LucideIcon }[] = [
  { label: "New product", text: "Add to a category", href: adminRoutes.productNew, icon: PackagePlus },
  { label: "Stock levels", text: "Adjust and restock", href: adminRoutes.inventory, icon: Boxes },
  { label: "Orders", text: "Process paid orders", href: adminRoutes.orders, icon: ReceiptText },
  { label: "Categories", text: "Organise the aisles", href: adminRoutes.categories, icon: FolderTree },
  { label: "Customers", text: "Manage accounts", href: adminRoutes.customers, icon: Users },
];

function greetingFor(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardView() {
  const user = useAuthStore((state) => state.user);
  // Ek dafa mount par — render ke dauran Date nahi
  const [greeting] = useState(() => greetingFor(new Date().getHours()));

  return (
    <AdminPage
      demo
      eyebrow="Overview"
      title={`${greeting}, ${user?.name?.split(" ")[0] ?? "there"}`}
      description={`Here's how the market is doing — ${PERIOD_LABEL.toLowerCase()}. Charts on this screen use sample data.`}
    >
      <Grid as="section" aria-label="Key figures" gap="4" className={cn("sm:grid-cols-2 xl:grid-cols-4")}>
        {KPIS.map((kpi) => (
          <StatCard key={kpi.key} kpi={kpi} />
        ))}
      </Grid>

      <Grid align="start" gap="4" className={cn("lg:grid-cols-3")}>
        <RevenueChart className={cn("lg:col-span-2")} />
        <AisleSalesChart />
      </Grid>

      <Grid align="start" gap="4" className={cn("lg:grid-cols-3")}>
        <Card className={cn("lg:col-span-2")}>
          <CardHeader>
            <CardTitle className={cn("font-sans text-base")}>Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ItemGroup className={cn("gap-0")}>
              {ACTIVITY.map((event, index) => {
                const Icon = ACTIVITY_ICONS[event.kind];
                return (
                  <Item key={`${event.title}-${index}`} size="sm" className={cn("relative px-0")}>
                    {index < ACTIVITY.length - 1 && (
                      <Box
                        aria-hidden="true"
                        className={cn("absolute top-12 bottom-0 left-4.5 border-l border-border")}
                      />
                    )}
                    <ItemMedia className={cn("size-9 rounded-full border border-primary/20 bg-icon-green text-brand-green [&_svg]:size-4")}>
                      <Icon aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent className={cn("min-w-0")}>
                      <ItemTitle className={cn("line-clamp-1")}>{event.title}</ItemTitle>
                      <ItemDescription>{event.detail}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Text as="span" variant="small" tone="muted" className={cn("text-xs font-medium")}>
                        {event.time}
                      </Text>
                    </ItemActions>
                  </Item>
                );
              })}
            </ItemGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={cn("font-sans text-base")}>Quick actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ItemGroup className={cn("gap-2")}>
              {QUICK_ACTIONS.map(({ label, text, href, icon: Icon }) => (
                <Item
                  key={href}
                  variant="muted"
                  render={<Link href={href} />}
                  className={cn("group/action rounded-xl hover:bg-accent")}
                >
                  <ItemMedia className={cn("size-9 rounded-lg bg-primary text-primary-foreground [&_svg]:size-4")}>
                    <Icon aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className={cn("font-semibold")}>{label}</ItemTitle>
                    <ItemDescription className={cn("text-xs")}>{text}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Flex className={cn("text-muted-foreground transition-transform group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5")}>
                      <ArrowUpRight aria-hidden="true" className={cn("size-4")} />
                    </Flex>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </CardContent>
        </Card>
      </Grid>
    </AdminPage>
  );
}

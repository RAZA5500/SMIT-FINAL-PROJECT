"use client";

import {
  ArrowRight,
  Boxes,
  Clock,
  FolderTree,
  PackagePlus,
  PackageX,
  ReceiptText,
  TriangleAlert,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/typography";
import { AdminPage } from "@/components/admin/AdminPage";
import { StatTile } from "@/components/admin/StatTile";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProductImage } from "@/components/shared/ProductImage";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { adminRoutes } from "@/lib/routes/routes";
import { cn, formatDateTime, formatMoney, initials } from "@/lib/utils";
import { useGetCustomers } from "@/services/customers/queries";
import { useGetInventory } from "@/services/inventory/queries";
import { useGetAdminOrders, useGetAdminOrderStatusCounts } from "@/services/orders/queries";
import { useAuthStore } from "@/stores/auth-store";
import { OrdersByStatusChart } from "./OrdersByStatusChart";

const RECENT_LIMIT = 5;

function greeting(): string {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

function RecentOrders() {
  const { data, isLoading } = useGetAdminOrders({ limit: RECENT_LIMIT });
  const orders = data?.data ?? [];

  return (
    <Card className="gap-3 rounded-3xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Latest orders</CardTitle>
        <CardDescription>The newest {RECENT_LIMIT} — open one to move it along.</CardDescription>
        <CardAction>
          <ButtonLink href={adminRoutes.orders} variant="ghost" size="sm" className="rounded-full text-primary">
            All orders
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Stack gap="2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-2xl" />
            ))}
          </Stack>
        ) : orders.length === 0 ? (
          <EmptyState icon={<ReceiptText aria-hidden="true" />} title="No orders yet" className="border-0 bg-transparent py-8" />
        ) : (
          <ItemGroup className="gap-1.5">
            {orders.map((order) => (
              <Item
                key={order.id}
                role="listitem"
                render={<Link href={adminRoutes.orderDetail(order.id)} />}
                className="rounded-2xl px-2.5"
              >
                <ItemMedia>
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-plum-soft text-xs font-semibold text-primary">
                      {initials(order.customer.name)}
                    </AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent className="min-w-0 gap-0.5">
                  <ItemTitle className="font-mono font-semibold">{order.orderNumber}</ItemTitle>
                  <ItemDescription className="line-clamp-1 text-fs-12">
                    {order.customer.name} · {formatDateTime(order.createdAt)}
                  </ItemDescription>
                </ItemContent>
                <ItemActions className="flex-col items-end gap-1">
                  <Text as="span" weight="bold" numeric>
                    {formatMoney(order.total)}
                  </Text>
                  <StatusBadge status={order.status} className="h-5 text-fs-11" />
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
}

function StockAlerts() {
  const low = useGetInventory({ limit: RECENT_LIMIT, stockStatus: "LOW_STOCK" });
  const out = useGetInventory({ limit: RECENT_LIMIT, stockStatus: "OUT_OF_STOCK" });
  const rows = [...(out.data?.data ?? []), ...(low.data?.data ?? [])].slice(0, RECENT_LIMIT);
  const isLoading = low.isLoading || out.isLoading;

  return (
    <Card className="gap-3 rounded-3xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Stock alerts</CardTitle>
        <CardDescription>Sold out first, then running low.</CardDescription>
        <CardAction>
          <ButtonLink href={adminRoutes.inventory} variant="ghost" size="sm" className="rounded-full text-primary">
            Inventory
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Stack gap="2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-2xl" />
            ))}
          </Stack>
        ) : rows.length === 0 ? (
          <EmptyState icon={<Boxes aria-hidden="true" />} title="All shelves stocked" className="border-0 bg-transparent py-8" />
        ) : (
          <ItemGroup className="gap-1.5">
            {rows.map((inventory) => {
              const scale = Math.max(1, inventory.lowStockThreshold * 3);
              const value = Math.min(100, Math.round((inventory.qtyOnHand / scale) * 100));
              return (
                <Item key={inventory.id} role="listitem" className="rounded-2xl px-2.5">
                  <ItemMedia className="overflow-hidden rounded-xl">
                    <ProductImage name={inventory.product.name} sizes="40px" className="size-10" imageClassName="p-1" />
                  </ItemMedia>
                  <ItemContent className="min-w-0 gap-1.5">
                    <ItemTitle className="font-semibold">{inventory.product.name}</ItemTitle>
                    <Progress
                      value={value}
                      aria-label={`${inventory.product.name} stock level`}
                      className={cn(
                        "w-full max-w-40",
                        inventory.stockStatus === "OUT_OF_STOCK"
                          ? "**:data-[slot=progress-indicator]:bg-destructive"
                          : "**:data-[slot=progress-indicator]:bg-warning",
                      )}
                    />
                  </ItemContent>
                  <ItemActions className="flex-col items-end gap-1">
                    <Text as="span" weight="bold" numeric>
                      {inventory.qtyOnHand} left
                    </Text>
                    <StatusBadge status={inventory.stockStatus} className="h-5 text-fs-11" />
                  </ItemActions>
                </Item>
              );
            })}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
}

/** Admin overview — KPI tiles (click = us screen par), status chart, latest orders, stock alerts */
export function AdminOverviewView() {
  const user = useAuthStore((state) => state.user);
  const { counts, isLoading: countsLoading } = useGetAdminOrderStatusCounts();
  const customers = useGetCustomers({ limit: 1 });
  const lowStock = useGetInventory({ limit: 1, stockStatus: "LOW_STOCK" });
  const outOfStock = useGetInventory({ limit: 1, stockStatus: "OUT_OF_STOCK" });
  const totalOrders = counts.reduce((sum, item) => sum + item.count, 0);
  const awaiting = counts.find((item) => item.status === "PENDING")?.count;
  const toPrepare = counts.find((item) => item.status === "CONFIRMED")?.count;

  return (
    <AdminPage
      eyebrow="Overview"
      title={`${greeting()}${user ? `, ${user.name.split(" ")[0]}` : ""}`}
      description="Here's how the market is doing right now."
      actions={
        <>
          <ButtonLink href={adminRoutes.categories} variant="outline" className="rounded-full">
            <FolderTree aria-hidden="true" />
            Categories
          </ButtonLink>
          <ButtonLink href={adminRoutes.productNew} className="rounded-full">
            <PackagePlus aria-hidden="true" />
            New product
          </ButtonLink>
        </>
      }
    >
      <Grid gap="4" className="sm:grid-cols-2 xl:grid-cols-4">
        <Link href={adminRoutes.orders} className="rounded-3xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40">
          <StatTile label="All orders" value={countsLoading ? undefined : totalOrders} hint={`${toPrepare ?? 0} waiting to be prepared`} icon={ReceiptText} tone="bg-lime text-lime-foreground" isLoading={countsLoading} />
        </Link>
        <Link href={adminRoutes.orders} className="rounded-3xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40">
          <StatTile label="Awaiting payment" value={awaiting} hint="Released if not paid in time" icon={Clock} tone="bg-warning-soft text-warning-ink" isLoading={countsLoading} />
        </Link>
        <Link href={adminRoutes.customers} className="rounded-3xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40">
          <StatTile label="Customers" value={customers.data?.meta.total} hint="Accounts in the store" icon={Users} tone="bg-plum-soft text-primary" isLoading={customers.isLoading} />
        </Link>
        <Link href={adminRoutes.inventory} className="rounded-3xl outline-none focus-visible:ring-3 focus-visible:ring-ring/40">
          <StatTile
            label="Stock alerts"
            value={lowStock.isLoading || outOfStock.isLoading ? undefined : (lowStock.data?.meta.total ?? 0) + (outOfStock.data?.meta.total ?? 0)}
            hint={`${outOfStock.data?.meta.total ?? 0} sold out · ${lowStock.data?.meta.total ?? 0} low`}
            icon={(outOfStock.data?.meta.total ?? 0) > 0 ? PackageX : TriangleAlert}
            tone="bg-destructive-soft text-destructive"
            isLoading={lowStock.isLoading || outOfStock.isLoading}
          />
        </Link>
      </Grid>

      <Grid gap="6" className="xl:grid-cols-5">
        <Stack className="xl:col-span-3">
          <OrdersByStatusChart counts={counts} isLoading={countsLoading} />
        </Stack>
        <Stack className="xl:col-span-2">
          <RecentOrders />
        </Stack>
      </Grid>

      <StockAlerts />
    </AdminPage>
  );
}

"use client";

import { Boxes, History, PackagePlus, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/typography";
import { AdminDataTable, AdminEmptyState, type AdminColumn } from "@/components/admin/AdminDataTable";
import { AdminFilterDropdown } from "@/components/admin/AdminFilterDropdown";
import { AdminPage } from "@/components/admin/AdminPage";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { Pagination } from "@/components/shared/Pagination";
import { ProductImage } from "@/components/shared/ProductImage";
import { SearchInput } from "@/components/shared/SearchInput";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { StockStatus } from "@/constants/enums";
import { ADMIN_PAGE_SIZE, STOCK_STATUS_OPTIONS } from "@/constants/filters";
import { cn, formatDateTime } from "@/lib/utils";
import { useGetInventory } from "@/services/inventory/queries";
import type { IInventory } from "@/services/inventory/types";
import { AddInventoryDialog } from "./AddInventoryDialog";
import { AdjustStockDialog } from "./AdjustStockDialog";
import { InventoryTableSkeleton } from "./InventoryTableSkeleton";
import { StockLedgerSheet } from "./StockLedgerSheet";
import { StockSummary } from "./StockSummary";

/** Meter fill severity batata hai (status label saath wale column mein) */
const METER_TONE: Record<StockStatus, string> = {
  IN_STOCK: "**:data-[slot=progress-indicator]:bg-success",
  LOW_STOCK: "**:data-[slot=progress-indicator]:bg-warning",
  OUT_OF_STOCK: "**:data-[slot=progress-indicator]:bg-destructive",
};

/** Qty ko threshold ke 3 guna tak scale — threshold se neeche bar chhoti aur rangeen */
function StockMeter({ inventory }: { inventory: IInventory }) {
  const scale = Math.max(1, inventory.lowStockThreshold * 3);
  const value = Math.min(100, Math.round((inventory.qtyOnHand / scale) * 100));
  return (
    <Flex align="center" gap="3">
      <Text as="span" weight="bold" numeric className="w-10 text-right text-base">
        {inventory.qtyOnHand}
      </Text>
      <Progress
        value={value}
        aria-label={`${inventory.product.name} stock level`}
        className={cn("w-20", METER_TONE[inventory.stockStatus])}
      />
    </Flex>
  );
}

export function InventoryView() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [stockStatus, setStockStatus] = useState<StockStatus | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [adjusting, setAdjusting] = useState<IInventory | null>(null);
  const [viewingLedger, setViewingLedger] = useState<IInventory | null>(null);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetInventory({
    page,
    limit: ADMIN_PAGE_SIZE,
    search: search.trim() || undefined,
    stockStatus: stockStatus ?? undefined,
  });

  const filterStatus = (status: StockStatus | null) => {
    setStockStatus(status);
    setPage(1);
  };

  const hasFilters = Boolean(search.trim() || stockStatus);

  const columns: AdminColumn<IInventory>[] = [
    {
      key: "product",
      header: "Product",
      className: "max-w-72",
      cell: (inventory) => (
        <Flex align="center" gap="3">
          <ProductImage
            name={inventory.product.name}
            sizes="44px"
            className="size-11 shrink-0 rounded-xl border border-border"
            imageClassName="p-1"
          />
          <Stack gap="0.5" className="min-w-0">
            <Flex align="center" gap="2">
              <Text weight="semibold" className="truncate">
                {inventory.product.name}
              </Text>
              {!inventory.product.isActive && <StatusBadge status="INACTIVE" />}
            </Flex>
            <Text tone="muted" family="mono" className="text-fs-12">
              {inventory.product.sku}
            </Text>
          </Stack>
        </Flex>
      ),
    },
    { key: "onHand", header: "On hand", cell: (inventory) => <StockMeter inventory={inventory} /> },
    {
      key: "threshold",
      header: "Low-stock at",
      align: "right",
      hideBelow: "md",
      className: "numeric text-muted-foreground",
      cell: (inventory) => inventory.lowStockThreshold,
    },
    { key: "status", header: "Status", cell: (inventory) => <StatusBadge status={inventory.stockStatus} /> },
    {
      key: "updated",
      header: "Last updated",
      hideBelow: "lg",
      className: "numeric text-muted-foreground",
      cell: (inventory) => formatDateTime(inventory.updatedAt),
    },
    {
      key: "actions",
      header: "Actions",
      srOnlyHeader: true,
      align: "right",
      cell: (inventory) => (
        <RowActionsMenu
          label={inventory.product.name}
          actions={[
            { label: "Adjust stock", icon: SlidersHorizontal, onSelect: () => setAdjusting(inventory) },
            { label: "Stock history", icon: History, onSelect: () => setViewingLedger(inventory) },
          ]}
        />
      ),
    },
  ];

  return (
    <AdminPage
      eyebrow="Catalogue"
      title="Inventory"
      description="Opening stock, adjustments and the movement ledger for every product."
      actions={
        <Button onClick={() => setAddOpen(true)}>
          <PackagePlus aria-hidden="true" />
          Add inventory
        </Button>
      }
    >
      <StockSummary active={stockStatus} onSelect={filterStatus} />

      <AdminDataTable
        caption="Inventory levels"
        columns={columns}
        rows={data?.data}
        getRowId={(inventory) => inventory.id}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorTitle="Couldn't load inventory"
        errorMessage={error?.message}
        onRetry={() => void refetch()}
        skeleton={<InventoryTableSkeleton />}
        emptyState={
          <AdminEmptyState
            icon={<Boxes aria-hidden="true" />}
            title={hasFilters ? "Nothing matches" : "No stock tracked yet"}
            message={hasFilters ? "Try a different search or stock level." : "Add opening stock for your products."}
          />
        }
        toolbar={
          <>
            <SearchInput
              value={search}
              onValueChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search by name or SKU…"
              className="w-full md:max-w-xs"
            />
            <AdminFilterDropdown
              id="inventory-stock-filter"
              label="Filter by stock level"
              allLabel="All stock levels"
              options={STOCK_STATUS_OPTIONS as { value: StockStatus; label: string }[]}
              value={stockStatus}
              onValueChange={filterStatus}
            />
          </>
        }
        footer={
          data && data.meta.total > 0 ? (
            <Pagination
              currentPage={data.meta.currentPage}
              totalPages={data.meta.pages}
              total={data.meta.total}
              limit={data.meta.limit}
              onPageChange={setPage}
              itemLabel="items"
            />
          ) : undefined
        }
      />

      <AddInventoryDialog open={addOpen} onOpenChange={setAddOpen} />
      <AdjustStockDialog inventory={adjusting} onOpenChange={(open) => !open && setAdjusting(null)} />
      <StockLedgerSheet inventory={viewingLedger} onOpenChange={(open) => !open && setViewingLedger(null)} />
    </AdminPage>
  );
}

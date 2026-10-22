"use client";

import { Boxes, History, PackagePlus, SlidersHorizontal } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Text } from "@/components/ui/typography";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTableCard, ToolbarFilters } from "@/components/admin/DataTableCard";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { ProductImage } from "@/components/shared/ProductImage";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { STOCK_STATUSES, type StockStatus } from "@/constants/enums";
import { STOCK_STATUS_LABELS } from "@/constants/labels";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useGetInventory } from "@/services/inventory/queries";
import type { IInventory } from "@/services/inventory/types";
import { AddInventoryDialog } from "./AddInventoryDialog";
import { AdjustStockDialog } from "./AdjustStockDialog";
import { StockLedgerSheet } from "./StockLedgerSheet";
import { StockSummary } from "./StockSummary";

const PAGE_SIZE = 10;
const ALL = "ALL";

const STOCK_OPTIONS = [
  { value: ALL, label: "All stock levels" },
  ...STOCK_STATUSES.map((status) => ({ value: status, label: STOCK_STATUS_LABELS[status] })),
];

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
      <Text as="span" size="base" weight="semibold" numeric className={cn("w-10 text-right")}>
        {inventory.qtyOnHand}
      </Text>
      <Progress
        value={value}
        aria-label={`${inventory.product.name} stock level`}
        className={cn("w-20 **:data-[slot=progress-track]:h-1.5", METER_TONE[inventory.stockStatus])}
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

  const debouncedSearch = useDebounce(search.trim());
  const { data, isLoading, isFetching, isError, error, refetch } = useGetInventory({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    stockStatus: stockStatus ?? undefined,
  });

  const filterStatus = (status: StockStatus | null) => {
    setStockStatus(status);
    setPage(1);
  };

  let content: ReactNode;
  if (isLoading) {
    content = <TableSkeleton columns={5} />;
  } else if (isError) {
    content = <ErrorState title="Couldn't load inventory" message={error.message} onRetry={() => void refetch()} />;
  } else if (!data?.data.length) {
    content = (
      <EmptyState
        icon={<Boxes aria-hidden="true" />}
        title={debouncedSearch || stockStatus ? "Nothing matches" : "No stock tracked yet"}
        message={debouncedSearch || stockStatus ? "Try a different search or stock level." : "Add opening stock for your products."}
      />
    );
  } else {
    content = (
      <Table className={cn("min-w-200")}>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>On hand</TableHead>
            <TableHead className={cn("text-right")}>Low-stock at</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last updated</TableHead>
            <TableHead className={cn("w-12")}>
              <Text as="span" className={cn("sr-only")}>
                Actions
              </Text>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((inventory) => (
            <TableRow key={inventory.id}>
              <TableCell className={cn("max-w-72")}>
                <Flex align="center" gap="3">
                  <ProductImage
                    name={inventory.product.name}
                    sizes="44px"
                    className={cn("size-11 shrink-0 rounded-lg border")}
                    imageClassName={cn("p-1")}
                  />
                  <Stack gap="0.5" className={cn("min-w-0")}>
                    <Flex align="center" gap="2">
                      <Text weight="semibold" className={cn("truncate")}>
                        {inventory.product.name}
                      </Text>
                      {!inventory.product.isActive && <StatusBadge status="INACTIVE" />}
                    </Flex>
                    <Text variant="code" tone="muted">
                      {inventory.product.sku}
                    </Text>
                  </Stack>
                </Flex>
              </TableCell>
              <TableCell>
                <StockMeter inventory={inventory} />
              </TableCell>
              <TableCell className={cn("text-right text-muted-foreground tabular-nums")}>{inventory.lowStockThreshold}</TableCell>
              <TableCell>
                <StatusBadge status={inventory.stockStatus} />
              </TableCell>
              <TableCell className={cn("text-muted-foreground tabular-nums")}>{formatDateTime(inventory.updatedAt)}</TableCell>
              <TableCell>
                <RowActionsMenu
                  label={inventory.product.name}
                  actions={[
                    { label: "Adjust stock", icon: SlidersHorizontal, onSelect: () => setAdjusting(inventory) },
                    { label: "Stock history", icon: History, onSelect: () => setViewingLedger(inventory) },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <AdminPage
      eyebrow="Inventory"
      title="Stock levels"
      description="Opening stock, adjustments and the movement ledger for every product."
      actions={
        <Button onClick={() => setAddOpen(true)}>
          <PackagePlus data-icon="inline-start" aria-hidden="true" />
          Add inventory
        </Button>
      }
    >
      <StockSummary active={stockStatus} onSelect={filterStatus} />

      <DataTableCard
        busy={isFetching && !isLoading}
        toolbar={
          <>
            <SearchInput
              value={search}
              onValueChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search by name or SKU…"
              className={cn("w-full md:max-w-xs")}
            />
            <ToolbarFilters>
              <SelectField
                id="inventory-stock-filter"
                aria-label="Filter by stock level"
                size="sm"
                options={STOCK_OPTIONS}
                value={stockStatus ?? ALL}
                onValueChange={(value) => filterStatus(!value || value === ALL ? null : (value as StockStatus))}
                containerClassName={cn("w-44")}
              />
            </ToolbarFilters>
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
      >
        {content}
      </DataTableCard>

      <AddInventoryDialog open={addOpen} onOpenChange={setAddOpen} />
      <AdjustStockDialog inventory={adjusting} onOpenChange={(open) => !open && setAdjusting(null)} />
      <StockLedgerSheet inventory={viewingLedger} onOpenChange={(open) => !open && setViewingLedger(null)} />
    </AdminPage>
  );
}

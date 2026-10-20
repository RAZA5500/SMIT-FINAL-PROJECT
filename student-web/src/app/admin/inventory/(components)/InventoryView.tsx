"use client";

import { History, SlidersHorizontal } from "lucide-react";
import { useState, type ReactNode } from "react";
import AdminListPage, {
  ADMIN_FILTER_FIELD_CLASS,
  ADMIN_SEARCH_FIELD_CLASS,
  FilterIcon,
  PrimaryAction,
  TD_CLASS,
  TH_CENTER_CLASS,
  TH_CLASS,
  TR_STATIC_CLASS,
} from "@/components/admin/AdminListPage";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { STOCK_STATUSES, type StockStatus } from "@/constants/enums";
import { STOCK_STATUS_LABELS } from "@/constants/labels";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useGetInventory } from "@/services/inventory/queries";
import type { IInventory } from "@/services/inventory/types";
import { AddInventoryDialog } from "./AddInventoryDialog";
import { AdjustStockDialog } from "./AdjustStockDialog";
import { StockLedgerDialog } from "./StockLedgerDialog";

const PAGE_SIZE = 10;
const ALL = "ALL";

const STOCK_OPTIONS = [
  { value: ALL, label: "All stock levels" },
  ...STOCK_STATUSES.map((status) => ({ value: status, label: STOCK_STATUS_LABELS[status] })),
];

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

  const toolbar = (
    <>
      <SearchInput
        value={search}
        onValueChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Search by product name or SKU..."
        className="max-w-search"
        inputClassName={ADMIN_SEARCH_FIELD_CLASS}
      />
      <div className="ml-auto flex shrink-0 flex-wrap items-center gap-3">
        <FilterIcon />
        <SelectField
          id="inventory-stock-filter"
          options={STOCK_OPTIONS}
          value={stockStatus ?? ALL}
          onValueChange={(value) => {
            setStockStatus(!value || value === ALL ? null : (value as StockStatus));
            setPage(1);
          }}
          className={ADMIN_FILTER_FIELD_CLASS}
        />
        <PrimaryAction label="Add Inventory" onClick={() => setAddOpen(true)} />
      </div>
    </>
  );

  let content: ReactNode;
  if (isLoading) {
    content = <TableSkeleton columns={6} />;
  } else if (isError) {
    content = <ErrorState title="Couldn't load inventory" message={error.message} onRetry={() => void refetch()} />;
  } else if (!data?.data.length) {
    content = (
      <EmptyState
        title="No inventory found"
        message={debouncedSearch || stockStatus ? "Try different filters." : "Add opening stock for your products."}
      />
    );
  } else {
    content = (
      <Table className={cn("min-w-200", isFetching && "opacity-60 transition-opacity")}>
        <TableHeader>
          <TableRow className="border-gray-200">
            <TableHead className={TH_CLASS}>Product</TableHead>
            <TableHead className={TH_CENTER_CLASS}>On hand</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Low-stock threshold</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Stock status</TableHead>
            <TableHead className={TH_CLASS}>Last updated</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((inventory) => (
            <TableRow key={inventory.id} className={TR_STATIC_CLASS}>
              <TableCell className={cn(TD_CLASS, "max-w-64")}>
                <p className="flex items-center gap-2 truncate font-semibold text-body-text">
                  {inventory.product.name}
                  {!inventory.product.isActive && <StatusBadge status="INACTIVE" />}
                </p>
                <p className="text-sm font-light text-gray-500">SKU: {inventory.product.sku}</p>
              </TableCell>
              <TableCell className={cn(TD_CLASS, "text-center text-base font-semibold text-gray-900")}>
                {inventory.qtyOnHand}
              </TableCell>
              <TableCell className={cn(TD_CLASS, "text-center")}>{inventory.lowStockThreshold}</TableCell>
              <TableCell className={cn(TD_CLASS, "text-center")}>
                <StatusBadge status={inventory.stockStatus} />
              </TableCell>
              <TableCell className={cn(TD_CLASS, "text-gray-500")}>{formatDateTime(inventory.updatedAt)}</TableCell>
              <TableCell className={TD_CLASS}>
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
    <>
      <AdminListPage
        toolbar={toolbar}
        responsiveToolbar
        total={data?.meta.total ?? 0}
        page={data?.meta.currentPage ?? page}
        pageSize={data?.meta.limit ?? PAGE_SIZE}
        onPageChange={setPage}
        noun="items"
      >
        {content}
      </AdminListPage>

      <AddInventoryDialog open={addOpen} onOpenChange={setAddOpen} />
      <AdjustStockDialog inventory={adjusting} onOpenChange={(open) => !open && setAdjusting(null)} />
      <StockLedgerDialog inventory={viewingLedger} onOpenChange={(open) => !open && setViewingLedger(null)} />
    </>
  );
}

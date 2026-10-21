"use client";

import { ArrowRight, History } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTableCard, ToolbarFilters } from "@/components/admin/DataTableCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge, type StatusTone } from "@/components/shared/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { STOCK_DECREASING_TRANSACTIONS, TRANSACTION_TYPES, type TransactionType } from "@/constants/enums";
import { ADJUSTMENT_REASON_LABELS, TRANSACTION_TYPE_LABELS } from "@/constants/labels";
import { TRANSACTIONS } from "@/data/admin";
import { useClientPages } from "@/hooks/useClientPages";
import { adminRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;
const ALL = "ALL";

const TYPE_TONES: Record<TransactionType, StatusTone> = {
  RECEIVED: "success",
  ADJUSTMENT_INCREASE: "info",
  ADJUSTMENT_DECREASE: "warning",
  CONSUMED: "progress",
  RELEASED: "neutral",
};

const TYPE_OPTIONS = [
  { value: ALL, label: "All movements" },
  ...TRANSACTION_TYPES.map((type) => ({ value: type, label: TRANSACTION_TYPE_LABELS[type] })),
];

export function StockMovementsView() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState(ALL);

  const term = search.trim().toLowerCase();
  const rows = TRANSACTIONS.filter(
    (row) =>
      (type === ALL || row.type === type) &&
      (!term || row.product.toLowerCase().includes(term) || row.reference?.toLowerCase().includes(term)),
  );
  const { currentPage, totalPages, setPage, pageRows } = useClientPages(rows, PAGE_SIZE);

  return (
    <AdminPage
      demo
      title="Stock movements"
      description="Every change to stock across the store — deliveries, order reservations, cancellations and manual adjustments. Each product's real history is on Stock levels."
      actions={
        <Link href={adminRoutes.inventory} className={buttonVariants({ variant: "outline" })}>
          Stock levels
          <ArrowRight aria-hidden="true" />
        </Link>
      }
    >
      <DataTableCard
        toolbar={
          <>
            <SearchInput
              value={search}
              onValueChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Product or order number…"
              className="w-full md:max-w-xs"
            />
            <ToolbarFilters>
              <SelectField
                id="movement-type-filter"
                aria-label="Filter by movement"
                size="sm"
                options={TYPE_OPTIONS}
                value={type}
                onValueChange={(value) => {
                  setType(value ?? ALL);
                  setPage(1);
                }}
                containerClassName="w-44"
              />
            </ToolbarFilters>
          </>
        }
        footer={
          rows.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              total={rows.length}
              limit={PAGE_SIZE}
              onPageChange={setPage}
              itemLabel="movements"
            />
          ) : undefined
        }
      >
        {rows.length === 0 ? (
          <EmptyState
            icon={<History aria-hidden="true" />}
            title="No movements match"
            message="Try another product or movement type."
          />
        ) : (
          <Table className="min-w-200">
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Movement</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead>Reason or order</TableHead>
                <TableHead>By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((row) => {
                const decrease = STOCK_DECREASING_TRANSACTIONS.includes(row.type);
                return (
                  <TableRow key={`${row.at}-${row.product}-${row.type}`}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{row.at}</TableCell>
                    <TableCell className="font-semibold">{row.product}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.type} label={TRANSACTION_TYPE_LABELS[row.type]} tone={TYPE_TONES[row.type]} />
                    </TableCell>
                    <TableCell
                      className={cn("numeric text-right font-semibold", decrease ? "text-destructive" : "text-success")}
                    >
                      {decrease ? "−" : "+"}
                      {row.quantity}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.reason ? ADJUSTMENT_REASON_LABELS[row.reason] : (row.reference ?? "—")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.performedBy}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </DataTableCard>
    </AdminPage>
  );
}

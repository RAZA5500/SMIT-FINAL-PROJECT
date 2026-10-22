"use client";

import { useState, type ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Stack } from "@/components/ui/flex";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Text } from "@/components/ui/typography";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { STOCK_DECREASING_TRANSACTIONS } from "@/constants/enums";
import { ADMIN_PAGE_SIZE } from "@/constants/filters";
import { ADJUSTMENT_REASON_LABELS, TRANSACTION_TYPE_LABELS } from "@/constants/labels";
import { cn, formatDateTime } from "@/lib/utils";
import { useGetInventoryTransactions } from "@/services/inventory/queries";
import type { IInventory } from "@/services/inventory/types";

interface StockLedgerSheetProps {
  inventory: IInventory | null;
  onOpenChange: (open: boolean) => void;
}

/** Stock history — right drawer, table stays next to the stock list */
export function StockLedgerSheet({ inventory, onOpenChange }: StockLedgerSheetProps) {
  return (
    <Sheet open={inventory !== null} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="gap-0 p-0 data-[side=right]:sm:max-w-2xl">
        {inventory && <StockLedger inventory={inventory} />}
      </SheetContent>
    </Sheet>
  );
}

function StockLedger({ inventory }: { inventory: IInventory }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, error, refetch } = useGetInventoryTransactions(inventory.id, {
    page,
    limit: ADMIN_PAGE_SIZE,
  });

  let content: ReactNode;
  if (isLoading) {
    content = <TableSkeleton columns={5} rows={4} />;
  } else if (isError) {
    content = <ErrorState title="Couldn't load stock history" message={error.message} onRetry={() => void refetch()} />;
  } else if (!data?.data.length) {
    content = <EmptyState title="No stock movements yet" />;
  } else {
    content = (
      <Stack gap="4">
        <Table className={cn(isFetching && "opacity-60 transition-opacity")}>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((transaction) => {
              const decrease = STOCK_DECREASING_TRANSACTIONS.includes(transaction.type);
              return (
                <TableRow key={transaction.id}>
                  <TableCell className="numeric text-muted-foreground">{formatDateTime(transaction.createdAt)}</TableCell>
                  <TableCell>{TRANSACTION_TYPE_LABELS[transaction.type]}</TableCell>
                  <TableCell className={cn("numeric text-right font-semibold", decrease ? "text-destructive" : "text-success-ink")}>
                    {decrease ? "−" : "+"}
                    {transaction.quantity}
                  </TableCell>
                  <TableCell>{transaction.reason ? ADJUSTMENT_REASON_LABELS[transaction.reason] : "—"}</TableCell>
                  <TableCell className="max-w-48 truncate text-muted-foreground">
                    {transaction.orderNumber ?? transaction.note ?? "—"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Pagination
          currentPage={data.meta.currentPage}
          totalPages={data.meta.pages}
          total={data.meta.total}
          limit={data.meta.limit}
          onPageChange={setPage}
          itemLabel="movements"
        />
      </Stack>
    );
  }

  return (
    <>
      <SheetHeader className="border-b border-border px-6 py-5">
        <SheetTitle>Stock history</SheetTitle>
        <SheetDescription>
          {inventory.product.name} ·{" "}
          <Text as="span" tone="inherit" family="mono" className="text-fs-12">
            {inventory.product.sku}
          </Text>{" "}
          ·{" "}
          {inventory.qtyOnHand} in stock
        </SheetDescription>
      </SheetHeader>
      <Box className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{content}</Box>
    </>
  );
}

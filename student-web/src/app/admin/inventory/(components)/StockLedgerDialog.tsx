"use client";

import { useState, type ReactNode } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { STOCK_DECREASING_TRANSACTIONS } from "@/constants/enums";
import { ADJUSTMENT_REASON_LABELS, TRANSACTION_TYPE_LABELS } from "@/constants/labels";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useGetInventoryTransactions } from "@/services/inventory/queries";
import type { IInventory } from "@/services/inventory/types";

const PAGE_SIZE = 10;

interface StockLedgerDialogProps {
  inventory: IInventory | null;
  onOpenChange: (open: boolean) => void;
}

export function StockLedgerDialog({ inventory, onOpenChange }: StockLedgerDialogProps) {
  return (
    <Dialog open={inventory !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        {inventory && <StockLedger inventory={inventory} />}
      </DialogContent>
    </Dialog>
  );
}

function StockLedger({ inventory }: { inventory: IInventory }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, error, refetch } = useGetInventoryTransactions(inventory.id, {
    page,
    limit: PAGE_SIZE,
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
      <div className="flex flex-col gap-4">
        <Table className={cn(isFetching && "opacity-60 transition-opacity")}>
          <TableHeader>
            <TableRow>
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
                  <TableCell className="text-muted-foreground">{formatDateTime(transaction.createdAt)}</TableCell>
                  <TableCell>{TRANSACTION_TYPE_LABELS[transaction.type]}</TableCell>
                  <TableCell
                    className={cn("text-right font-semibold", decrease ? "text-destructive" : "text-success")}
                  >
                    {decrease ? "−" : "+"}
                    {transaction.quantity}
                  </TableCell>
                  <TableCell>{transaction.reason ? ADJUSTMENT_REASON_LABELS[transaction.reason] : "—"}</TableCell>
                  <TableCell className="max-w-56 truncate text-muted-foreground">
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
      </div>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Stock history</DialogTitle>
        <DialogDescription>
          {inventory.product.name} ({inventory.product.sku}) — {inventory.qtyOnHand} in stock
        </DialogDescription>
      </DialogHeader>
      {content}
    </>
  );
}

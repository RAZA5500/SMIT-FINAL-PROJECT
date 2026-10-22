import { TableSkeleton } from "@/components/shared/TableSkeleton";

/** Inventory table ka initial loading (6 columns) */
export function InventoryTableSkeleton() {
  return <TableSkeleton columns={6} />;
}

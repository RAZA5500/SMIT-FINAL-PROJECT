import { TableSkeleton } from "@/components/shared/TableSkeleton";

/** Admin orders table ka initial loading (8 columns) */
export function OrderTableSkeleton() {
  return <TableSkeleton columns={8} />;
}

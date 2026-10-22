import { TableSkeleton } from "@/components/shared/TableSkeleton";

/** Categories table ka initial loading (7 columns) */
export function CategoryTableSkeleton() {
  return <TableSkeleton columns={7} />;
}

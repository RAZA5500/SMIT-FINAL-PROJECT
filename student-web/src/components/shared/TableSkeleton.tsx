import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns: number;
}

/** Loading state skeleton — "Loading..." text nahi (FLOW-MD 07 §7) */
export function TableSkeleton({ rows = 5, columns }: TableSkeletonProps) {
  return (
    <div className="flex flex-col gap-3 p-5" aria-label="Loading" aria-busy="true">
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }, (_, col) => (
            <Skeleton key={col} className="h-6" />
          ))}
        </div>
      ))}
    </div>
  );
}

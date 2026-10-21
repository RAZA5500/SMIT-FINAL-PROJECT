import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns: number;
}

/** Loading state skeleton — "Loading..." text nahi (FLOW-MD 07 §7) */
export function TableSkeleton({ rows = 5, columns }: TableSkeletonProps) {
  return (
    <div className="flex flex-col divide-y divide-border" aria-label="Loading" aria-busy="true">
      {Array.from({ length: rows }, (_, row) => (
        <div
          key={row}
          className="grid items-center gap-4 px-4 py-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }, (_, col) => (
            <Skeleton key={col} className={col === 0 ? "h-5 w-4/5" : "h-4 w-3/5"} />
          ))}
        </div>
      ))}
    </div>
  );
}

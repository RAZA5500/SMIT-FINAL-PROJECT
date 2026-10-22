import { Box } from "@/components/ui/box";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface TableSkeletonProps {
  rows?: number;
  columns: number;
}

/** Loading state skeleton — "Loading..." text nahi (FLOW-MD 07 §7) */
export function TableSkeleton({ rows = 5, columns }: TableSkeletonProps) {
  return (
    <Box aria-label="Loading" aria-busy="true">
      <Table>
        <TableBody>
          {Array.from({ length: rows }, (_, row) => (
            <TableRow key={row} className="hover:bg-transparent">
              {Array.from({ length: columns }, (_, col) => (
                <TableCell key={col} className="py-4">
                  <Skeleton className={col === 0 ? "h-5 w-4/5" : "h-4 w-3/5"} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

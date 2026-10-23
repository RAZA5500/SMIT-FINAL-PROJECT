import type { ReactNode } from "react";
import { Box } from "@/components/ui/box";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Flex } from "@/components/ui/flex";
import { cn } from "@/lib/utils";

interface DataTableCardProps {
  /** Search + filters + actions row */
  toolbar?: ReactNode;
  /** Table, ya loading/empty/error state */
  children: ReactNode;
  /** Pagination (khali list par mat bhejo) */
  footer?: ReactNode;
  /** Data refetch ho raha ho (keepPreviousData) — halka fade */
  busy?: boolean;
  className?: string;
}

/** Admin list screens ka card: toolbar → table → pagination */
export function DataTableCard({ toolbar, children, footer, busy = false, className }: DataTableCardProps) {
  return (
    <Card aria-busy={busy || undefined} className={cn("min-w-0 gap-0 rounded-[1.5rem] py-0", className)}>
      {toolbar && (
        <CardHeader className={cn("flex flex-wrap items-center gap-3 border-b py-4")}>{toolbar}</CardHeader>
      )}
      {/* relative: andar ke sr-only labels isi scroll box mein clip hon, page chaura na ho */}
      <Box className={cn("relative min-w-0 overflow-x-auto", busy && "opacity-60 transition-opacity")}>{children}</Box>
      {footer && <CardFooter className={cn("block py-3")}>{footer}</CardFooter>}
    </Card>
  );
}

/** Toolbar filters ka group — chhoti screen par wrap */
export function ToolbarFilters({ children }: { children: ReactNode }) {
  return (
    <Flex wrap align="center" gap="2" className="md:ml-auto">
      {children}
    </Flex>
  );
}

"use client";

import type { ReactNode } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Flex } from "@/components/ui/flex";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const HIDE_BELOW = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
} as const;

export interface AdminColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
  /** Chhoti screens par yeh column chhup jata hai (table phir bhi side scroll karta hai) */
  hideBelow?: keyof typeof HIDE_BELOW;
  className?: string;
  /** Screen-reader-only header (actions column) */
  srOnlyHeader?: boolean;
}

interface AdminDataTableProps<T> {
  columns: AdminColumn<T>[];
  rows: T[] | undefined;
  getRowId: (row: T) => string;
  isLoading?: boolean;
  /** Background refetch — table blank nahi hota, upar patli progress line aati hai */
  isFetching?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  /** Initial loading — dedicated skeleton component (e.g. `<ProductTableSkeleton />`) */
  skeleton: ReactNode;
  /** Zero rows ka state */
  emptyState: ReactNode;
  /** Filters / search bar (table ke upar) */
  toolbar?: ReactNode;
  /** Pagination (table ke neeche) */
  footer?: ReactNode;
  caption: string;
  errorTitle?: string;
  className?: string;
}

const ALIGN = { left: "text-left", right: "text-right", center: "text-center" } as const;

/**
 * Precision data table: hairline rows, sticky-feel header, har state ek jagah (loading skeleton,
 * error, empty, refetch). Mobile par horizontal scroll (Table wrapper) + `hideBelow` columns.
 */
export function AdminDataTable<T>({
  columns,
  rows,
  getRowId,
  isLoading = false,
  isFetching = false,
  isError = false,
  errorMessage,
  onRetry,
  skeleton,
  emptyState,
  toolbar,
  footer,
  caption,
  errorTitle = "Couldn't load data",
  className,
}: AdminDataTableProps<T>) {
  let body: ReactNode;
  if (isLoading) {
    body = skeleton;
  } else if (isError) {
    body = <ErrorState title={errorTitle} message={errorMessage} onRetry={onRetry} className="border-0" />;
  } else if (!rows?.length) {
    body = <Box className="p-4">{emptyState}</Box>;
  } else {
    body = (
      <Table className="min-w-160">
        <TableCaption className="sr-only">{caption}</TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  ALIGN[column.align ?? "left"],
                  column.hideBelow && HIDE_BELOW[column.hideBelow],
                  column.className,
                )}
              >
                {column.srOnlyHeader ? (
                  <Text as="span" className="sr-only">
                    {column.header}
                  </Text>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={getRowId(row)}>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  className={cn(
                    ALIGN[column.align ?? "left"],
                    column.hideBelow && HIDE_BELOW[column.hideBelow],
                    column.className,
                  )}
                >
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Card
      render={<Box as="section" />}
      aria-busy={isFetching || undefined}
      className={cn("relative gap-0 rounded-3xl py-0", className)}
    >
      {/* Subtle isFetching indicator */}
      <Box
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden bg-transparent transition-opacity",
          isFetching && !isLoading ? "opacity-100" : "opacity-0",
        )}
      >
        <Box className="h-full w-1/3 animate-pulse bg-tangerine" />
      </Box>

      {toolbar && (
        <Flex
          direction="col"
          gap="3"
          className="border-b border-border p-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-4"
        >
          {toolbar}
        </Flex>
      )}
      <Box className={cn(isFetching && !isLoading && "opacity-70 transition-opacity")}>{body}</Box>
      {footer && <Box className="border-t border-border p-3 sm:p-4">{footer}</Box>}
    </Card>
  );
}

/** Table ke andar khali / filter-miss ka standard state */
export function AdminEmptyState({ icon, title, message, action }: { icon: ReactNode; title: string; message: string; action?: ReactNode }) {
  return <EmptyState icon={icon} title={title} message={message} action={action} className="border-0 bg-transparent py-10" />;
}

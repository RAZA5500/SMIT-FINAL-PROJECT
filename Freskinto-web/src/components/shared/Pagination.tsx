"use client";

import {
  Pagination as PaginationRoot,
  PaginationButton,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  className?: string;
}

const MAX_PAGE_BUTTONS = 5;

/** Current page ke aas paas zyada se zyada 5 page numbers */
function visiblePages(current: number, total: number): number[] {
  const half = Math.floor(MAX_PAGE_BUTTONS / 2);
  const start = Math.max(1, Math.min(current - half, total - MAX_PAGE_BUTTONS + 1));
  const end = Math.min(total, start + MAX_PAGE_BUTTONS - 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/** Har list ka footer: "Showing 1-10 of 25" + page buttons (FLOW-MD 07 §3) */
export function Pagination({
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange,
  itemLabel = "items",
  className,
}: PaginationProps) {
  if (total === 0) return null;

  const first = (currentPage - 1) * limit + 1;
  const last = Math.min(currentPage * limit, total);

  return (
    <Flex wrap align="center" justify="between" gap="3" className={cn(className)}>
      <Text tone="muted" className="text-fs-13">
        Showing{" "}
        <Text as="span" weight="semibold" numeric>
          {`${first}-${last}`}
        </Text>{" "}
        of{" "}
        <Text as="span" weight="semibold" numeric>
          {total}
        </Text>{" "}
        {itemLabel}
      </Text>
      <PaginationRoot className="w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)} />
          </PaginationItem>
          {visiblePages(currentPage, totalPages).map((page) => (
            <PaginationItem key={page}>
              <PaginationButton isActive={page === currentPage} onClick={() => onPageChange(page)}>
                {page}
              </PaginationButton>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)} />
          </PaginationItem>
        </PaginationContent>
      </PaginationRoot>
    </Flex>
  );
}

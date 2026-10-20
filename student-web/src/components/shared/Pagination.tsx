"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <nav
      aria-label="Pagination"
      className={cn("flex flex-wrap items-center justify-between gap-3", className)}
    >
      <p className="text-sm text-gray-500">
        Showing <span className="font-semibold text-gray-800">{`${first}-${last}`}</span> of{" "}
        <span className="font-semibold text-gray-800">{total}</span> {itemLabel}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Previous page"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft />
        </Button>
        {visiblePages(currentPage, totalPages).map((page) => (
          <Button
            key={page}
            size="icon-sm"
            variant={page === currentPage ? "cta" : "ghost"}
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Next page"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
    </nav>
  );
}

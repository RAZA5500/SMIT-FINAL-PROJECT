import { useState } from "react";

/** Local list ko pages mein baanto (sample screens) — filter se pages kam hon to page clamp ho jata hai */
export function useClientPages<T>(rows: readonly T[], pageSize = 10) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  return {
    currentPage,
    totalPages,
    setPage,
    pageRows: rows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
  };
}

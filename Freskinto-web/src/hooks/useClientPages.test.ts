import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useClientPages } from "./useClientPages";

describe("useClientPages", () => {
  it("slices rows into pages and clamps when the list shrinks", () => {
    const rows = Array.from({ length: 23 }, (_, i) => i);
    const { result, rerender } = renderHook(({ list }) => useClientPages(list, 10), {
      initialProps: { list: rows },
    });

    expect(result.current.totalPages).toBe(3);
    act(() => result.current.setPage(3));
    expect(result.current.pageRows).toEqual([20, 21, 22]);

    // Filter ne list chhoti kar di — khali page nahi, aakhri valid page
    rerender({ list: rows.slice(0, 5) });
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageRows).toEqual([0, 1, 2, 3, 4]);
  });
});

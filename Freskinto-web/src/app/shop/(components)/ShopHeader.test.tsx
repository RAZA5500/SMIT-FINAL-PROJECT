import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ShopHeader } from "./ShopHeader";
import type { ShopParamsApi } from "./useShopParams";

describe("ShopHeader", () => {
  const createMockShop = (overrides?: Partial<ShopParamsApi>): ShopParamsApi => ({
    page: 1,
    q: "",
    category: null,
    sort: null,
    min: null,
    max: null,
    inStock: false,
    hasFilters: false,
    update: vi.fn(),
    clear: vi.fn(),
    ...overrides,
  });

  it("renders breadcrumbs, title, count, and quick filter buttons", () => {
    const shop = createMockShop();
    render(
      <ShopHeader
        shop={shop}
        category={undefined}
        parent={undefined}
        totalCount={34}
      />,
    );

    expect(screen.getByRole("heading", { name: "All products" })).toBeInTheDocument();
    expect(screen.getByText("34 products")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Under £5" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Under £10" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /In stock only/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Price: low to high/i })).toBeInTheDocument();
  });

  it("triggers shop.update when quick filters are clicked", async () => {
    const user = userEvent.setup();
    const update = vi.fn();
    const shop = createMockShop({ update });

    render(
      <ShopHeader
        shop={shop}
        category={undefined}
        parent={undefined}
        totalCount={34}
      />,
    );

    // Click "Under £5"
    await user.click(screen.getByRole("button", { name: "Under £5" }));
    expect(update).toHaveBeenCalledWith({ min: null, max: 5 });

    // Click "Under £10"
    await user.click(screen.getByRole("button", { name: "Under £10" }));
    expect(update).toHaveBeenCalledWith({ min: null, max: 10 });

    // Click "In Stock Only"
    await user.click(screen.getByRole("button", { name: /In stock only/i }));
    expect(update).toHaveBeenCalledWith({ inStock: true });

    // Click "Price: Low to High"
    await user.click(screen.getByRole("button", { name: /Price: low to high/i }));
    expect(update).toHaveBeenCalledWith({ sort: "price_asc" });
  });

  it("displays category name in title when a category is selected", () => {
    const shop = createMockShop({ category: "cat-123" });
    const mockCat = { id: "cat-123", name: "Fresh Vegetables", productCount: 12, children: [] };

    render(
      <ShopHeader
        shop={shop}
        category={mockCat}
        parent={undefined}
        totalCount={12}
      />,
    );

    expect(screen.getByRole("heading", { name: "Fresh Vegetables" })).toBeInTheDocument();
  });
});

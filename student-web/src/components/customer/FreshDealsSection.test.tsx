import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw/http";
import { describe, expect, it, vi } from "vitest";
import { server } from "@/test/msw-server";
import { renderWithProviders, TEST_API } from "@/test/render";
import FreshDealsSection from "./FreshDealsSection";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/",
}));

function product(id: string, name: string) {
  return {
    id,
    name,
    slug: id,
    sku: `FRE-${id}`,
    price: "2.50",
    minimumOrderQuantity: 1,
    maximumOrderQuantity: 5,
    isActive: true,
    category: { id: "c1", name: "Fresh Fruits", slug: "fresh-fruits" },
    stockStatus: "IN_STOCK",
    createdAt: "2026-10-20T10:00:00.000Z",
    updatedAt: "2026-10-20T10:00:00.000Z",
  };
}

function page<T>(data: T[]) {
  const total = data.length;
  return {
    data,
    meta: { total, currentPage: 1, limit: 12, pages: total ? 1 : 0, hasNextPage: false, hasPrevPage: false },
  };
}

/** List ke chaaron states (FLOW-MD 12 §4 "Loading/error/empty") */
describe("FreshDealsSection list states", () => {
  it("shows a skeleton while loading, then the products", async () => {
    server.use(http.get(`${TEST_API}/products`, () => HttpResponse.json(page([product("p1", "Royal Gala Apples")]))));
    renderWithProviders(<FreshDealsSection />);

    expect(screen.getByLabelText("Loading products")).toBeInTheDocument();
    expect(await screen.findByText("Royal Gala Apples")).toBeInTheDocument();
    expect(screen.getByText("£2.50")).toBeInTheDocument();
  });

  it("500 → ErrorState with a retry button", async () => {
    server.use(
      http.get(`${TEST_API}/products`, () =>
        HttpResponse.json(
          { statusCode: 500, message: "Internal Server Error", error: "Internal Server Error" },
          { status: 500 },
        ),
      ),
    );
    renderWithProviders(<FreshDealsSection />);

    expect(await screen.findByText("Couldn't load products")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });

  it("empty array → EmptyState", async () => {
    server.use(http.get(`${TEST_API}/products`, () => HttpResponse.json(page([]))));
    renderWithProviders(<FreshDealsSection />);

    expect(await screen.findByText("No products yet")).toBeInTheDocument();
  });
});

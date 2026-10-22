import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw/http";
import { describe, expect, it, vi } from "vitest";
import { HomeView } from "@/app/(components)/HomeView";
import { server } from "@/test/msw-server";
import { renderWithProviders, TEST_API } from "@/test/render";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/",
}));

const mockProductsResponse = {
  data: [
    {
      id: "p1",
      name: "Royal Gala Apples",
      slug: "apples",
      sku: "FRE-000001",
      price: "2.40",
      minimumOrderQuantity: 1,
      maximumOrderQuantity: 10,
      isActive: true,
      category: { id: "c1", name: "Fresh Fruits", slug: "fresh-fruits" },
      stockStatus: "IN_STOCK",
      createdAt: "2026-01-20T10:00:00.000Z",
      updatedAt: "2026-01-20T10:00:00.000Z",
    },
    {
      id: "p2",
      name: "Fresh Whole Milk 1L",
      slug: "milk",
      sku: "FRE-000002",
      price: "1.50",
      minimumOrderQuantity: 1,
      maximumOrderQuantity: 10,
      isActive: true,
      category: { id: "c2", name: "Dairy", slug: "dairy" },
      stockStatus: "IN_STOCK",
      createdAt: "2026-01-20T10:00:00.000Z",
      updatedAt: "2026-01-20T10:00:00.000Z",
    },
  ],
  meta: { total: 2, pages: 1, currentPage: 1, limit: 10 },
};

const mockCategoriesResponse = {
  data: [
    { id: "c1", name: "Fresh Fruits", slug: "fresh-fruits", parentId: null, productCount: 5 },
    { id: "c2", name: "Dairy", slug: "dairy", parentId: null, productCount: 4 },
  ],
};

describe("HomeView", () => {
  it("renders all key homepage sections including hero, deals, aisles, perks, testimonials, and promo", async () => {
    server.use(
      http.get(`${TEST_API}/products`, () => HttpResponse.json(mockProductsResponse)),
      http.get(`${TEST_API}/categories`, () => HttpResponse.json(mockCategoriesResponse)),
      http.get(`${TEST_API}/cart`, () => HttpResponse.json({ id: "cart1", items: [], itemCount: 0, subtotal: "0.00", grandTotal: "0.00" })),
    );

    renderWithProviders(<HomeView />);

    // 1. Hero headline
    expect(
      screen.getByRole("heading", { name: /The freshest market/i }),
    ).toBeInTheDocument();

    // 2. Search input in hero
    expect(
      screen.getByPlaceholderText(/Search apples, sourdough, chicken fillets, milk/i),
    ).toBeInTheDocument();

    // 3. Spotlight Deals section
    expect(
      screen.getByRole("heading", { name: /Today's Spotlight Deals/i }),
    ).toBeInTheDocument();

    // 4. Market Aisles section
    expect(
      screen.getByRole("heading", { name: /Explore Market Stalls/i }),
    ).toBeInTheDocument();

    // 5. Perks section
    expect(
      screen.getByRole("heading", { name: /Better Groceries\. Better Planet\. Better Price\./i }),
    ).toBeInTheDocument();

    // 6. Testimonials section
    expect(
      screen.getByRole("heading", { name: /Loved By Local Shoppers/i }),
    ).toBeInTheDocument();

    // 7. Promo Voucher section
    expect(
      screen.getByRole("heading", { name: /Get £10 off your first neighbourhood shop\./i }),
    ).toBeInTheDocument();

    // 8. Live activity ticker
    expect(screen.getByText(/Live Feed/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Cold-chain guaranteed/i)[0]).toBeInTheDocument();

    expect(screen.getByText("FRESH10")).toBeInTheDocument();
  });

  it("allows copying promo code and shows feedback", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    server.use(
      http.get(`${TEST_API}/products`, () => HttpResponse.json(mockProductsResponse)),
      http.get(`${TEST_API}/categories`, () => HttpResponse.json(mockCategoriesResponse)),
      http.get(`${TEST_API}/cart`, () => HttpResponse.json({ id: "cart1", items: [], itemCount: 0, subtotal: "0.00", grandTotal: "0.00" })),
    );

    renderWithProviders(<HomeView />);

    const copyBtn = screen.getByRole("button", { name: /Copy/i });
    await user.click(copyBtn);

    expect(writeText).toHaveBeenCalledWith("FRESH10");
  });
});

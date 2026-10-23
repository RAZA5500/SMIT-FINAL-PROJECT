import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw/http";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HomeView } from "@/app/(components)/HomeView";
import { useAuthStore } from "@/stores/auth-store";
import { server } from "@/test/msw-server";
import { renderWithProviders, TEST_API } from "@/test/render";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
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

function mockStoreApi() {
  server.use(
    http.get(`${TEST_API}/products`, () => HttpResponse.json(mockProductsResponse)),
    http.get(`${TEST_API}/categories`, () => HttpResponse.json(mockCategoriesResponse)),
    http.get(`${TEST_API}/cart`, () => HttpResponse.json({ id: "cart1", items: [], itemCount: 0, subtotal: "0.00", grandTotal: "0.00" })),
  );
}

describe("HomeView", () => {
  beforeEach(() => {
    push.mockReset();
    useAuthStore.setState({ token: null, user: null, _hasHydrated: true });
  });

  it("renders the hero and every home section with real store data", async () => {
    mockStoreApi();
    renderWithProviders(<HomeView />);

    expect(screen.getByRole("heading", { level: 1, name: /Fresh food/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /Search grocery items/i })).toBeInTheDocument();
    for (const name of [/Walk the\s*aisles/i, /Picked\s*fresh\s*today/i, /Made\s*effortless/i, /Loved\s*locally/i]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }

    // Aisle panels come from the real categories
    expect(await screen.findByRole("heading", { name: "Fresh Fruits" })).toBeInTheDocument();
    // The shelf shows real products
    expect((await screen.findAllByRole("link", { name: "Royal Gala Apples" })).length).toBeGreaterThan(0);
  });

  it("switches the products shelf between tabs", async () => {
    mockStoreApi();
    renderWithProviders(<HomeView />);
    const user = userEvent.setup();

    const newIn = screen.getByRole("tab", { name: "New in" });
    expect(newIn).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("tab", { name: "Under £2" }));
    expect(screen.getByRole("tab", { name: "Under £2" })).toHaveAttribute("aria-selected", "true");
    expect(newIn).toHaveAttribute("aria-selected", "false");
  });

  it("hero search sends the query to the shop", async () => {
    mockStoreApi();
    renderWithProviders(<HomeView />);
    const user = userEvent.setup();

    await user.type(screen.getByRole("combobox", { name: /Search grocery items/i }), "milk{Enter}");
    expect(push).toHaveBeenCalledWith("/shop?q=milk");
  });
});

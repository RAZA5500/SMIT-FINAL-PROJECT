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

  it("renders every homepage section: hero, shelves, aisles, market box, how it works, reviews and join banner", async () => {
    mockStoreApi();
    renderWithProviders(<HomeView />);

    expect(screen.getByRole("heading", { name: /The freshest market/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search apples, sourdough, chicken fillets, milk/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Fresh on the shelves/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Explore Market Stalls/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Build your market box/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Better Groceries\. Better Planet\. Better Price\./i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Loved By Local Shoppers/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Join the neighbourhood market\./i })).toBeInTheDocument();

    // Aisles bento uses the real categories from the API
    expect(await screen.findByRole("heading", { name: "Fresh Fruits" })).toBeInTheDocument();
  });

  it("filters the reviews carousel to 5-star reviews", async () => {
    mockStoreApi();
    renderWithProviders(<HomeView />);

    expect(screen.getByText("Jack H.")).toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole("button", { name: "5-Star Only" }));
    expect(screen.queryByText("Jack H.")).not.toBeInTheDocument();
    expect(screen.getByText("Charlotte D.")).toBeInTheDocument();
  });

  it("market box: picking an item enables the box button, and a guest is sent to sign in", async () => {
    mockStoreApi();
    renderWithProviders(<HomeView />);
    const user = userEvent.setup();

    const addBox = screen.getByRole("button", { name: /Add box to basket/i });
    expect(addBox).toBeDisabled();

    const [firstPick] = await screen.findAllByRole("button", { name: /Royal Gala Apples £2\.40/i });
    await user.click(firstPick);
    expect(screen.getByText(/1 pick in your box/i)).toBeInTheDocument();

    await user.click(addBox);
    expect(push).toHaveBeenCalledWith("/login?redirect=%2F");
  });
});

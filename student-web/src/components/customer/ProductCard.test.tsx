import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay } from "msw";
import { http, HttpResponse } from "msw/http";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGetCart } from "@/services/cart/queries";
import type { IProduct } from "@/services/products/types";
import { useAuthStore } from "@/stores/auth-store";
import { server } from "@/test/msw-server";
import { renderWithProviders, TEST_API } from "@/test/render";
import ProductCard from "./ProductCard";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
  usePathname: () => "/shop",
}));

const apples: IProduct = {
  id: "p1",
  name: "Royal Gala Apples",
  slug: "apples",
  sku: "FRE-000001",
  price: "2.50",
  minimumOrderQuantity: 1,
  maximumOrderQuantity: 10,
  isActive: true,
  category: { id: "c1", name: "Fresh Fruits", slug: "fresh-fruits" },
  stockStatus: "IN_STOCK",
  createdAt: "2026-10-20T10:00:00.000Z",
  updatedAt: "2026-10-20T10:00:00.000Z",
};

function cart(quantity: number) {
  const items =
    quantity > 0
      ? [
          {
            id: "ci1",
            productId: apples.id,
            name: apples.name,
            sku: apples.sku,
            price: "2.50",
            quantity,
            lineTotal: (2.5 * quantity).toFixed(2),
            minimumOrderQuantity: 1,
            maximumOrderQuantity: 10,
            stockStatus: "IN_STOCK",
            maxAllowedQuantity: 10,
            isAvailable: true,
          },
        ]
      : [];
  const total = (2.5 * quantity).toFixed(2);
  return { id: "cart1", items, itemCount: quantity, subtotal: total, grandTotal: total };
}

/** Header jaisa consumer — `["cart"]` query */
function CartCount() {
  const { data } = useGetCart();
  return <p>Lines in cart: {data?.items.length ?? "…"}</p>;
}

function signInAsCustomer() {
  useAuthStore.setState({
    token: "jwt-customer",
    user: {
      id: "u1",
      email: "c@test.local",
      name: "Customer",
      phone: null,
      role: "CUSTOMER",
      isActive: true,
      totalOrders: 0,
      totalSpent: "0.00",
      lastLoginAt: null,
      createdAt: "2026-10-20T10:00:00.000Z",
      updatedAt: "2026-10-20T10:00:00.000Z",
    },
    _hasHydrated: true,
  });
}

describe("ProductCard", () => {
  beforeEach(() => {
    push.mockReset();
    useAuthStore.setState({ token: null, user: null, _hasHydrated: true });
  });

  it("guest → login with a redirect back to the shop", async () => {
    renderWithProviders(<ProductCard product={apples} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Add to Cart" }));
    expect(push).toHaveBeenCalledWith("/login?redirect=%2Fshop");
  });

  it("double click → only one POST /cart/items (button disabled while pending)", async () => {
    signInAsCustomer();
    let posts = 0;
    server.use(
      http.post(`${TEST_API}/cart/items`, async () => {
        posts += 1;
        await delay(100);
        return HttpResponse.json(cart(1));
      }),
      http.get(`${TEST_API}/cart`, () => HttpResponse.json(cart(1))),
    );
    renderWithProviders(<ProductCard product={apples} />);

    await userEvent.setup().dblClick(screen.getByRole("button", { name: "Add to Cart" }));
    expect(screen.getByRole("button", { name: "Adding…" })).toBeDisabled();

    await waitFor(() => expect(screen.getByRole("button", { name: "Add to Cart" })).toBeEnabled());
    expect(posts).toBe(1);
  });

  it("add to cart → the ['cart'] query refetches", async () => {
    signInAsCustomer();
    let cartFetches = 0;
    let lines = 0;
    server.use(
      http.get(`${TEST_API}/cart`, () => {
        cartFetches += 1;
        return HttpResponse.json(cart(lines));
      }),
      http.post(`${TEST_API}/cart/items`, () => {
        lines = 1;
        return HttpResponse.json(cart(1));
      }),
    );
    renderWithProviders(
      <>
        <CartCount />
        <ProductCard product={apples} />
      </>,
    );
    expect(await screen.findByText("Lines in cart: 0")).toBeInTheDocument();
    const fetchesBeforeAdd = cartFetches;

    await userEvent.setup().click(screen.getByRole("button", { name: "Add to Cart" }));

    expect(await screen.findByText("Lines in cart: 1")).toBeInTheDocument();
    await waitFor(() => expect(cartFetches).toBeGreaterThan(fetchesBeforeAdd));
  });
});

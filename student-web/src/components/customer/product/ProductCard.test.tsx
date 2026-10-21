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
import { ProductCard } from "./ProductCard";

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
  createdAt: "2026-01-20T10:00:00.000Z",
  updatedAt: "2026-01-20T10:00:00.000Z",
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

const addButton = () => screen.getByRole("button", { name: /add to basket/i });

describe("ProductCard", () => {
  beforeEach(() => {
    push.mockReset();
    useAuthStore.setState({ token: null, user: null, _hasHydrated: true });
  });

  it("links to the product page and shows price and category", () => {
    renderWithProviders(<ProductCard product={apples} />);
    expect(screen.getByRole("link", { name: "Royal Gala Apples" })).toHaveAttribute("href", "/products/p1");
    expect(screen.getByText("£2.50")).toBeInTheDocument();
    expect(screen.getByText("Fresh Fruits")).toBeInTheDocument();
  });

  it("guest → login with a redirect back to the shop", async () => {
    renderWithProviders(<ProductCard product={apples} />);
    await userEvent.setup().click(addButton());
    expect(push).toHaveBeenCalledWith("/login?redirect=%2Fshop");
  });

  it("out of stock → disabled button, no add", () => {
    renderWithProviders(<ProductCard product={{ ...apples, stockStatus: "OUT_OF_STOCK" }} />);
    expect(screen.getByRole("button", { name: "Out of stock" })).toBeDisabled();
    expect(screen.getByText("Sold out")).toBeInTheDocument();
  });

  it("double click → only one POST /cart/items, then the card turns into a basket stepper", async () => {
    signInAsCustomer();
    let posts = 0;
    let lines = 0;
    server.use(
      http.post(`${TEST_API}/cart/items`, async () => {
        posts += 1;
        lines = 1;
        await delay(100);
        return HttpResponse.json(cart(1));
      }),
      http.get(`${TEST_API}/cart`, () => HttpResponse.json(cart(lines))),
    );
    renderWithProviders(<ProductCard product={apples} />);
    await waitFor(() => expect(addButton()).toBeEnabled());

    await userEvent.setup().dblClick(addButton());
    expect(screen.getByRole("button", { name: /adding/i })).toBeDisabled();

    expect(await screen.findByRole("button", { name: "Increase quantity of Royal Gala Apples" })).toBeInTheDocument();
    expect(posts).toBe(1);
  });

  it("add to basket → the ['cart'] query refetches", async () => {
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

    await userEvent.setup().click(addButton());

    expect(await screen.findByText("Lines in cart: 1")).toBeInTheDocument();
    await waitFor(() => expect(cartFetches).toBeGreaterThan(fetchesBeforeAdd));
  });

  it("in-basket stepper: rapid + clicks become one absolute PATCH (350 ms debounce)", async () => {
    signInAsCustomer();
    const patches: unknown[] = [];
    server.use(
      http.get(`${TEST_API}/cart`, () => HttpResponse.json(cart(2))),
      http.patch(`${TEST_API}/cart/items/ci1`, async ({ request }) => {
        patches.push(await request.json());
        return HttpResponse.json(cart(4));
      }),
    );
    renderWithProviders(<ProductCard product={apples} />);
    const increase = await screen.findByRole("button", { name: "Increase quantity of Royal Gala Apples" });

    const user = userEvent.setup();
    await user.click(increase);
    await user.click(increase);
    expect(screen.getByText("4")).toBeInTheDocument();

    await waitFor(() => expect(patches).toEqual([{ quantity: 4 }]));
  });
});

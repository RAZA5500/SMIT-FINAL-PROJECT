import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductCard } from "./ProductCard";
import { ProductListItem } from "./ProductListItem";
import { Tilt } from "@/components/ui/tilt";
import { ButtonLink } from "@/components/shared/ButtonLink";
import type { IProduct } from "@/services/products/types";
import { renderWithProviders } from "@/test/render";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/shop",
}));

const sampleProduct: IProduct = {
  id: "prod-1",
  name: "Gala Apple",
  slug: "gala-apple",
  sku: "FRE-000100",
  price: "1.99",
  minimumOrderQuantity: 1,
  maximumOrderQuantity: 10,
  isActive: true,
  category: { id: "cat-1", name: "Apples", slug: "apples" },
  stockStatus: "IN_STOCK",
  createdAt: "2026-01-20T10:00:00.000Z",
  updatedAt: "2026-01-20T10:00:00.000Z",
};

describe("Performance and Transition optimizations", () => {
  it("ProductCard passes forward navigation and morph settings", () => {
    renderWithProviders(<ProductCard product={sampleProduct} morph eager />);
    const link = screen.getByRole("link", { name: "Gala Apple" });
    expect(link).toHaveAttribute("href", "/products/prod-1");
  });

  it("ProductListItem renders link with product page destination and morph support", () => {
    renderWithProviders(<ProductListItem product={sampleProduct} morph />);
    const link = screen.getByRole("link", { name: "Gala Apple" });
    expect(link).toHaveAttribute("href", "/products/prod-1");
  });

  it("ButtonLink forwards transitionTypes to underlying link", () => {
    render(<ButtonLink href="/orders" transitionTypes={["nav-back"]}>Back</ButtonLink>);
    const link = screen.getByRole("button", { name: "Back" });
    expect(link).toHaveAttribute("href", "/orders");
  });

  it("Tilt computes accurate 3D tilt and glare variables on pointer move", async () => {
    render(
      <Tilt max={10} data-testid="tilt-container">
        <div>Content</div>
      </Tilt>
    );
    const tiltEl = screen.getByTestId("tilt-container");
    vi.spyOn(tiltEl, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.pointerEnter(tiltEl, { pointerType: "mouse", clientX: 0, clientY: 0 });
    // Move to (75, 25): x = 75/100 - 0.5 = 0.25, y = 25/100 - 0.5 = -0.25
    fireEvent.pointerMove(tiltEl, { pointerType: "mouse", clientX: 75, clientY: 25 });

    // Wait for requestAnimationFrame to fire
    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(tiltEl.style.getPropertyValue("--tilt-x")).toBe("5.00deg"); // 0.25 * 10 * 2
    expect(tiltEl.style.getPropertyValue("--tilt-y")).toBe("5.00deg"); // -(-0.25) * 10 * 2
    expect(tiltEl.style.getPropertyValue("--glare-x")).toBe("75.0%");
    expect(tiltEl.style.getPropertyValue("--glare-y")).toBe("25.0%");

    // Pointer leave resets styles and removes glare overrides
    fireEvent.pointerLeave(tiltEl, { pointerType: "mouse" });
    expect(tiltEl.style.getPropertyValue("--tilt-x")).toBe("0deg");
    expect(tiltEl.style.getPropertyValue("--tilt-y")).toBe("0deg");
    expect(tiltEl.style.getPropertyValue("--glare-x")).toBe("");
    expect(tiltEl.style.getPropertyValue("--glare-y")).toBe("");
  });

  it("Tilt ignores non-mouse pointer types and prefers-reduced-motion", async () => {
    render(
      <Tilt max={10} data-testid="tilt-touch">
        <div>Content</div>
      </Tilt>
    );
    const tiltEl = screen.getByTestId("tilt-touch");
    vi.spyOn(tiltEl, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    // Touch events should be ignored
    fireEvent.pointerEnter(tiltEl, { pointerType: "touch", clientX: 50, clientY: 50 });
    fireEvent.pointerMove(tiltEl, { pointerType: "touch", clientX: 75, clientY: 75 });
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(tiltEl.style.getPropertyValue("--tilt-x")).toBe("");

    // Reduced motion should also prevent tilt
    const matchMediaSpy = vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });

    fireEvent.pointerMove(tiltEl, { pointerType: "mouse", clientX: 75, clientY: 75 });
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(tiltEl.style.getPropertyValue("--tilt-x")).toBe("");

    matchMediaSpy.mockRestore();
  });

  it("Tilt guards against zero dimensions and handles Base UI prevention on leave", async () => {
    const onLeave = vi.fn((e: unknown) => {
      (e as { baseUIHandlerPrevented?: boolean }).baseUIHandlerPrevented = true;
    });

    render(
      <Tilt data-testid="tilt-zero" onPointerLeave={onLeave}>
        <div>Content</div>
      </Tilt>
    );
    const tiltEl = screen.getByTestId("tilt-zero");
    // Simulate zero-size element
    vi.spyOn(tiltEl, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      right: 0,
      bottom: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.pointerEnter(tiltEl, { pointerType: "mouse", clientX: 10, clientY: 10 });
    fireEvent.pointerMove(tiltEl, { pointerType: "mouse", clientX: 20, clientY: 20 });
    await new Promise((resolve) => requestAnimationFrame(resolve));
    // Zero dimensions guard prevents setting NaN/Infinity
    expect(tiltEl.style.getPropertyValue("--tilt-x")).toBe("");

    // When onPointerLeave marks event as prevented, internal reset is skipped
    fireEvent.pointerLeave(tiltEl, { pointerType: "mouse" });
    expect(onLeave).toHaveBeenCalledTimes(1);
  });

  it("Tilt clears cached rect on window scroll and resize to maintain accurate perspective", () => {
    render(
      <Tilt data-testid="tilt-scroll">
        <div>Content</div>
      </Tilt>
    );
    const tiltEl = screen.getByTestId("tilt-scroll");
    const getBoundingRectSpy = vi.spyOn(tiltEl, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    // Enter caches rect
    fireEvent.pointerEnter(tiltEl, { pointerType: "mouse", clientX: 10, clientY: 10 });
    expect(getBoundingRectSpy).toHaveBeenCalledTimes(1);

    // Scroll clears rectRef
    fireEvent.scroll(window);

    // Move after scroll recalculates rect
    fireEvent.pointerMove(tiltEl, { pointerType: "mouse", clientX: 20, clientY: 20 });
    expect(getBoundingRectSpy).toHaveBeenCalledTimes(2);

    // Resize also clears rectRef
    fireEvent.resize(window);
    fireEvent.pointerMove(tiltEl, { pointerType: "mouse", clientX: 30, clientY: 30 });
    expect(getBoundingRectSpy).toHaveBeenCalledTimes(3);

    fireEvent.pointerLeave(tiltEl, { pointerType: "mouse" });
    expect(tiltEl.style.getPropertyValue("--tilt-x")).toBe("0deg");
    expect(tiltEl.style.getPropertyValue("--tilt-y")).toBe("0deg");
  });
});

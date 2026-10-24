import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/customer/layout/SiteHeader";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useAuthStore } from "@/stores/auth-store";
import { renderWithProviders } from "@/test/render";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => "/",
}));

describe("ThemeToggle & SiteHeader", () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null, _hasHydrated: true });
    document.documentElement.className = "";
  });

  it("ThemeToggle toggles dark mode with smooth hardware-accelerated icon transitions", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    // Rapid toggle back to light mode
    await user.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("handles rapid consecutive toggles during view transitions without premature class removal", async () => {
    let finishFirst: () => void = () => {};
    let finishSecond: () => void = () => {};

    const firstFinished = new Promise<void>((resolve) => {
      finishFirst = resolve;
    });
    const secondFinished = new Promise<void>((resolve) => {
      finishSecond = resolve;
    });

    let callCount = 0;
    const docWithTransitions = document as unknown as Record<string, unknown>;

    docWithTransitions.startViewTransition = vi.fn((cb: () => void) => {
      cb();
      callCount++;
      return {
        ready: Promise.resolve(),
        finished: callCount === 1 ? firstFinished : secondFinished,
      };
    });

    const user = userEvent.setup();
    renderWithProviders(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /switch to dark mode/i });

    // Click 1 starts transition 1
    await user.click(button);
    expect(document.documentElement.classList.contains("theme-switching")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    // Click 2 rapidly starts transition 2
    await user.click(button);
    expect(document.documentElement.classList.contains("theme-switching")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    // Transition 1 finishes (aborted)
    finishFirst();
    await Promise.resolve();
    // theme-switching MUST NOT be removed yet because transition 2 is still running!
    expect(document.documentElement.classList.contains("theme-switching")).toBe(true);

    // Transition 2 finishes
    finishSecond();
    await Promise.resolve();
    // Now theme-switching is cleaned up
    expect(document.documentElement.classList.contains("theme-switching")).toBe(false);

    delete docWithTransitions.startViewTransition;
  });

  it("SiteHeader mounts flush sticky at top without laggy layout classes", () => {
    const { unmount } = renderWithProviders(<SiteHeader />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    // Flush at top with full width, z-40 stacking, and tight padding
    expect(header.className).toContain("sticky top-0");
    expect(header.className).toContain("z-40");
    expect(header.className).toContain("w-full");
    expect(header.className).toContain("mt-0");
    expect(header.className).toContain("pt-0");
    expect(header.className).toContain("pb-0");
    expect(header.className).toContain("px-1");
    expect(header.className).toContain("sm:px-2");
    // Does NOT have excessive padding
    expect(header.className).not.toContain("pt-3");
    expect(header.className).not.toContain("pt-0.5");
    expect(header.className.split(" ")).not.toContain("px-2");
    expect(header.className).not.toContain("sm:px-3");
    expect(header.className).not.toContain("sm:px-4");

    // The floating pill uses sleek h-14 and compact horizontal padding
    const pill = header.firstElementChild?.nextElementSibling;
    expect(pill).toBeInTheDocument();
    expect(pill?.className).toContain("h-14");
    expect(pill?.className).toContain("mt-0");
    expect(pill?.className).toContain("pr-1");
    expect(pill?.className).toContain("pl-1");
    expect(pill?.className).toContain("sm:pl-1.5");
    expect(pill?.className).toContain("will-change-transform");
    expect(pill?.className).toContain("shadow-soft");
    expect(pill?.className).not.toContain("h-16");
    expect(pill?.className).not.toContain("transition-[max-width,height");

    unmount();

    // Also verify CheckoutHeader has compact padding and sticky positioning
    renderWithProviders(<SiteHeader variant="checkout" />);
    const checkoutHeader = screen.getByRole("banner");
    expect(checkoutHeader.className).toContain("sticky top-0");
    expect(checkoutHeader.className).toContain("z-40");
    expect(checkoutHeader.className).toContain("mt-0");
    expect(checkoutHeader.className).toContain("pt-0");
    expect(checkoutHeader.className).toContain("pb-0");
    expect(checkoutHeader.className).toContain("px-1");
    expect(checkoutHeader.className).toContain("sm:px-2");
    const checkoutPill = checkoutHeader.firstElementChild?.nextElementSibling;
    expect(checkoutPill?.className).toContain("h-14");
    expect(checkoutPill?.className).toContain("mt-0");
    expect(checkoutPill?.className).toContain("pr-1");
    expect(checkoutPill?.className).toContain("pl-1.5");
    expect(checkoutPill?.className).toContain("gap-1.5");
    expect(checkoutPill?.className).toContain("sm:gap-2");
    expect(checkoutPill?.className).toContain("will-change-transform");
  });
});

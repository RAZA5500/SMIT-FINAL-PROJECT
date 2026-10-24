import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw/http";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthShell } from "@/components/customer/auth/AuthShell";
import { useAuthStore } from "@/stores/auth-store";
import { server } from "@/test/msw-server";
import { renderWithProviders, TEST_API } from "@/test/render";
import { LoginForm } from "./LoginForm";

const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
  usePathname: () => "/login",
}));

function loginResponse(role: "ADMIN" | "CUSTOMER") {
  return { accessToken: `jwt-${role}`, user: { id: "u1", name: "Ali", email: "ali@test.local", role } };
}

async function fillAndSubmit(email = "ali@test.local", password = "secret123") {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Email Address"), email);
  await user.type(screen.getByLabelText("Password"), password);
  await user.click(screen.getByRole("button", { name: /sign in/i }));
}

describe("LoginForm", () => {
  beforeEach(() => {
    replace.mockReset();
    useAuthStore.setState({ token: null, user: null, _hasHydrated: true });
  });

  it("validates with Zod before calling the API", async () => {
    renderWithProviders(<LoginForm redirectTo={null} />);
    await userEvent.setup().click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toHaveAttribute("aria-invalid", "true");
  });

  it("customer login → token in the store and lands on /shop", async () => {
    server.use(http.post(`${TEST_API}/auth/login`, () => HttpResponse.json(loginResponse("CUSTOMER"))));
    renderWithProviders(<LoginForm redirectTo={null} />);
    await fillAndSubmit();

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/shop"));
    expect(useAuthStore.getState().token).toBe("jwt-CUSTOMER");
  });

  it("admin login lands on the admin workspace (orders)", async () => {
    server.use(http.post(`${TEST_API}/auth/login`, () => HttpResponse.json(loginResponse("ADMIN"))));
    renderWithProviders(<LoginForm redirectTo={null} />);
    await fillAndSubmit();
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/admin/orders"));
  });

  it("returns a customer to the page they came from, but never into /admin", async () => {
    server.use(http.post(`${TEST_API}/auth/login`, () => HttpResponse.json(loginResponse("CUSTOMER"))));
    const first = renderWithProviders(<LoginForm redirectTo="/checkout" />);
    await fillAndSubmit();
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/checkout"));
    first.unmount();

    replace.mockReset();
    useAuthStore.setState({ token: null, user: null });
    renderWithProviders(<LoginForm redirectTo="/admin/orders" />);
    await fillAndSubmit();
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/shop"));
  });

  it("wrong credentials keep the user on the page", async () => {
    server.use(
      http.post(`${TEST_API}/auth/login`, () =>
        HttpResponse.json({ statusCode: 401, message: "Invalid email or password" }, { status: 401 }),
      ),
    );
    renderWithProviders(<LoginForm redirectTo={null} />);
    await fillAndSubmit("ali@test.local", "wrong-password");
    await waitFor(() => expect(screen.getByRole("button", { name: /sign in/i })).not.toBeDisabled());
    expect(replace).not.toHaveBeenCalled();
    expect(useAuthStore.getState().token).toBeNull();
  });

  it("Customer and Admin demo buttons auto-fill login credentials", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm redirectTo={null} />);

    const customerDemoBtn = screen.getByRole("button", { name: /customer demo/i });
    const adminDemoBtn = screen.getByRole("button", { name: /admin demo/i });
    expect(customerDemoBtn).toBeInTheDocument();
    expect(adminDemoBtn).toBeInTheDocument();

    await user.click(customerDemoBtn);
    expect(screen.getByLabelText("Email Address")).toHaveValue("ali@test.local");
    expect(screen.getByLabelText("Password")).toHaveValue("secret123");

    await user.click(adminDemoBtn);
    expect(screen.getByLabelText("Email Address")).toHaveValue("admin@freskinto.com");
    expect(screen.getByLabelText("Password")).toHaveValue("Admin@123");
  });

  it("AuthShell mounts the mode switch and the tap-to-pick list, without the 3D HeroOrbit", async () => {
    const { container } = renderWithProviders(
      <AuthShell>
        <div>Test Auth Children</div>
      </AuthShell>,
    );

    expect(screen.getByText("Test Auth Children")).toBeInTheDocument();

    // Sign in ↔ Create account switch marks the current page
    const nav = screen.getByRole("navigation", { name: "Account" });
    expect(within(nav).getByRole("link", { name: "Sign in" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Create account" })).toHaveAttribute("href", "/register");

    // Tapping products adds them to the list tray, tapping again removes them
    const user = userEvent.setup();
    expect(screen.getByText(/your list is empty/i)).toBeInTheDocument();
    const apples = screen.getByRole("button", { name: "Apples" });
    await user.click(apples);
    await user.click(screen.getByRole("button", { name: "Milk" }));
    expect(apples).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("2 favourites on your list")).toBeInTheDocument();
    await user.click(apples);
    expect(apples).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("1 favourite on your list")).toBeInTheDocument();

    // HeroOrbit circular text / orbit carousel is NOT present
    expect(container.querySelector(".animate-spin-orbit")).not.toBeInTheDocument();
  });

  it("demo account buttons show which account is filled in", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm redirectTo={null} />);

    const customerDemoBtn = screen.getByRole("button", { name: /customer demo/i });
    expect(customerDemoBtn).toHaveAttribute("aria-pressed", "false");
    await user.click(customerDemoBtn);
    expect(customerDemoBtn).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /admin demo/i })).toHaveAttribute("aria-pressed", "false");
  });

  it("renders a link to the forgot password recovery page", () => {
    renderWithProviders(<LoginForm redirectTo={null} />);
    const forgotLink = screen.getByRole("link", { name: /forgot password\?/i });
    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink).toHaveAttribute("href", "/forgot-password");
  });
});

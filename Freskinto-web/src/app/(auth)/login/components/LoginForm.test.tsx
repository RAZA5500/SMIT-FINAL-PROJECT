import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw/http";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/stores/auth-store";
import { server } from "@/test/msw-server";
import { renderWithProviders, TEST_API } from "@/test/render";
import { LoginForm } from "./LoginForm";

const replace = vi.fn();
let search = "";
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(search),
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
    search = "";
    useAuthStore.setState({ token: null, user: null, _hasHydrated: true });
  });

  it("validates with Zod before calling the API", async () => {
    renderWithProviders(<LoginForm />);
    await userEvent.setup().click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toHaveAttribute("aria-invalid", "true");
  });

  it("customer login → token in the store and lands on /shop", async () => {
    server.use(http.post(`${TEST_API}/auth/login`, () => HttpResponse.json(loginResponse("CUSTOMER"))));
    renderWithProviders(<LoginForm />);
    await fillAndSubmit();

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/shop"));
    expect(useAuthStore.getState().token).toBe("jwt-CUSTOMER");
  });

  it("admin login lands on /admin/dashboard", async () => {
    server.use(http.post(`${TEST_API}/auth/login`, () => HttpResponse.json(loginResponse("ADMIN"))));
    renderWithProviders(<LoginForm />);
    await fillAndSubmit();
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/admin/dashboard"));
  });

  it("returns a customer to the page they came from, but never into /admin", async () => {
    search = "redirect=%2Fcheckout";
    server.use(http.post(`${TEST_API}/auth/login`, () => HttpResponse.json(loginResponse("CUSTOMER"))));
    const first = renderWithProviders(<LoginForm />);
    await fillAndSubmit();
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/checkout"));
    first.unmount();

    replace.mockReset();
    useAuthStore.setState({ token: null, user: null });
    search = "redirect=%2Fadmin%2Forders";
    renderWithProviders(<LoginForm />);
    await fillAndSubmit();
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/shop"));
  });

  it("wrong credentials keep the user on the page", async () => {
    server.use(
      http.post(`${TEST_API}/auth/login`, () =>
        HttpResponse.json({ statusCode: 401, message: "Invalid email or password" }, { status: 401 }),
      ),
    );
    renderWithProviders(<LoginForm />);
    await fillAndSubmit("ali@test.local", "wrong-password");
    await waitFor(() => expect(screen.getByRole("button", { name: /sign in/i })).not.toBeDisabled());
    expect(replace).not.toHaveBeenCalled();
    expect(useAuthStore.getState().token).toBeNull();
  });
});

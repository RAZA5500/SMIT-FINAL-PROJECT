import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw/http";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/stores/auth-store";
import { server } from "@/test/msw-server";
import { renderWithProviders, TEST_API } from "@/test/render";
import { AuthGuard } from "./AuthGuard";

const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn() }),
  usePathname: () => "/admin/orders",
}));

const me = (role: "ADMIN" | "CUSTOMER") =>
  http.get(`${TEST_API}/auth/me`, () =>
    HttpResponse.json({ id: "u1", name: "Ali", email: "a@test.local", role }),
  );

describe("AuthGuard", () => {
  beforeEach(() => {
    replace.mockReset();
    useAuthStore.setState({ token: null, user: null, _hasHydrated: true });
  });

  it("no token → /login with a redirect back", async () => {
    renderWithProviders(<AuthGuard expectedRole="ADMIN">secret</AuthGuard>);
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login?redirect=%2Fadmin%2Forders"));
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
  });

  it("waits for the persisted session to hydrate before deciding", () => {
    useAuthStore.setState({ _hasHydrated: false });
    renderWithProviders(<AuthGuard expectedRole="ADMIN">secret</AuthGuard>);
    expect(replace).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });

  it("renders children once /auth/me confirms the role", async () => {
    useAuthStore.setState({ token: "jwt" });
    server.use(me("ADMIN"));
    renderWithProviders(<AuthGuard expectedRole="ADMIN">secret</AuthGuard>);
    expect(await screen.findByText("secret")).toBeInTheDocument();
  });

  it("a customer on an admin layout is redirected to their own area", async () => {
    useAuthStore.setState({ token: "jwt" });
    server.use(me("CUSTOMER"));
    renderWithProviders(<AuthGuard expectedRole="ADMIN">secret</AuthGuard>);
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/shop"));
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
  });

  it("401/403 from /auth/me ends the session", async () => {
    useAuthStore.setState({ token: "jwt" });
    server.use(
      http.get(`${TEST_API}/auth/me`, () =>
        HttpResponse.json({ message: "User account is deactivated. Please contact support." }, { status: 403 }),
      ),
    );
    renderWithProviders(<AuthGuard expectedRole="CUSTOMER">secret</AuthGuard>);
    await waitFor(() => expect(useAuthStore.getState().token).toBeNull());
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login?redirect=%2Fadmin%2Forders"));
  });

  it("a server error does not log the user out — it offers a retry", async () => {
    useAuthStore.setState({ token: "jwt" });
    server.use(http.get(`${TEST_API}/auth/me`, () => HttpResponse.json({ message: "boom" }, { status: 500 })));
    renderWithProviders(<AuthGuard expectedRole="CUSTOMER">secret</AuthGuard>);
    expect(await screen.findByRole("button", { name: /try again/i })).toBeInTheDocument();
    expect(useAuthStore.getState().token).toBe("jwt");
  });
});

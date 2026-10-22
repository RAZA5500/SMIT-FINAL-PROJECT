import { beforeEach, describe, expect, it } from "vitest";
import type { IUser } from "@/services/auth/types";
import { useAuthStore } from "./auth-store";
import { useShopStore } from "./shop-store";

const user = { id: "u1", name: "Ali", email: "ali@test.local", role: "CUSTOMER" } as IUser;

describe("auth store", () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null, rememberMe: true });
  });

  it("login → token + user in the store, persisted to localStorage with remember me", () => {
    useAuthStore.getState().setSession("jwt-1", user, true);
    expect(useAuthStore.getState()).toMatchObject({ token: "jwt-1", user, rememberMe: true });
    expect(localStorage.getItem("onlinemart-auth")).toContain("jwt-1");
    expect(sessionStorage.getItem("onlinemart-auth")).toBeNull();
  });

  it("without remember me the session only lives in sessionStorage", () => {
    useAuthStore.getState().setSession("jwt-2", user, false);
    expect(sessionStorage.getItem("onlinemart-auth")).toContain("jwt-2");
    expect(localStorage.getItem("onlinemart-auth")).toBeNull();
  });

  it("logout clears the session and the local cart UI state", () => {
    useAuthStore.getState().setSession("jwt-3", user, true);
    useShopStore.getState().setOptimisticQuantity("p1", 3);

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useShopStore.getState().optimisticQuantities).toEqual({});
  });
});

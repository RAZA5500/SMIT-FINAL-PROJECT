import { delay } from "msw";
import { http, HttpResponse } from "msw/http";
import { beforeEach, describe, expect, it } from "vitest";
import { server } from "@/test/msw-server";
import { TEST_API } from "@/test/render";
import { useAuthStore } from "@/stores/auth-store";
import type { IUser } from "@/services/auth/types";
import { ApiError, extractApiMessage, NETWORK_ERROR_MESSAGE, request, withQuery } from "./api";

const URL = `${TEST_API}/things`;

describe("extractApiMessage", () => {
  it("handles every NestJS error shape", () => {
    expect(extractApiMessage({ message: "Cart is empty" })).toBe("Cart is empty");
    expect(extractApiMessage({ message: ["quantity must not be less than 1", "x"] })).toBe(
      "quantity must not be less than 1, x",
    );
    expect(extractApiMessage({ message: { message: "Nested" } })).toBe("Nested");
    expect(extractApiMessage({ errors: [{ message: "A" }, "B"] })).toBe("A, B");
    expect(extractApiMessage({ error: "Bad Request" }, "fallback")).toBe("fallback");
    expect(extractApiMessage({ error: "Payment Required" })).toBe("Payment Required");
  });
});

describe("withQuery()", () => {
  it("keeps only defined values", () => {
    expect(withQuery("/x", { q: "milk", page: 2, empty: "", none: undefined, nil: null })).toBe(
      "/x?q=milk&page=2",
    );
    expect(withQuery("/x", {})).toBe("/x");
  });
});

describe("request()", () => {
  beforeEach(() => {
    useAuthStore.setState({ token: null, user: null });
  });

  it("returns parsed JSON data on success", async () => {
    server.use(http.get(URL, () => HttpResponse.json({ ok: true })));
    await expect(request<{ ok: boolean }>(URL)).resolves.toEqual({ data: { ok: true }, status: 200 });
  });

  it("sends the bearer token and JSON body", async () => {
    let auth: string | null = null;
    let body: unknown = null;
    server.use(
      http.post(URL, async ({ request: req }) => {
        auth = req.headers.get("authorization");
        body = await req.json();
        return new HttpResponse(null, { status: 204 });
      }),
    );
    const res = await request(URL, { a: 1 }, { method: "POST", token: "jwt-123" });
    expect(auth).toBe("Bearer jwt-123");
    expect(body).toEqual({ a: 1 });
    expect(res).toEqual({ data: undefined, status: 204 });
  });

  it("400 with a validation message array → ApiError with the joined message", async () => {
    server.use(
      http.post(URL, () =>
        HttpResponse.json(
          { statusCode: 400, message: ["price must not be less than 0.01", "name should not be empty"], error: "Bad Request" },
          { status: 400 },
        ),
      ),
    );
    const error = await request(URL, {}, { method: "POST" }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 400,
      message: "price must not be less than 0.01, name should not be empty",
    });
  });

  it("401 on an authenticated request logs the user out", async () => {
    useAuthStore.setState({ token: "expired", user: { id: "u1" } as IUser });
    server.use(
      http.get(URL, () =>
        HttpResponse.json({ statusCode: 401, message: "Token has expired. Please login again." }, { status: 401 }),
      ),
    );
    await expect(request(URL, undefined, { token: "expired" })).rejects.toMatchObject({ status: 401 });
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("a failed login (401 without token) does not touch the store", async () => {
    useAuthStore.setState({ token: "keep-me" });
    server.use(http.post(URL, () => HttpResponse.json({ message: "Invalid email or password" }, { status: 401 })));
    await expect(request(URL, {}, { method: "POST" })).rejects.toMatchObject({
      status: 401,
      message: "Invalid email or password",
    });
    expect(useAuthStore.getState().token).toBe("keep-me");
  });

  it("network failure → ApiError(0) with a friendly message", async () => {
    server.use(http.get(URL, () => HttpResponse.error()));
    await expect(request(URL)).rejects.toMatchObject({ status: 0, message: NETWORK_ERROR_MESSAGE });
  });

  it("opt-in timeout → ApiError(408)", async () => {
    server.use(
      http.get(URL, async () => {
        await delay(200);
        return HttpResponse.json({});
      }),
    );
    await expect(request(URL, undefined, { timeoutMs: 20 })).rejects.toMatchObject({ status: 408 });
  });
});

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { queryClient } from "@/lib/query-client";
import type { IUser } from "@/services/auth/types";
import { useShopStore } from "./shop-store";

interface AuthState {
  token: string | null;
  user: IUser | null;
  /** "Remember me" — true: localStorage, false: sirf is browser session tak */
  rememberMe: boolean;
  /** Persisted state load ho gaya? AuthGuard is ka intezar karta hai */
  _hasHydrated: boolean;
  setSession: (token: string, user: IUser, rememberMe: boolean) => void;
  setUser: (user: IUser) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

/** rememberMe ke hisaab se localStorage ya sessionStorage; server par no-op */
const authStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(name) ?? sessionStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") return;
    const { state } = JSON.parse(value) as { state?: { rememberMe?: boolean } };
    const [target, other] = state?.rememberMe === false
      ? [sessionStorage, localStorage]
      : [localStorage, sessionStorage];
    target.setItem(name, value);
    other.removeItem(name);
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      rememberMe: true,
      _hasHydrated: false,
      setSession: (token, user, rememberMe) => set({ token, user, rememberMe }),
      setUser: (user) => set({ user }),
      logout: () => {
        set({ token: null, user: null });
        // Pichle user ka cart / orders cache mein na rahe
        useShopStore.getState().resetCartLocal();
        queryClient.clear();
      },
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: "onlinemart-auth",
      storage: createJSONStorage(() => authStorage),
      partialize: ({ token, user, rememberMe }) => ({ token, user, rememberMe }),
      // Server aur pehle client render ka HTML same rahe — rehydrate Providers mount par
      skipHydration: true,
      // Storage kharab ho (error) tab bhi hydrated mark — warna AuthGuard hamesha loading rahe
      onRehydrateStorage: () => () => useAuthStore.getState().setHasHydrated(true),
    },
  ),
);

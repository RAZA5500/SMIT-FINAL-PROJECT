import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/** Cart +/- spam clicks ek API call ban jate hain (FLOW-MD 01 §13, 11 §4) */
export const CART_SYNC_DEBOUNCE_MS = 350;

const syncTimers = new Map<string, ReturnType<typeof setTimeout>>();

export type ProductLayout = "grid" | "list";

interface ShopState {
  /** Optimistic quantities (productId → qty) jab tak debounced sync pending hai — persist nahi hoti */
  optimisticQuantities: Record<string, number>;
  setOptimisticQuantity: (productId: string, quantity: number) => void;
  clearOptimisticQuantity: (productId: string) => void;
  /** Slide-over CartPanel khula hai? (sirf UI state) */
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  /** Shop grid / list — browser mein yaad rehta hai */
  productLayout: ProductLayout;
  setProductLayout: (layout: ProductLayout) => void;
  /** Logout par local cart UI state saaf */
  resetCartLocal: () => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      optimisticQuantities: {},
      setOptimisticQuantity: (productId, quantity) =>
        set((state) => ({
          optimisticQuantities: { ...state.optimisticQuantities, [productId]: quantity },
        })),
      clearOptimisticQuantity: (productId) =>
        set((state) => {
          const next = { ...state.optimisticQuantities };
          delete next[productId];
          return { optimisticQuantities: next };
        }),
      cartOpen: false,
      setCartOpen: (cartOpen) => set({ cartOpen }),
      productLayout: "grid",
      setProductLayout: (productLayout) => set({ productLayout }),
      resetCartLocal: () => {
        syncTimers.forEach((timer) => clearTimeout(timer));
        syncTimers.clear();
        set({ optimisticQuantities: {}, cartOpen: false });
      },
    }),
    {
      name: "freskinto-shop",
      storage: createJSONStorage(() => localStorage),
      // Server data ya optimistic quantities kabhi persist nahi — sirf UI preference
      partialize: ({ productLayout }) => ({ productLayout }),
      // Server aur pehle client render ka HTML same rahe — rehydrate Providers mount par
      skipHydration: true,
    },
  ),
);

/** Per-item debounce: aakhri click ke 350 ms baad sirf ek sync */
export function scheduleCartSync(productId: string, sync: () => void): void {
  cancelCartSync(productId);
  syncTimers.set(
    productId,
    setTimeout(() => {
      syncTimers.delete(productId);
      sync();
    }, CART_SYNC_DEBOUNCE_MS),
  );
}

/** Item remove ho raha ho to pending quantity sync na chale (warna 404) */
export function cancelCartSync(productId: string): void {
  const existing = syncTimers.get(productId);
  if (existing) clearTimeout(existing);
  syncTimers.delete(productId);
}

import { create } from "zustand";

/** Cart +/- spam clicks ek API call ban jate hain (FLOW-MD 01 §13, 11 §4) */
export const CART_SYNC_DEBOUNCE_MS = 350;

const syncTimers = new Map<string, ReturnType<typeof setTimeout>>();

interface ShopState {
  /** Optimistic quantities (productId → qty) jab tak debounced sync pending hai */
  optimisticQuantities: Record<string, number>;
  setOptimisticQuantity: (productId: string, quantity: number) => void;
  clearOptimisticQuantity: (productId: string) => void;
  /** Logout par local cart UI state saaf */
  resetCartLocal: () => void;
}

export const useShopStore = create<ShopState>()((set) => ({
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
  resetCartLocal: () => {
    syncTimers.forEach((timer) => clearTimeout(timer));
    syncTimers.clear();
    set({ optimisticQuantities: {} });
  },
}));

/** Per-item debounce: aakhri click ke 350 ms baad sirf ek sync */
export function scheduleCartSync(productId: string, sync: () => void): void {
  const existing = syncTimers.get(productId);
  if (existing) clearTimeout(existing);
  syncTimers.set(
    productId,
    setTimeout(() => {
      syncTimers.delete(productId);
      sync();
    }, CART_SYNC_DEBOUNCE_MS),
  );
}

import { create } from "zustand";

/** Sirf UI state (drawers) — server data yahan nahi (FLOW-MD 08 §13) */
interface UiState {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  /** Mobile navigation sheet */
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  cartOpen: false,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
}));

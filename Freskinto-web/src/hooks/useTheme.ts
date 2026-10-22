"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

/** localStorage key — `THEME_INIT_SCRIPT` (root layout) bhi yahi padhta hai */
export const THEME_STORAGE_KEY = "freskinto-theme";

/**
 * Paint se pehle `<html>` par `.dark` — warna dark pasand karne wale ko pehle light flash dikhta.
 * Default light hai; OS theme sirf tab jab user ne kabhi khud kuch na chuna ho.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}`;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");

/** `<html>` ki class hi source of truth — har toggle button khud sync rehta hai */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, (): Theme => "light");

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode / blocked storage — theme sirf is session ke liye
    }
  }, []);

  const toggleTheme = useCallback(() => setTheme(getSnapshot() === "dark" ? "light" : "dark"), [setTheme]);

  return { theme, setTheme, toggleTheme };
}

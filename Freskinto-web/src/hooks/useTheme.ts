"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

/** localStorage key — `THEME_INIT_SCRIPT` (root layout) bhi yahi padhta hai */
export const THEME_STORAGE_KEY = "freskinto-theme";

/**
 * Paint se pehle `<html>` par `.dark` — warna dark pasand karne wale ko pehle light flash dikhta.
 * Default light hai; OS theme sirf tab jab user ne kabhi khud kuch na chuna ho. Saath hi
 * `data-motion="on"` (reduced motion na ho to) — scroll reveals sirf JS chalne par content chhupate hain.
 */
export const THEME_INIT_SCRIPT = `try{var d=document.documentElement,t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){d.classList.add("dark")}if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.motion="on"}}catch(e){}`;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");

interface Origin {
  x: number;
  y: number;
}

type DocumentWithTransitions = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

function applyTheme(next: Theme) {
  document.documentElement.classList.toggle("dark", next === "dark");
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Private mode / blocked storage — theme sirf is session ke liye
  }
}

/**
 * `<html>` ki class hi source of truth — har toggle button khud sync rehta hai. `origin` diya ho to
 * naya theme wahan se ek circle mein phailta hai (View Transitions; purane browsers/reduced motion
 * mein seedha switch).
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, (): Theme => "light");

  const setTheme = useCallback((next: Theme, origin?: Origin) => {
    const doc = document as DocumentWithTransitions;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!origin || !doc.startViewTransition || reduceMotion) {
      applyTheme(next);
      return;
    }
    const root = document.documentElement;
    root.style.setProperty("--theme-x", `${origin.x}px`);
    root.style.setProperty("--theme-y", `${origin.y}px`);
    root.classList.add("theme-switching");
    void doc
      .startViewTransition(() => applyTheme(next))
      .finished.finally(() => root.classList.remove("theme-switching"));
  }, []);

  const toggleTheme = useCallback(
    (origin?: Origin) => setTheme(getSnapshot() === "dark" ? "light" : "dark", origin),
    [setTheme],
  );

  return { theme, setTheme, toggleTheme };
}

"use client";

import { useEffect, useState, type RefObject } from "react";

interface InViewOptions {
  /** Ek dafa dikh gaya to dikhta hi rahe (reveals) */
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
}

/**
 * Element viewport mein hai ya nahi (IntersectionObserver). Jahan observer nahi (purane browsers,
 * jsdom tests) wahan seedha `true` — content kabhi chhupa na rahe.
 */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { once = true, rootMargin = "0px 0px -8% 0px", threshold = 0 }: InViewOptions = {},
): boolean {
  const [supported] = useState(() => typeof window === "undefined" || "IntersectionObserver" in window);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !supported) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, once, rootMargin, threshold, supported]);

  return inView || !supported;
}

/** Reduced motion ka live jawab (client par) */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

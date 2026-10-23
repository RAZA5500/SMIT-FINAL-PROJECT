"use client";

import { useEffect, useState } from "react";

/**
 * Placeholder jaisa text jo khud likhta aur mitata hai (phrases ek ke baad ek). `enabled` false ho
 * (user type kar raha ho) ya reduced motion ho to pehla phrase seedha.
 */
export function useTypewriter(phrases: readonly string[], enabled = true): string {
  const [text, setText] = useState(phrases[0] ?? "");
  const active = enabled && phrases.length > 1;

  useEffect(() => {
    if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let phrase = 0;
    let chars = phrases[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (deleting) {
        chars -= 1;
        if (chars <= 0) {
          deleting = false;
          phrase = (phrase + 1) % phrases.length;
        }
      } else {
        chars += 1;
      }
      const current = phrases[phrase];
      setText(current.slice(0, Math.max(chars, 0)));
      if (!deleting && chars >= current.length) {
        deleting = true;
        timer = setTimeout(tick, 1900);
        return;
      }
      timer = setTimeout(tick, deleting ? 32 : 75);
    };

    timer = setTimeout(tick, 2200);
    return () => clearTimeout(timer);
  }, [active, phrases]);

  return active ? text : (phrases[0] ?? "");
}

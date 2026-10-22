"use client";

import { useEffect, useState } from "react";

/**
 * Neeche scroll par `true` (header chhupao), upar scroll par `false` — mobile par
 * content ko zyada jagah. `threshold` se pehle hamesha dikhta hai.
 */
export function useHideOnScroll(threshold = 140): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - last;
        if (Math.abs(delta) < 6) return;
        setHidden(delta > 0 && y > threshold);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold]);

  return hidden;
}

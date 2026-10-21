import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * globals.css ke custom tokens tailwind-merge ko batate hain — warna `shadow-soft`
 * aur `shadow-lg` jaisi conflicting classes dono reh jaati hain.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      shadow: ["soft", "lift", "glow"],
      animate: ["marquee", "float", "bump", "fade-up"],
      container: ["page"],
    },
  },
});

/** Conditional classes — template literals ki jagah (FLOW-MD 07 §4) */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

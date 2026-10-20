import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * globals.css ke custom scales tailwind-merge ko batate hain — warna `text-fs-11`
 * ko color samajh kar `text-muted-green` ke saath merge karte hue gira deta.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "fs-6",
        "fs-8",
        "fs-10",
        "fs-11",
        "fs-12",
        "fs-15",
        "fs-26",
        "3xs",
        "body-lg",
        "cart-btn",
        "section-heading-md",
        "promo-title",
      ],
      radius: ["5", "6", "10", "12", "15", "18", "22", "60"],
      shadow: ["card", "btn", "overlay"],
    },
  },
});

/** Conditional classes — template literals ki jagah (FLOW-MD 07 §4) */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * globals.css ke custom tokens tailwind-merge ko batate hain — warna `text-fs-20`
 * ko color samajh kar `text-muted-foreground` ke saath conflict hota, aur `shadow-soft`
 * / `shadow-lg` jaisi conflicting classes dono reh jaati hain.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["fs-11", "fs-12", "fs-13", "fs-15"],
      shadow: ["soft", "lift", "glow", "glass"],
      animate: [
        "fade-up",
        "pop-in",
        "bump",
        "float",
        "float-slow",
        "drift",
        "drift-slow",
        "shimmer",
        "marquee",
        "marquee-reverse",
        "orbit",
        "orbit-counter",
        "spin-slow",
        "ping-soft",
        "drive",
        "ring-fill",
        "step-glow",
        "confetti",
      ],
      ease: ["out-expo", "spring", "in-out-quint"],
      spacing: ["header"],
      container: ["page", "form"],
    },
  },
});

/** Har className isi wrapper se — conditional classes template literals ki jagah (FLOW-MD 07 §4) */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Invalid submit par pehli ghalat field tak scroll + focus (FLOW-MD 07 §6, 09 §1.4) */
export function scrollToFirstError(formId: string): void {
  const field = document
    .getElementById(formId)
    ?.querySelector<HTMLElement>("[aria-invalid='true']");
  if (!field) return;
  field.scrollIntoView({ behavior: "smooth", block: "center" });
  field.focus({ preventScroll: true });
}

/** Backend money hamesha string ("12.50") bhejta hai — UI sirf format karti hai, hisaab nahi */
export function formatMoney(amount: string | number): string {
  const value = typeof amount === "number" ? amount : Number(amount);
  return `£${Number.isFinite(value) ? value.toFixed(2) : "0.00"}`;
}

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  return dateTimeFormatter.format(new Date(value));
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  return dateFormatter.format(new Date(value));
}

/** Avatar ke liye naam ke pehle do huroof ("Ayesha Khan" → "AK") */
export function initials(name: string | null | undefined): string {
  return (name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** "1 item" / "3 items" — count ke saath sahi singular/plural */
export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

"use client"

import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

const COLOURS = ["#22d38a", "#14c0b0", "#2aa8f2", "#ffc53d", "#ff9a3d", "#ff5a4f", "#a78bfa"]
const PIECES = 36

/** Deterministic "random" — server aur client ek jaise */
const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

/**
 * Khushi ka chhota sa dhamaka (order paid, account bana) — ek dafa chalta hai. Reduced motion par
 * kuch nahi dikhta.
 */
function Confetti({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      data-slot="confetti"
      className={cn("pointer-events-none absolute inset-0 overflow-visible motion-reduce:hidden", className)}
    >
      {Array.from({ length: PIECES }, (_, i) => {
        const angle = rand(i + 1) * Math.PI * 2
        const distance = 90 + rand(i + 7) * 170
        const style = {
          "--x": `${Math.cos(angle) * distance}px`,
          "--y": `${Math.sin(angle) * distance - 60}px`,
          "--r": `${Math.round(rand(i + 3) * 720 - 360)}deg`,
          animationDelay: `${Math.round(rand(i + 11) * 120)}ms`,
          backgroundColor: COLOURS[i % COLOURS.length],
        } as CSSProperties
        return (
          <span
            key={i}
            style={style}
            className={cn(
              "absolute top-1/2 left-1/2 h-3 w-1.5 animate-confetti",
              i % 3 === 0 && "h-2 w-2 rounded-full",
              i % 3 === 1 && "rounded-sm"
            )}
          />
        )
      })}
    </div>
  )
}

export { Confetti }

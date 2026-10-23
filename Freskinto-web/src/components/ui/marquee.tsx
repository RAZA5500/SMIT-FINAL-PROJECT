import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps {
  children: ReactNode
  /** Ulti disha */
  reverse?: boolean
  /** Ek chakkar ka waqt, e.g. "40s" */
  duration?: string
  pauseOnHover?: boolean
  className?: string
  /** Har copy (items ki line) par */
  trackClassName?: string
  "aria-label"?: string
}

/**
 * Lagatar chalti line (logos, aisles, reviews). Content do dafa render hota hai; doosri copy
 * screen readers aur keyboard se chhupi (`aria-hidden` + `inert`). Reduced motion par ruki rehti hai.
 */
function Marquee({
  children,
  reverse = false,
  duration = "40s",
  pauseOnHover = true,
  className,
  trackClassName,
  "aria-label": ariaLabel,
}: MarqueeProps) {
  return (
    <div
      data-slot="marquee"
      role={ariaLabel ? "region" : undefined}
      aria-label={ariaLabel}
      className={cn("group/marquee flex overflow-hidden mask-fade-x", className)}
    >
      <div
        className={cn(
          "flex w-max shrink-0",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]"
        )}
        style={{ animationDuration: duration } as CSSProperties}
      >
        <div className={cn("flex shrink-0 items-center", trackClassName)}>{children}</div>
        <div aria-hidden="true" inert className={cn("flex shrink-0 items-center", trackClassName)}>
          {children}
        </div>
      </div>
    </div>
  )
}

export { Marquee }

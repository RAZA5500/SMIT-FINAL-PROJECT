"use client"

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface IndicatorBox {
  left: number
  top: number
  width: number
  height: number
}

interface HoverIndicatorProps {
  children: ReactNode
  className?: string
  indicatorClassName?: string
  /** Hover na ho to pill is item par rukti hai */
  activeSelector?: string
  /** Badle (e.g. pathname) to pill naye active item par slide kare */
  activeKey?: string
}

/**
 * "Magic pill": `data-indicator-item` wale bachchon par hover/focus karo to ek pill smooth slide
 * karke uske peeche aa jati hai; chhodo to active item (aria-current) par wapas.
 */
function HoverIndicator({
  children,
  className,
  indicatorClassName,
  activeSelector = '[aria-current="page"], [data-active]',
  activeKey,
}: HoverIndicatorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<IndicatorBox | null>(null)

  const measure = useCallback((item: Element | null) => {
    const root = ref.current
    if (!root || !item) {
      setBox(null)
      return
    }
    const rootRect = root.getBoundingClientRect()
    const rect = item.getBoundingClientRect()
    setBox({ left: rect.left - rootRect.left, top: rect.top - rootRect.top, width: rect.width, height: rect.height })
  }, [])

  const settle = useCallback(() => {
    const active = ref.current?.querySelector(`[data-indicator-item]:is(${activeSelector}), [data-indicator-item] :is(${activeSelector})`)
    measure(active?.closest("[data-indicator-item]") ?? null)
  }, [activeSelector, measure])

  useEffect(() => {
    settle()
    const root = ref.current
    if (!root || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(settle)
    observer.observe(root)
    return () => observer.disconnect()
  }, [settle, activeKey])

  const onTarget = (target: EventTarget | null) => {
    const item = target instanceof Element ? target.closest("[data-indicator-item]") : null
    if (item && ref.current?.contains(item)) measure(item)
  }

  return (
    <div
      ref={ref}
      data-slot="hover-indicator"
      className={cn("relative", className)}
      onPointerOver={(event) => onTarget(event.target)}
      onFocus={(event) => onTarget(event.target)}
      onPointerLeave={settle}
      onBlur={settle}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute rounded-full bg-foreground/[0.06] transition-[left,top,width,height,opacity] duration-500 ease-out-expo dark:bg-foreground/[0.09]",
          box ? "opacity-100" : "opacity-0",
          indicatorClassName
        )}
        style={(box ?? { left: 0, top: 0, width: 0, height: 0 }) as CSSProperties}
      />
      {children}
    </div>
  )
}

export { HoverIndicator }

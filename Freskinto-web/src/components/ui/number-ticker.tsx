"use client"

import { useEffect, useRef } from "react"
import { useInView } from "@/hooks/useInView"
import { cn } from "@/lib/utils"

interface NumberTickerProps {
  value: number
  /** Dikhane ka format (default: 1,234) */
  format?: (value: number) => string
  /** ms */
  duration?: number
  className?: string
}

const defaultFormat = (value: number) => Math.round(value).toLocaleString("en-GB")

/**
 * Number viewport mein aate hi 0 se ginti karta hai (expo-out). Server HTML aur reduced motion par
 * asli value hi rehti hai; ginti DOM text par hoti hai, React re-render nahi.
 */
function NumberTicker({ value, format = defaultFormat, duration = 1600, className }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref)
  const formatRef = useRef(format)

  useEffect(() => {
    formatRef.current = format
  })

  useEffect(() => {
    const element = ref.current
    if (!element || !inView) return
    if (document.documentElement.dataset.motion !== "on") {
      element.textContent = formatRef.current(value)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(2, -10 * t)
      element.textContent = formatRef.current(value * (t === 1 ? 1 : eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, duration])

  return (
    <span ref={ref} data-slot="number-ticker" className={cn("tabular-nums", className)}>
      {format(value)}
    </span>
  )
}

export { NumberTicker }

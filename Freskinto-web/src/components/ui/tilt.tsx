"use client"

import { useRender } from "@base-ui/react/use-render"
import { useCallback, useEffect, useRef, type PointerEvent } from "react"
import { cn } from "@/lib/utils"

type TiltProps = useRender.ComponentProps<"div"> & {
  /** Zyada se zyada jhukaav (deg) */
  max?: number
}

const scrollSubscribers = new Set<() => void>()
let isListening = false

function handleWindowScrollAndResize() {
  scrollSubscribers.forEach((fn) => fn())
}

function subscribeToScrollAndResize(fn: () => void) {
  scrollSubscribers.add(fn)
  if (!isListening && typeof window !== "undefined") {
    window.addEventListener("scroll", handleWindowScrollAndResize, { passive: true })
    window.addEventListener("resize", handleWindowScrollAndResize, { passive: true })
    isListening = true
  }
  return () => {
    scrollSubscribers.delete(fn)
    if (scrollSubscribers.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("scroll", handleWindowScrollAndResize)
      window.removeEventListener("resize", handleWindowScrollAndResize)
      isListening = false
    }
  }
}

/**
 * Mouse ke saath halka 3D jhukaav — CSS vars (`--tilt-x/-y`, `--glare-x/-y`) set karta hai, re-render
 * nahi. Touch aur reduced motion par seedha rehta hai. Bachche `--glare-*` se chamak bana sakte hain.
 */
function Tilt({
  max = 7,
  className,
  render,
  onPointerEnter: onPointerEnterProp,
  onPointerMove: onPointerMoveProp,
  onPointerLeave: onPointerLeaveProp,
  ...props
}: TiltProps) {
  const rectRef = useRef<DOMRect | null>(null)
  const rafRef = useRef<number | null>(null)
  const cleanupListenerRef = useRef<(() => void) | null>(null)

  const detachListener = useCallback(() => {
    if (cleanupListenerRef.current) {
      cleanupListenerRef.current()
      cleanupListenerRef.current = null
    }
  }, [])

  const attachListener = useCallback(() => {
    if (!cleanupListenerRef.current) {
      cleanupListenerRef.current = subscribeToScrollAndResize(() => {
        rectRef.current = null
      })
    }
  }, [])

  useEffect(() => {
    return () => {
      detachListener()
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [detachListener])

  const handlePointerEnter = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      onPointerEnterProp?.(event)
      if ((event as unknown as { baseUIHandlerPrevented?: boolean }).baseUIHandlerPrevented) return
      if (event.pointerType !== "mouse") return
      attachListener()
      rectRef.current = event.currentTarget.getBoundingClientRect()
    },
    [attachListener, onPointerEnterProp]
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      onPointerMoveProp?.(event)
      if ((event as unknown as { baseUIHandlerPrevented?: boolean }).baseUIHandlerPrevented) return
      if (event.pointerType !== "mouse") return
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      if (!rectRef.current) {
        attachListener()
        rectRef.current = event.currentTarget.getBoundingClientRect()
      }
      const element = event.currentTarget
      const rect = rectRef.current
      const clientX = event.clientX
      const clientY = event.clientY

      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        if (!rect || rect.width <= 0 || rect.height <= 0) return
        const x = (clientX - rect.left) / rect.width - 0.5
        const y = (clientY - rect.top) / rect.height - 0.5
        element.style.setProperty("--tilt-x", `${(x * max * 2).toFixed(2)}deg`)
        element.style.setProperty("--tilt-y", `${(-y * max * 2).toFixed(2)}deg`)
        element.style.setProperty("--glare-x", `${((x + 0.5) * 100).toFixed(1)}%`)
        element.style.setProperty("--glare-y", `${((y + 0.5) * 100).toFixed(1)}%`)
      })
    },
    [attachListener, max, onPointerMoveProp]
  )

  const handlePointerLeave = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      onPointerLeaveProp?.(event)
      if ((event as unknown as { baseUIHandlerPrevented?: boolean }).baseUIHandlerPrevented) return
      detachListener()
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      rectRef.current = null
      event.currentTarget.style.setProperty("--tilt-x", "0deg")
      event.currentTarget.style.setProperty("--tilt-y", "0deg")
      event.currentTarget.style.removeProperty("--glare-x")
      event.currentTarget.style.removeProperty("--glare-y")
    },
    [detachListener, onPointerLeaveProp]
  )

  return useRender({
    defaultTagName: "div",
    render,
    props: {
      ...props,
      className: cn(
        "transition-transform duration-500 ease-out-expo hover:duration-150 hover:ease-out hover:will-change-transform [transform:perspective(1000px)_rotateX(var(--tilt-y,0deg))_rotateY(var(--tilt-x,0deg))]",
        className
      ),
      onPointerEnter: handlePointerEnter,
      onPointerMove: handlePointerMove,
      onPointerLeave: handlePointerLeave,
    },
    state: { slot: "tilt" },
  })
}

export { Tilt }

"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { useCallback, type PointerEvent } from "react"
import { cn } from "@/lib/utils"

type TiltProps = useRender.ComponentProps<"div"> & {
  /** Zyada se zyada jhukaav (deg) */
  max?: number
}

/**
 * Mouse ke saath halka 3D jhukaav — CSS vars (`--tilt-x/-y`, `--glare-x/-y`) set karta hai, re-render
 * nahi. Touch aur reduced motion par seedha rehta hai. Bachche `--glare-*` se chamak bana sakte hain.
 */
function Tilt({ max = 7, className, render, ...props }: TiltProps) {
  // Ref ki zaroorat nahi — event.currentTarget hi element hai (pointermove browser khud frame se milata hai)
  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== "mouse") return
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      const element = event.currentTarget
      const rect = element.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      element.style.setProperty("--tilt-x", `${(x * max * 2).toFixed(2)}deg`)
      element.style.setProperty("--tilt-y", `${(-y * max * 2).toFixed(2)}deg`)
      element.style.setProperty("--glare-x", `${((x + 0.5) * 100).toFixed(1)}%`)
      element.style.setProperty("--glare-y", `${((y + 0.5) * 100).toFixed(1)}%`)
    },
    [max]
  )

  const onPointerLeave = useCallback((event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg")
    event.currentTarget.style.setProperty("--tilt-y", "0deg")
  }, [])

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(
      {
        className: cn(
          "transition-transform duration-500 ease-out-expo will-change-transform [transform:perspective(1000px)_rotateX(var(--tilt-y,0deg))_rotateY(var(--tilt-x,0deg))]",
          className
        ),
        onPointerMove,
        onPointerLeave,
      },
      props
    ),
    state: { slot: "tilt" },
  })
}

export { Tilt }

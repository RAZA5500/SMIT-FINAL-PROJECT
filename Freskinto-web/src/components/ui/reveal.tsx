"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { useRef, type ComponentProps, type CSSProperties } from "react"
import { useInView } from "@/hooks/useInView"

type RevealVariant = "up" | "scale" | "left" | "right" | "fade"

type RevealProps = useRender.ComponentProps<"div"> & {
  /** Kis taraf se aaye — default neeche se upar */
  variant?: RevealVariant
  /** Stagger ke liye (ms) */
  delay?: number
}

/**
 * Scroll reveal: viewport mein aate hi content blur + slide se ubharta hai (CSS in globals.css,
 * `[data-reveal]`). Content sirf tab chhupta hai jab init script ne `data-motion="on"` lagaya ho.
 */
function Reveal({ variant = "up", delay = 0, render, style, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref)

  return useRender({
    defaultTagName: "div",
    ref,
    render,
    props: mergeProps<"div">(
      {
        style: { ...style, "--reveal-delay": `${delay}ms` } as CSSProperties,
        "data-reveal": variant === "up" ? "" : variant,
        "data-visible": visible ? "" : undefined,
      } as ComponentProps<"div">,
      props
    ),
    state: { slot: "reveal" },
  })
}

export { Reveal }

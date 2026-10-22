import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cn } from "@/lib/utils"

/**
 * Semantic elements the layout primitives can render through `as`. Feature
 * code composes these components instead of writing raw HTML tags.
 */
export type LayoutTag =
  | "div"
  | "span"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "main"
  | "nav"
  | "ul"
  | "ol"
  | "li"
  | "dl"
  | "dt"
  | "dd"
  | "figure"
  | "figcaption"
  | "address"
  | "blockquote"

export type BoxProps = useRender.ComponentProps<"div"> & {
  /** Rendered element (default `div`) */
  as?: LayoutTag
}

/** Plain styled block — the escape hatch for one-off layout (position, sizing) */
function Box({ as = "div", className, render, ...props }: BoxProps) {
  return useRender({
    defaultTagName: as,
    props: mergeProps<"div">({ className: cn(className) }, props),
    render,
    state: { slot: "box" },
  })
}

export { Box }

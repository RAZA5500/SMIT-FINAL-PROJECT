import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import type { BoxProps } from "@/components/ui/box"
import { gapScale } from "@/components/ui/flex"

const gridVariants = cva("grid", {
  variants: {
    cols: {
      "1": "grid-cols-1",
      "2": "grid-cols-2",
      "3": "grid-cols-3",
      "4": "grid-cols-4",
      "5": "grid-cols-5",
      "6": "grid-cols-6",
      "12": "grid-cols-12",
    },
    gap: gapScale,
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
  },
})

export type GridProps = BoxProps & VariantProps<typeof gridVariants>

/** CSS grid with typed columns/gap — breakpoint columns go in className (`sm:grid-cols-2`) */
function Grid({
  as = "div",
  cols,
  gap,
  align,
  className,
  render,
  ...props
}: GridProps) {
  return useRender({
    defaultTagName: as,
    props: mergeProps<"div">(
      { className: cn(gridVariants({ cols, gap, align }), className) },
      props
    ),
    render,
    state: { slot: "grid" },
  })
}

export { Grid, gridVariants }

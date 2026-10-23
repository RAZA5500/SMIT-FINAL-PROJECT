import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import type { BoxProps } from "@/components/ui/box"

/** Gap scale shared by Flex and Grid — values match Tailwind's `gap-*` steps */
export const gapScale = {
  "0": "gap-0",
  "0.5": "gap-0.5",
  "1": "gap-1",
  "1.5": "gap-1.5",
  "2": "gap-2",
  "2.5": "gap-2.5",
  "3": "gap-3",
  "4": "gap-4",
  "5": "gap-5",
  "6": "gap-6",
  "7": "gap-7",
  "8": "gap-8",
  "10": "gap-10",
  "12": "gap-12",
  "16": "gap-16",
} as const

const flexVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      col: "flex-col",
      "row-reverse": "flex-row-reverse",
      "col-reverse": "flex-col-reverse",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      baseline: "items-baseline",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    },
    gap: gapScale,
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
    inline: {
      true: "inline-flex",
      false: "",
    },
  },
  defaultVariants: {
    direction: "row",
  },
})

export type FlexProps = BoxProps & VariantProps<typeof flexVariants>

/** Flexbox row/column with typed gap + alignment (responsive tweaks via className) */
function Flex({
  as = "div",
  direction,
  align,
  justify,
  gap,
  wrap,
  inline,
  className,
  render,
  ...props
}: FlexProps) {
  return useRender({
    defaultTagName: as,
    props: mergeProps<"div">(
      {
        className: cn(
          flexVariants({ direction, align, justify, gap, wrap, inline }),
          className
        ),
      },
      props
    ),
    render,
    state: { slot: "flex" },
  })
}

/** Vertical stack — `Flex` with `direction="col"` */
function Stack({ direction = "col", ...props }: FlexProps) {
  return <Flex direction={direction} {...props} />
}

export { Flex, Stack, flexVariants }

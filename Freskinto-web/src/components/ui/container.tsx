import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import type { BoxProps } from "@/components/ui/box"

const containerVariants = cva("mx-auto w-full px-4 sm:px-6 lg:px-8", {
  variants: {
    size: {
      page: "max-w-page",
      narrow: "max-w-3xl",
      form: "max-w-xl",
      full: "max-w-none",
    },
  },
  defaultVariants: {
    size: "page",
  },
})

/** Page-width wrapper with the shared side gutters (16px on phones) */
function Container({
  as = "div",
  size,
  className,
  render,
  ...props
}: BoxProps & VariantProps<typeof containerVariants>) {
  return useRender({
    defaultTagName: as,
    props: mergeProps<"div">(
      { className: cn(containerVariants({ size }), className) },
      props
    ),
    render,
    state: { slot: "container" },
  })
}

export { Container, containerVariants }

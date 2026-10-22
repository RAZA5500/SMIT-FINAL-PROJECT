import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/** Pills for labels and status — soft tinted surfaces with AA-contrast ink */
const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-transparent px-2.5 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring/35 [&>svg]:pointer-events-none [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-brand-green text-white",
        brand: "border-brand-green/15 bg-brand-soft text-brand-green-dark",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border-border bg-card text-foreground",
        success: "bg-success-soft text-success-ink",
        warning: "bg-warning-soft text-warning-ink",
        info: "bg-info-soft text-info-ink",
        destructive: "bg-tomato-soft text-tomato-ink",
        neutral: "bg-neutral-soft text-neutral-ink",
        ink: "bg-brand-green-forest text-white",
        sale: "bg-brand-orange text-white",
        marigold: "bg-marigold text-ink",
        tag: "rounded-md border-border bg-muted px-2 text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }

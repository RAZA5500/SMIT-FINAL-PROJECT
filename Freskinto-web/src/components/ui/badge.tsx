import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Pills for labels and status — soft tinted surfaces with AA-contrast ink. `sticker` variants
 * (lime / tangerine) are the playful, slightly tilted storefront labels.
 */
const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-transparent px-2.5 text-xs font-semibold whitespace-nowrap transition-colors focus-visible:ring-3 focus-visible:ring-ring/35 [&>svg]:pointer-events-none [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        brand: "border-primary/15 bg-plum-soft text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border-border bg-card text-foreground",
        success: "bg-success-soft text-success-ink",
        warning: "bg-warning-soft text-warning-ink",
        info: "bg-info-soft text-info-ink",
        destructive: "bg-destructive-soft text-destructive-ink",
        neutral: "bg-neutral-soft text-neutral-ink",
        lime: "bg-lime font-bold text-lime-foreground",
        tangerine: "bg-tangerine font-bold text-tangerine-foreground",
        night: "bg-night text-night-foreground",
        sticker:
          "h-7 -rotate-3 rounded-lg border-2 border-pop bg-lime px-2.5 font-bold text-lime-foreground shadow-pop-sm",
        "sticker-tangerine":
          "h-7 rotate-2 rounded-lg border-2 border-pop bg-tangerine px-2.5 font-bold text-tangerine-foreground shadow-pop-sm",
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

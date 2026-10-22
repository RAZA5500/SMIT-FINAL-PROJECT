import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Pills for status and labels — fresh e-commerce styling per FLOW-MD:
 * `success`, `warning`, `info`, `destructive`, `brand`
 */
const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-transparent px-2.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3.5!",
  {
    variants: {
      variant: {
        default: "bg-brand-green text-white [a]:hover:bg-brand-green-dark",
        brand: "bg-icon-green text-brand-green-forest border border-brand-green/30 font-semibold",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-accent",
        outline:
          "border-border bg-background text-foreground [a]:hover:bg-muted",
        ink: "bg-slate-800 text-white",
        destructive:
          "border-red-200 bg-red-50 text-red-700 focus-visible:ring-destructive/20 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/40 [a]:hover:bg-red-100",
        danger: "bg-tomato text-white",
        success: "border-emerald-200/80 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40",
        warning: "border-amber-200/80 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40",
        info: "border-blue-200/80 bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/40",
        tag: "rounded-md border-border bg-muted/60 px-2 text-xs font-medium text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
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

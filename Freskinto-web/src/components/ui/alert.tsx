import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/** Notices: plain bordered box; the icon carries the status colour, errors get a soft red surface */
const alertVariants = cva(
  "group/alert relative flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm [&>svg]:mt-0.5 [&>svg]:shrink-0 [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground [&>svg]:text-muted-foreground",
        brand: "border-border bg-card text-card-foreground [&>svg]:text-primary",
        success: "border-border bg-card text-card-foreground [&>svg]:text-success",
        warning: "border-warning/30 bg-warning-soft text-warning-ink [&>svg]:text-warning",
        info: "border-border bg-card text-card-foreground [&>svg]:text-info",
        destructive: "border-destructive/25 bg-destructive-soft text-destructive-ink [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

/** Title + description ka column (icon ke baad) */
function AlertBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-body"
      className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-semibold [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertBody, AlertTitle, AlertDescription, alertVariants }

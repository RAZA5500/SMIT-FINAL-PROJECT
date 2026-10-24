import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full resize-y rounded-2xl border border-input bg-card/70 px-4 py-3 dark:bg-input/30 text-base text-foreground shadow-xs transition-colors outline-none placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:bg-muted dark:disabled:bg-muted/60 disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/15 read-only:bg-muted/60 dark:read-only:bg-muted/40 dark:[color-scheme:dark] md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

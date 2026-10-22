import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * `<form>` primitive for react-hook-form screens. `noValidate` by default —
 * Zod (via zodResolver) owns validation and the error messages.
 */
function Form({
  className,
  noValidate = true,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form
      data-slot="form"
      noValidate={noValidate}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    />
  )
}

export { Form }

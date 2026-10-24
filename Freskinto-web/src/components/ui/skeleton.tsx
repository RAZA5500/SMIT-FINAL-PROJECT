import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("animate-shimmer rounded-2xl bg-[linear-gradient(100deg,var(--muted)_20%,color-mix(in_oklab,var(--muted),white_55%)_40%,var(--muted)_60%)] [background-size:200%_100%] dark:bg-[linear-gradient(100deg,var(--muted)_20%,color-mix(in_oklab,var(--muted),white_7%)_40%,var(--muted)_60%)]", className)}
      {...props}
    />
  )
}

export { Skeleton }

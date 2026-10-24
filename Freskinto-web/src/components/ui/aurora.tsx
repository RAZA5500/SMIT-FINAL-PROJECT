import { cn } from "@/lib/utils"

/**
 * Page ke peeche dheere tairte rang (mint, sky, peach, lilac) + film grain. Radial gradients hain,
 * blur filter nahi — sasta paint, GPU par sirf translate/scale.
 */
function Aurora({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      data-slot="aurora"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden transform-gpu [contain:strict] [transform:translateZ(0)]",
        className
      )}
    >
      <div className="absolute -top-[30vh] -left-[20vw] size-[75vw] animate-drift rounded-full bg-[radial-gradient(closest-side,var(--aurora-1),transparent)] opacity-(--aurora-opacity) will-change-transform" />
      <div className="absolute -top-[20vh] -right-[25vw] size-[70vw] animate-drift-slow rounded-full bg-[radial-gradient(closest-side,var(--aurora-2),transparent)] opacity-(--aurora-opacity) will-change-transform" />
      <div className="absolute top-[45vh] -left-[10vw] size-[60vw] animate-drift-slow rounded-full bg-[radial-gradient(closest-side,var(--aurora-3),transparent)] opacity-(--aurora-opacity) will-change-transform" />
      <div className="absolute top-[55vh] right-[-15vw] size-[55vw] animate-drift rounded-full bg-[radial-gradient(closest-side,var(--aurora-4),transparent)] opacity-(--aurora-opacity) will-change-transform" />
      <div className="grain absolute inset-0 opacity-[0.03] pointer-events-none dark:opacity-[0.045]" />
    </div>
  )
}

export { Aurora }

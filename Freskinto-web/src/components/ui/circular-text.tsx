import { useId } from "react"
import { cn } from "@/lib/utils"

interface CircularTextProps {
  /** Gol ghoomne wala text — aakhir mein separator khud lagayein */
  text: string
  className?: string
}

/** Ek gol path par likha text (badge, orb ke gird) — `animate-spin-slow` se ghuma sakte hain */
function CircularText({ text, className }: CircularTextProps) {
  const id = `circle-${useId().replace(/[^a-zA-Z0-9]/g, "")}`
  return (
    <svg data-slot="circular-text" viewBox="0 0 200 200" aria-hidden="true" className={cn("overflow-visible", className)}>
      <defs>
        <path id={id} d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
      </defs>
      <text className="fill-current font-display text-[12px] font-semibold uppercase">
        {/* textLength = path ki poori gol lambai (2π·82): text hamesha theek ek chakkar banata hai */}
        <textPath href={`#${id}`} textLength="512" lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
    </svg>
  )
}

export { CircularText }

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Till receipt — Freskinto's signature surface for totals (basket, checkout,
 * order detail). Perforated edges come from the `receipt-edge` mask, so the
 * outer wrapper carries the drop shadow (a mask would clip a box-shadow).
 */
function Receipt({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="receipt"
      className={cn("rounded-2xl border border-border/80 bg-card p-6 shadow-soft", className)}
      {...props}
    >
      <div className="flex flex-col gap-4 text-sm">
        {children}
      </div>
    </section>
  )
}

function ReceiptHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="receipt-header"
      className={cn("flex flex-col items-center gap-1 text-center", className)}
      {...props}
    />
  )
}

function ReceiptTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="receipt-title"
      className={cn(
        "font-heading text-xl leading-tight font-bold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  )
}

function ReceiptMeta({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="receipt-meta"
      className={cn(
        "text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/** Dashed till rule */
function ReceiptSeparator({
  className,
  ...props
}: React.ComponentProps<"hr">) {
  return (
    <hr
      data-slot="receipt-separator"
      className={cn("border-0 border-t border-dashed border-input", className)}
      {...props}
    />
  )
}

function ReceiptLines({ className, ...props }: React.ComponentProps<"dl">) {
  return (
    <dl
      data-slot="receipt-lines"
      className={cn("flex flex-col gap-2.5", className)}
      {...props}
    />
  )
}

interface ReceiptRowProps extends Omit<React.ComponentProps<"div">, "children"> {
  label: React.ReactNode
  value: React.ReactNode
  /** Bold total line */
  emphasis?: boolean
}

function ReceiptRow({
  label,
  value,
  emphasis = false,
  className,
  ...props
}: ReceiptRowProps) {
  return (
    <div
      data-slot="receipt-row"
      className={cn("flex items-baseline justify-between gap-4", className)}
      {...props}
    >
      <dt
        className={cn(
          "min-w-0",
          emphasis ? "font-semibold text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
      </dt>
      <dd
        className={cn(
          "shrink-0 text-right tabular-nums",
          emphasis
            ? "font-heading text-2xl font-semibold tracking-tight"
            : "font-medium"
        )}
      >
        {value}
      </dd>
    </div>
  )
}

function ReceiptFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="receipt-footer"
      className={cn(
        "flex flex-col items-center gap-2 text-center text-xs text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/** Decorative barcode strip (no information — hidden from screen readers) */
function ReceiptBarcode({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-slot="receipt-barcode"
      className={cn("flex h-6 items-center justify-center gap-0.5 opacity-40", className)}
      {...props}
    >
      {/* Visual decorative supermarket barcode stripes */}
      <span className="h-full w-0.5 bg-foreground" />
      <span className="h-full w-px bg-foreground" />
      <span className="h-full w-0.5 bg-foreground" />
      <span className="h-full w-px bg-foreground" />
      <span className="h-full w-0.5 bg-foreground" />
      <span className="h-full w-1 bg-foreground" />
      <span className="h-full w-px bg-foreground" />
      <span className="h-full w-0.5 bg-foreground" />
      <span className="h-full w-px bg-foreground" />
      <span className="h-full w-0.5 bg-foreground" />
      <span className="h-full w-0.5 bg-foreground" />
      <span className="h-full w-px bg-foreground" />
      <span className="h-full w-0.5 bg-foreground" />
      <span className="h-full w-0.5 bg-foreground" />
      <span className="h-full w-px bg-foreground" />
      <span className="h-full w-1 bg-foreground" />
      <span className="h-full w-0.5 bg-foreground" />
      <span className="h-full w-px bg-foreground" />
    </div>
  )
}

export {
  Receipt,
  ReceiptBarcode,
  ReceiptFooter,
  ReceiptHeader,
  ReceiptLines,
  ReceiptMeta,
  ReceiptRow,
  ReceiptSeparator,
  ReceiptTitle,
}

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ---------------------------------------------------------------------------
   Heading — Unbounded for display sizes (tight tracking), Manrope bold for the small ones.
   Accent words inside a heading: <Text as="em" variant="accent">…</Text>
--------------------------------------------------------------------------- */

const headingVariants = cva("text-balance", {
  variants: {
    size: {
      hero: "font-display text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.045em] sm:text-6xl lg:text-[5.25rem]",
      display: "font-display text-4xl leading-[1.04] font-semibold tracking-[-0.04em] sm:text-5xl",
      "1": "font-display text-3xl leading-[1.08] font-semibold tracking-[-0.035em] sm:text-4xl",
      "2": "font-display text-2xl leading-tight font-semibold tracking-[-0.03em] sm:text-[1.75rem]",
      "3": "text-lg leading-snug font-bold tracking-tight",
      "4": "text-base leading-snug font-bold",
      "5": "text-sm leading-snug font-bold",
    },
    tone: {
      default: "text-foreground",
      inherit: "",
      muted: "text-muted-foreground",
      primary: "text-brand-ink",
    },
  },
  defaultVariants: {
    size: "2",
    tone: "default",
  },
})

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"
type HeadingSize = NonNullable<VariantProps<typeof headingVariants>["size"]>

const HEADING_TAGS: Record<HeadingSize, HeadingTag> = {
  hero: "h1",
  display: "h1",
  "1": "h1",
  "2": "h2",
  "3": "h3",
  "4": "h4",
  "5": "h5",
}

type HeadingProps = useRender.ComponentProps<"h2"> &
  VariantProps<typeof headingVariants> & {
    /** Element override — size picks a sensible default (`2` → `h2`) */
    as?: HeadingTag
  }

function Heading({ as, size, tone, className, render, ...props }: HeadingProps) {
  return useRender({
    defaultTagName: as ?? HEADING_TAGS[size ?? "2"],
    props: mergeProps<"h2">(
      { className: cn(headingVariants({ size, tone }), className) },
      props
    ),
    render,
    state: { slot: "heading" },
  })
}

/* ---------------------------------------------------------------------------
   Text — body copy, captions, eyebrows and mono details
--------------------------------------------------------------------------- */

const textVariants = cva("", {
  variants: {
    variant: {
      body: "text-sm leading-relaxed",
      lead: "text-base leading-relaxed text-muted-foreground sm:text-lg",
      small: "text-xs leading-normal",
      label: "text-sm leading-none font-medium",
      eyebrow: "text-fs-11 leading-none font-bold tracking-[0.18em] uppercase",
      /* pb/-mb: gradient sirf box ke andar rangta hai — "y", "g" ki dum ke liye jagah, layout wahi */
      accent:
        "-mb-[0.14em] inline-block pr-[0.08em] pb-[0.14em] font-serif font-normal tracking-normal italic text-fresh animate-shimmer",
      code: "font-mono text-xs tracking-tight",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    },
    tone: {
      default: "text-foreground",
      inherit: "",
      muted: "text-muted-foreground",
      primary: "text-brand-ink",
      destructive: "text-destructive",
      success: "text-success-ink",
      warning: "text-warning-ink",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    family: {
      sans: "font-sans",
      mono: "font-mono",
    },
    numeric: {
      true: "tabular-nums",
    },
  },
  defaultVariants: {
    variant: "body",
  },
})

type TextTag =
  | "p"
  | "span"
  | "div"
  | "strong"
  | "em"
  | "small"
  | "time"
  | "abbr"
  | "blockquote"
  | "figcaption"
  | "address"
  | "dt"
  | "dd"
  | "li"
  | "legend"
  | "s"

/** Inline tags parent ka size/leading inherit karte hain jab tak `variant` khud na diya jaye */
const INLINE_TAGS = new Set<TextTag>(["span", "strong", "em", "small", "time", "abbr", "s"])

type TextProps = useRender.ComponentProps<"p"> &
  VariantProps<typeof textVariants> & {
    /** Rendered element (default `p`) */
    as?: TextTag
    /** For `as="time"` */
    dateTime?: string
  }

function Text({
  as = "p",
  variant,
  size,
  tone,
  weight,
  family,
  numeric,
  className,
  render,
  ...props
}: TextProps) {
  return useRender({
    defaultTagName: as,
    props: mergeProps<"p">(
      {
        className: cn(
          textVariants({
            variant: variant === undefined && INLINE_TAGS.has(as) ? null : variant,
            size,
            tone,
            weight,
            family,
            numeric,
          }),
          className
        ),
      },
      props
    ),
    render,
    state: { slot: "text" },
  })
}

export { Heading, Text, headingVariants, textVariants }

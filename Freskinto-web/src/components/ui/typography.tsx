import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ---------------------------------------------------------------------------
   Heading — Inter throughout; weight and tight tracking carry the hierarchy
--------------------------------------------------------------------------- */

const headingVariants = cva("text-balance", {
  variants: {
    size: {
      hero: "text-4xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-6xl",
      display: "text-3xl leading-tight font-semibold tracking-tight sm:text-4xl",
      "1": "text-2xl leading-tight font-semibold tracking-tight sm:text-3xl",
      "2": "text-xl leading-snug font-semibold tracking-tight sm:text-2xl",
      "3": "text-lg leading-snug font-semibold tracking-tight",
      "4": "text-base leading-snug font-semibold",
      "5": "text-sm leading-snug font-semibold",
    },
    tone: {
      default: "text-foreground",
      inherit: "",
      muted: "text-muted-foreground",
      primary: "text-primary",
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
      eyebrow: "text-xs leading-none font-medium",
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
      primary: "text-primary",
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

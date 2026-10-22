import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ---------------------------------------------------------------------------
   Heading — Fraunces display serif (sans for compact UI titles)
--------------------------------------------------------------------------- */

const headingVariants = cva("text-balance text-foreground", {
  variants: {
    size: {
      display:
        "text-4xl leading-none font-semibold tracking-tight sm:text-5xl lg:text-6xl",
      "1": "text-3xl leading-tight font-semibold tracking-tight sm:text-4xl",
      "2": "text-2xl leading-tight font-semibold tracking-tight sm:text-3xl",
      "3": "text-xl leading-snug font-semibold tracking-tight",
      "4": "text-lg leading-snug font-semibold",
      "5": "text-base leading-snug font-semibold",
    },
    family: {
      serif: "font-heading",
      sans: "font-sans tracking-normal",
    },
  },
  defaultVariants: {
    size: "2",
    family: "serif",
  },
})

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"
type HeadingSize = NonNullable<VariantProps<typeof headingVariants>["size"]>

const HEADING_TAGS: Record<HeadingSize, HeadingTag> = {
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

function Heading({
  as,
  size,
  family,
  className,
  render,
  ...props
}: HeadingProps) {
  return useRender({
    defaultTagName: as ?? HEADING_TAGS[size ?? "2"],
    props: mergeProps<"h2">(
      { className: cn(headingVariants({ size, family }), className) },
      props
    ),
    render,
    state: { slot: "heading" },
  })
}

/* ---------------------------------------------------------------------------
   Text — body copy, captions, eyebrows and receipt-style mono details
--------------------------------------------------------------------------- */

const textVariants = cva("", {
  variants: {
    variant: {
      body: "text-sm leading-relaxed",
      lead: "text-base leading-relaxed text-muted-foreground sm:text-lg",
      small: "text-xs leading-normal",
      label: "text-sm leading-none font-medium",
      eyebrow:
        "font-mono text-xs leading-none font-medium tracking-widest text-brand uppercase",
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
      muted: "text-muted-foreground",
      brand: "text-brand",
      destructive: "text-destructive",
      success: "text-success",
      warning: "text-warning",
      inverse: "text-background",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    family: {
      sans: "font-sans",
      serif: "font-heading",
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
          textVariants({ variant, size, tone, weight, family, numeric }),
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

import { cva, type VariantProps } from "class-variance-authority";

/**
 * Freskinto buttons — modern indigo theme. `cta` is the bold indigo pill,
 * `signin` uses the gradient, `destructive` solid red confirm. Server components
 * bhi (Link ko button jaisa dikhane ke liye) yahin se import karte hain — "use client" nahi.
 */
export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent text-sm font-semibold whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/35 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-brand-green-dark",
        cta: "rounded-full bg-brand-green-forest text-white shadow-soft hover:bg-brand-green hover:shadow-glow",
        signin: "rounded-full bg-brand-gradient text-white shadow-soft hover:shadow-glow hover:brightness-110",
        destructive: "bg-destructive text-white shadow-xs hover:bg-tomato-ink focus-visible:ring-destructive/30",
        "destructive-outline":
          "border-destructive/30 bg-card text-destructive hover:bg-tomato-soft focus-visible:ring-destructive/25",
        outline:
          "border-input bg-card text-foreground shadow-xs hover:border-foreground/25 hover:bg-muted aria-expanded:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-muted aria-expanded:bg-muted",
        soft: "bg-brand-soft text-brand-green-dark hover:bg-brand-mint",
        ghost: "text-foreground hover:bg-muted aria-expanded:bg-muted",
        link: "rounded-md text-brand-green underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 px-3 text-fs-13",
        default: "h-10 px-4",
        lg: "h-11 px-5 text-fs-15",
        xl: "h-12 px-6 text-base",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8",
        "icon-lg": "size-11 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    compoundVariants: [{ variant: "link", class: "h-auto px-0" }],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

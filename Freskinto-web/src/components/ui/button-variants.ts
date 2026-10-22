import { cva, type VariantProps } from "class-variance-authority";

/**
 * Freskinto buttons — "Produce Pop". `cta` is the tangerine pill that lifts onto an ink offset
 * shadow, `lime` the fresh highlight, `night` the deep aubergine block, `glass` for buttons on
 * night surfaces. Server components bhi (Link ko button jaisa dikhane ke liye) yahin se import
 * karte hain — "use client" nahi.
 */
export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-transparent text-sm font-semibold whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/40 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        cta: "rounded-full border-2 border-pop bg-tangerine font-bold text-tangerine-foreground shadow-pop-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop active:translate-x-0 active:translate-y-0 active:shadow-none",
        lime: "rounded-full bg-lime font-bold text-lime-foreground hover:brightness-95",
        night: "rounded-full bg-night text-night-foreground hover:bg-night/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90",
        glass:
          "rounded-full border-night-border bg-night-foreground/10 text-night-foreground backdrop-blur hover:bg-night-foreground/20",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/30 dark:text-background",
        "destructive-outline":
          "border-destructive/30 bg-card text-destructive hover:bg-destructive-soft focus-visible:ring-destructive/25",
        outline:
          "border-input bg-card text-foreground shadow-xs hover:border-foreground/30 hover:bg-muted aria-expanded:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-muted aria-expanded:bg-muted",
        soft: "bg-plum-soft text-accent-foreground hover:bg-primary hover:text-primary-foreground",
        ghost: "text-foreground hover:bg-muted aria-expanded:bg-muted",
        link: "rounded-md text-primary underline-offset-4 hover:underline",
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

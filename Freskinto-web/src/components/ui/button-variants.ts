import { cva, type VariantProps } from "class-variance-authority";

/**
 * Freskinto buttons — clean & minimal. `default` is the one indigo action per view, `outline` the
 * thin grey-bordered companion, `secondary`/`ghost` for quiet controls. Server components bhi (Link
 * ko button jaisa dikhane ke liye) yahin se import karte hain — "use client" nahi.
 */
export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-colors duration-150 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/30 dark:text-background",
        "destructive-outline":
          "border-border bg-background text-destructive hover:bg-destructive-soft focus-visible:ring-destructive/25",
        outline: "border-border bg-background text-foreground hover:bg-muted aria-expanded:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70 aria-expanded:bg-secondary/70",
        ghost: "text-foreground hover:bg-muted aria-expanded:bg-muted",
        link: "rounded-md text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 px-3 text-fs-13",
        default: "h-9 px-4",
        lg: "h-10 px-5",
        xl: "h-11 px-6 text-fs-15",
        icon: "size-9",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8",
        "icon-lg": "size-10 [&_svg:not([class*='size-'])]:size-5",
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

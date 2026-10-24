import { cva, type VariantProps } from "class-variance-authority";

/**
 * Freskinto buttons — "Fresh in Motion". Pills that lift on hover and press in on click.
 * `fresh` is the signature gradient with a light sweep (main CTAs: add to basket, checkout,
 * search), `default` the deep ink pill, `outline` frosted glass. Server components bhi (Link ko
 * button jaisa dikhane ke liye) yahin se import karte hain — "use client" nahi.
 */
export const buttonVariants = cva(
  "group/button relative isolate inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full border border-transparent text-sm font-semibold whitespace-nowrap transition-[translate,scale,background-color,background-position,border-color,color,box-shadow] duration-300 ease-out-expo outline-none select-none focus-visible:ring-4 focus-visible:ring-ring/30 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_10px_24px_-12px_rgb(12_26_20/0.7)] hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-14px_rgb(12_26_20/0.65)] dark:shadow-[0_10px_30px_-14px_rgb(236_242_238/0.35)]",
        fresh:
          "bg-fresh text-[#06100b] shadow-glow before:absolute before:inset-0 before:-z-10 before:-translate-x-full before:bg-[linear-gradient(105deg,transparent_25%,rgb(255_255_255/0.6)_50%,transparent_75%)] before:transition-transform before:duration-700 before:ease-out-expo hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-8px_rgb(20_192_176/0.75)] hover:bg-[position:100%_50%] hover:before:translate-x-full",
        outline:
          "border-border bg-card/70 text-foreground backdrop-blur-md hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-card hover:shadow-soft aria-expanded:bg-card dark:bg-card/50 dark:hover:border-white/20",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70 aria-expanded:bg-secondary/70",
        ghost: "text-foreground hover:bg-foreground/[0.06] aria-expanded:bg-foreground/[0.06] dark:hover:bg-foreground/[0.09]",
        destructive:
          "bg-destructive text-white hover:-translate-y-0.5 hover:bg-destructive/90 focus-visible:ring-destructive/30 dark:text-background",
        "destructive-outline":
          "border-destructive/30 bg-card/70 text-destructive hover:bg-destructive-soft focus-visible:ring-destructive/25",
        link: "rounded-md text-brand-ink hover:text-brand-ink/80 dark:text-brand dark:hover:text-brand/80 underline-offset-4 hover:underline active:scale-100 transition-colors",
      },
      size: {
        xs: "h-7 px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 px-3.5 text-fs-13",
        default: "h-10 px-5",
        lg: "h-11 px-6 text-fs-15",
        xl: "h-13 px-7 text-base [&_svg:not([class*='size-'])]:size-5",
        icon: "size-10",
        "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8",
        "icon-lg": "size-12 [&_svg:not([class*='size-'])]:size-5",
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

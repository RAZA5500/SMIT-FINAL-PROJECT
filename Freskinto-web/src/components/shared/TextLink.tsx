import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const TONES = {
  brand: "text-brand hover:text-brand-strong",
  default: "text-foreground hover:text-brand",
  muted: "text-muted-foreground hover:text-foreground",
} as const;

type TextLinkProps = ComponentProps<typeof Link> & {
  tone?: keyof typeof TONES;
  /** Hamesha underline (paragraph ke andar links) */
  underline?: boolean;
};

/** Inline text link (Next `Link`) — paragraphs, footers, "Forgot password?" */
export function TextLink({ tone = "brand", underline = false, className, ...props }: TextLinkProps) {
  return (
    <Link
      className={cn(
        "rounded-sm font-medium underline-offset-4 transition-colors outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/40",
        underline && "underline",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}

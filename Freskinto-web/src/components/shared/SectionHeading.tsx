import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "./ButtonLink";

interface SectionHeadingProps {
  id?: string;
  title: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  /** "View all" link */
  href?: string;
  hrefLabel?: string;
  /** Extra controls */
  actions?: ReactNode;
  className?: string;
}

/** Section ka sar — kicker, serif title, "View all" */
export function SectionHeading({
  id,
  title,
  eyebrow,
  description,
  href,
  hrefLabel = "View all",
  actions,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="flex min-w-0 flex-col gap-2">
        {eyebrow && <div className="kicker">{eyebrow}</div>}
        <h2 id={id} className="font-heading text-fs-24 text-foreground sm:text-fs-32">
          {title}
        </h2>
        {description && <p className="text-muted-foreground sm:text-base">{description}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {href && (
          <ButtonLink href={href} variant="ghost" size="sm" className="text-brand-green hover:text-brand-green-dark">
            {hrefLabel}
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        )}
        {actions}
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Title ke upar chhota kicker (e.g. "My account") */
  eyebrow?: ReactNode;
  /** Title ke neeche badges ki line (status, payment) */
  meta?: ReactNode;
  actions?: ReactNode;
  /** Breadcrumbs ya back link — sab se upar */
  breadcrumbs?: ReactNode;
  /** `page`: storefront ka bada serif title · `compact`: admin workspace */
  size?: "page" | "compact";
  className?: string;
}

/** Har page ka sar: breadcrumbs → kicker → title → description, actions right */
export function PageHeader({
  title,
  description,
  eyebrow,
  meta,
  actions,
  breadcrumbs,
  size = "page",
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {breadcrumbs}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-2">
          {eyebrow && <div className="kicker">{eyebrow}</div>}
          <h1
            className={cn(
              "font-heading text-foreground",
              size === "page" ? "text-fs-32 sm:text-fs-40" : "text-fs-24 tracking-tight",
            )}
          >
            {title}
          </h1>
          {description && (
            <div className={cn("max-w-2xl text-muted-foreground", size === "page" ? "text-base" : "text-sm")}>
              {description}
            </div>
          )}
          {meta && <div className="flex flex-wrap items-center gap-2 pt-1">{meta}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
      </div>
    </div>
  );
}

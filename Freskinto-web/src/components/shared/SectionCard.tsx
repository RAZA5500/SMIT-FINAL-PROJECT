import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Header ke right par (badge, button) */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

/** Page ke andar ek titled panel — orders, profile, forms; header hairline se alag */
export function SectionCard({ title, description, icon, action, children, className, bodyClassName }: SectionCardProps) {
  return (
    <section className={cn("overflow-hidden rounded-15 border border-border bg-card shadow-soft", className)}>
      <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2 className="flex items-center gap-2 font-heading text-fs-18 font-semibold">
            {icon && (
              <span aria-hidden="true" className="text-brand-green [&_svg]:size-5">
                {icon}
              </span>
            )}
            {title}
          </h2>
          {description && <p className="text-fs-13 text-muted-foreground">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

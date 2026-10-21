import { FlaskConical } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminPageProps {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  /** Static mock screen — "Sample data" label (user decision: backend se connected nahi) */
  demo?: boolean;
  children: ReactNode;
  className?: string;
}

/** Har admin screen ka frame — heading, actions, content */
export function AdminPage({ title, description, actions, demo = false, children, className }: AdminPageProps) {
  return (
    <div className={cn("flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
            {demo && (
              <span className="inline-flex items-center gap-1 rounded-full bg-saffron-soft px-2.5 py-1 text-xs font-semibold text-warning">
                <FlaskConical className="size-3.5" aria-hidden="true" />
                Sample data
              </span>
            )}
          </div>
          {description && <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

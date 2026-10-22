import type { ReactNode } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

interface AdminPageProps {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  /** Header ke right par primary actions */
  actions?: ReactNode;
  /** Title ke neeche badges (status, payment) */
  meta?: ReactNode;
  /** Back link / breadcrumbs (detail pages) */
  breadcrumbs?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Admin screen ka frame: compact header + content, workspace padding */
export function AdminPage({ title, description, eyebrow, actions, meta, breadcrumbs, children, className }: AdminPageProps) {
  return (
    <div className={cn("flex flex-col gap-6 p-4 sm:p-6 lg:p-8", className)}>
      <PageHeader
        size="compact"
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={actions}
        meta={meta}
        breadcrumbs={breadcrumbs}
      />
      {children}
    </div>
  );
}

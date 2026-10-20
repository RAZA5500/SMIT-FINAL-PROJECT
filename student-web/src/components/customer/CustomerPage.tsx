import type { ReactNode } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

interface CustomerPageProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Customer pages ka frame — fixed SiteHeader ke neeche content + heading */
export function CustomerPage({ title, description, actions, children, className }: CustomerPageProps) {
  return (
    <main className={cn("customer-container flex flex-col gap-6 pt-28 pb-16", className)}>
      <PageHeader title={title} description={description} actions={actions} />
      {children}
    </main>
  );
}

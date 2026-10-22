import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { PageBreadcrumbs, type Crumb } from "@/components/shared/PageBreadcrumbs";
import { PageHeader } from "@/components/shared/PageHeader";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

interface CustomerPageProps {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  meta?: ReactNode;
  /** "Home" pehle khud lagta hai */
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Customer pages ka frame — breadcrumbs + heading + content */
export function CustomerPage({
  title,
  description,
  eyebrow,
  meta,
  breadcrumbs,
  actions,
  children,
  className,
}: CustomerPageProps) {
  return (
    <Container className={cn("flex flex-col gap-8 py-8 sm:py-10", className)}>
      <PageHeader
        title={title}
        description={description}
        eyebrow={eyebrow}
        meta={meta}
        actions={actions}
        breadcrumbs={
          breadcrumbs && <PageBreadcrumbs root={{ label: "Home", href: publicRoutes.home }} items={breadcrumbs} />
        }
      />
      {children}
    </Container>
  );
}

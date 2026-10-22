import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { PageBreadcrumbs, type Crumb } from "@/components/shared/PageBreadcrumbs";
import { PageHeader } from "@/components/shared/PageHeader";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

interface CustomerPageProps {
  title: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: Crumb[];
  children: ReactNode;
  className?: string;
}

/** Account pages ka common frame: page container, breadcrumbs → header → content */
export function CustomerPage({
  title,
  eyebrow,
  description,
  meta,
  actions,
  breadcrumbs,
  children,
  className,
}: CustomerPageProps) {
  return (
    <Container className={cn("flex flex-col gap-8 py-8 sm:py-10", className)}>
      <PageHeader
        breadcrumbs={
          breadcrumbs && <PageBreadcrumbs root={{ label: "Shop", href: publicRoutes.shop }} items={breadcrumbs} />
        }
        eyebrow={eyebrow}
        title={title}
        description={description}
        meta={meta}
        actions={actions}
      />
      {children}
    </Container>
  );
}

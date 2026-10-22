import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

interface CustomerPageProps {
  title: string;
  description?: ReactNode;
  eyebrow?: string;
  /** "Home" pehle khud lagta hai */
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PageBreadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ label: "Home", href: publicRoutes.home }, ...items];
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {all.map((crumb, index) => (
          <Fragment key={`${crumb.label}-${index}`}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {crumb.href && index < all.length - 1 ? (
                <BreadcrumbLink render={<Link href={crumb.href} />}>{crumb.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="max-w-56 truncate">{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/** Customer pages ka frame — breadcrumbs + heading + content */
export function CustomerPage({
  title,
  description,
  eyebrow,
  breadcrumbs,
  actions,
  children,
  className,
}: CustomerPageProps) {
  return (
    <div className={cn("container-page flex flex-col gap-6 py-6 sm:gap-8 sm:py-10", className)}>
      <div className="flex flex-col gap-4">
        {breadcrumbs && <PageBreadcrumbs items={breadcrumbs} />}
        <PageHeader title={title} description={description} eyebrow={eyebrow} actions={actions} />
      </div>
      {children}
    </div>
  );
}

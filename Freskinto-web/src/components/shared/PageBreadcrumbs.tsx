import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

interface PageBreadcrumbsProps {
  items: Crumb[];
  /** Pehle "Home"/"Admin" jaisa root crumb */
  root?: Crumb;
  className?: string;
}

/** shadcn Breadcrumb + Next Link; aakhri crumb current page */
export function PageBreadcrumbs({ items, root, className }: PageBreadcrumbsProps) {
  const all = root ? [root, ...items] : items;
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {all.map((crumb, index) => {
          const last = index === all.length - 1;
          return (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem className="min-w-0">
                {crumb.href && !last ? (
                  <BreadcrumbLink render={<Link href={crumb.href} />}>{crumb.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className={cn("max-w-56 truncate")}>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

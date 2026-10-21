"use client";

import { Bell, ExternalLink, Package, ShoppingBag, UserPlus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { adminMockRoutes, adminRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { activeNavItem, adminSubPage } from "./admin-nav";

/** Static preview (notifications backend scope mein nahi — user decision) */
const PREVIEW_NOTIFICATIONS = [
  { icon: ShoppingBag, title: "New order received", text: "A customer placed an order for 4 items.", time: "10 min ago" },
  { icon: Package, title: "Low stock alert", text: "A product dropped below its threshold.", time: "45 min ago" },
  { icon: UserPlus, title: "New customer", text: "Someone created an account.", time: "2 h ago" },
];

function NotificationsMenu() {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="Notifications"
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}
      >
        <Bell className="size-5" />
        <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-tomato ring-2 ring-background" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-80 gap-0 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Preview</span>
        </div>
        <ul className="flex flex-col p-1.5">
          {PREVIEW_NOTIFICATIONS.map(({ icon: Icon, title, text, time }) => (
            <li key={title} className="flex gap-3 rounded-lg p-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-medium">{title}</span>
                <span className="truncate text-xs text-muted-foreground">{text}</span>
                <span className="text-xs text-muted-foreground/70">{time}</span>
              </span>
            </li>
          ))}
        </ul>
        <Link
          href={adminMockRoutes.notifications}
          className="block border-t px-4 py-3 text-center text-sm font-semibold text-brand hover:bg-muted/50"
        >
          View all notifications
        </Link>
      </PopoverContent>
    </Popover>
  );
}

export function AdminTopbar() {
  const pathname = usePathname();
  const item = activeNavItem(pathname);
  const subPage = adminSubPage(pathname);

  const crumbs = [
    { label: "Admin", href: adminRoutes.dashboard },
    ...(item ? [{ label: item.label, href: item.href }] : []),
    ...(subPage ? [{ label: subPage }] : []),
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-md sm:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5 data-vertical:self-center" />
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="flex-nowrap">
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <Fragment key={`${crumb.label}-${index}`}>
                {index > 0 && <BreadcrumbSeparator className={cn(index === 1 && "hidden sm:list-item")} />}
                <BreadcrumbItem className={cn(index === 0 && "hidden sm:inline-flex", "min-w-0")}>
                  {last || !crumb.href ? (
                    <BreadcrumbPage className="truncate font-semibold">{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={crumb.href} />}>{crumb.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      {item?.demo && (
        <span className="hidden rounded-full bg-foreground px-2.5 py-1 text-xs font-semibold text-background md:inline">
          Demo screen · sample data
        </span>
      )}
      <Link href={publicRoutes.home} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden sm:inline-flex")}>
        <ExternalLink aria-hidden="true" />
        View store
      </Link>
      <NotificationsMenu />
    </header>
  );
}

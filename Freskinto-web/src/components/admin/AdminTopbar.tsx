"use client";

import { Bell, ExternalLink, Package, ShoppingBag, UserPlus } from "lucide-react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { PageBreadcrumbs } from "@/components/shared/PageBreadcrumbs";
import { adminMockRoutes, adminRoutes, publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { AdminCommandMenu } from "./AdminCommandMenu";
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
      <PopoverTrigger render={<Button variant="ghost" size="icon" aria-label="Notifications" className={cn("relative")} />}>
        <Bell aria-hidden="true" className={cn("size-5")} />
        <Box
          as="span"
          aria-hidden="true"
          className={cn("absolute top-2 right-2 size-2 rounded-full bg-tomato ring-2 ring-background")}
        />
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className={cn("w-80 gap-0 p-0")}>
        <PopoverHeader className={cn("flex-row items-center justify-between border-b px-4 py-3")}>
          <PopoverTitle>Notifications</PopoverTitle>
          <Badge variant="tag">Preview</Badge>
        </PopoverHeader>
        <ItemGroup className={cn("gap-0 p-1.5")}>
          {PREVIEW_NOTIFICATIONS.map(({ icon: Icon, title, text, time }) => (
            <Item key={title} size="sm" className={cn("items-start")}>
              <ItemMedia className={cn("size-9 rounded-lg border bg-background text-brand [&_svg]:size-4")}>
                <Icon aria-hidden="true" />
              </ItemMedia>
              <ItemContent className={cn("min-w-0 gap-0.5")}>
                <ItemTitle className={cn("font-semibold")}>{title}</ItemTitle>
                <ItemDescription className={cn("line-clamp-1")}>{text}</ItemDescription>
                <Text as="span" variant="code" tone="muted">
                  {time}
                </Text>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
        <Box className={cn("border-t p-1.5")}>
          <ButtonLink href={adminMockRoutes.notifications} variant="ghost" className={cn("w-full rounded-xl text-brand")}>
            View all notifications
          </ButtonLink>
        </Box>
      </PopoverContent>
    </Popover>
  );
}

export function AdminTopbar() {
  const pathname = usePathname();
  const item = activeNavItem(pathname);
  const subPage = adminSubPage(pathname);

  const crumbs = [
    ...(item ? [{ label: item.label, href: subPage ? item.href : undefined }] : []),
    ...(subPage ? [{ label: subPage }] : []),
  ];

  return (
    <Flex
      as="header"
      align="center"
      gap="3"
      className={cn("sticky top-0 z-30 h-16 shrink-0 rounded-t-xl border-b bg-background/90 px-4 backdrop-blur-md sm:px-6")}
    >
      <SidebarTrigger className={cn("-ml-1")} />
      <Separator orientation="vertical" className={cn("h-5 data-vertical:self-center")} />
      <PageBreadcrumbs
        root={{ label: "Admin", href: adminRoutes.dashboard }}
        items={crumbs}
        className={cn("min-w-0 flex-1 [&_li:first-child]:hidden sm:[&_li:first-child]:inline-flex")}
      />
      <AdminCommandMenu />
      <ButtonLink href={publicRoutes.home} variant="outline" size="sm" className={cn("hidden lg:inline-flex")}>
        <ExternalLink data-icon="inline-start" aria-hidden="true" />
        View store
      </ButtonLink>
      <NotificationsMenu />
    </Flex>
  );
}

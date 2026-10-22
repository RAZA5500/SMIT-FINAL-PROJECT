"use client";

import { BellOff, Check, CheckCheck, X } from "lucide-react";
import { Fragment, useState } from "react";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Flex } from "@/components/ui/flex";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { Text } from "@/components/ui/typography";
import { AdminPage } from "@/components/admin/AdminPage";
import { NOTIFICATION_KINDS } from "@/components/admin/notification-kinds";
import { ChipGroup, type ChipOption } from "@/components/shared/ChipGroup";
import { EmptyState } from "@/components/shared/EmptyState";
import { NOTIFICATIONS } from "@/data/admin";
import { cn } from "@/lib/utils";

type View = "ALL" | "UNREAD";

export function NotificationsView() {
  const [items, setItems] = useState(NOTIFICATIONS);
  const [view, setView] = useState<View>("ALL");

  const unreadCount = items.filter((item) => !item.read).length;
  const visible = view === "UNREAD" ? items.filter((item) => !item.read) : items;

  const viewOptions: ChipOption<View>[] = [
    { value: "ALL", label: "All", count: items.length },
    { value: "UNREAD", label: "Unread", count: unreadCount },
  ];

  const markRead = (id: string) => setItems((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)));
  const markAllRead = () => setItems((current) => current.map((item) => ({ ...item, read: true })));
  const dismiss = (id: string) => setItems((current) => current.filter((item) => item.id !== id));

  return (
    <AdminPage
      demo
      eyebrow="Account"
      title="Notifications"
      description="Order, stock and account alerts. These are sample alerts — real notifications aren't connected yet, and changes reset when you leave."
      actions={
        <Button variant="outline" disabled={unreadCount === 0} onClick={markAllRead}>
          <CheckCheck data-icon="inline-start" aria-hidden="true" />
          Mark all as read
        </Button>
      }
    >
      <ChipGroup aria-label="Show notifications" options={viewOptions} value={view} onValueChange={setView} />

      <Card className={cn("max-w-3xl gap-0 py-0")}>
        {visible.length === 0 ? (
          <EmptyState
            icon={<BellOff aria-hidden="true" />}
            title={view === "UNREAD" ? "You're all caught up" : "No notifications"}
            message={view === "UNREAD" ? "New order and stock alerts will show up here." : "Alerts you dismiss don't come back."}
          />
        ) : (
          <ItemGroup className={cn("gap-0 p-2")}>
            {visible.map((item, index) => {
              const { icon: Icon, label, tone } = NOTIFICATION_KINDS[item.kind];
              return (
                <Fragment key={item.id}>
                  {index > 0 && <ItemSeparator className={cn("my-1")} />}
                  <Item className={cn("items-start rounded-xl", !item.read && "bg-muted")}>
                    <ItemMedia className={cn("size-10 rounded-xl border bg-background [&_svg]:size-4.5", tone)}>
                      <Icon aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent className={cn("min-w-0 gap-1")}>
                      <ItemTitle className={cn(item.read ? "font-medium" : "font-semibold")}>
                        <Text as="span" className={cn("sr-only")}>
                          {label}:{" "}
                        </Text>
                        {item.title}
                        {!item.read && (
                          <Box
                            as="span"
                            role="img"
                            aria-label="Unread"
                            className={cn("size-2 shrink-0 rounded-full bg-primary")}
                          />
                        )}
                      </ItemTitle>
                      <ItemDescription className={cn("line-clamp-none")}>{item.message}</ItemDescription>
                      <Text as="span" variant="code" tone="muted">
                        {item.time}
                      </Text>
                    </ItemContent>
                    <ItemActions>
                      <Flex gap="1">
                        {!item.read && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Mark “${item.title}” as read`}
                            onClick={() => markRead(item.id)}
                          >
                            <Check aria-hidden="true" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Dismiss “${item.title}”`}
                          className={cn("text-muted-foreground")}
                          onClick={() => dismiss(item.id)}
                        >
                          <X aria-hidden="true" />
                        </Button>
                      </Flex>
                    </ItemActions>
                  </Item>
                </Fragment>
              );
            })}
          </ItemGroup>
        )}
      </Card>
    </AdminPage>
  );
}

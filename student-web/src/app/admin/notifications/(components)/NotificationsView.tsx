"use client";

import { BellOff, CheckCheck, Info, ShoppingBag, TriangleAlert, UserPlus, X, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { EmptyState } from "@/components/shared/EmptyState";
import { FilterChips } from "@/components/shared/FilterChips";
import { Button } from "@/components/ui/button";
import { NOTIFICATIONS, type NotificationKind } from "@/data/admin";
import { cn } from "@/lib/utils";

type View = "ALL" | "UNREAD";

const KIND_STYLES: Record<NotificationKind, { icon: LucideIcon; tile: string; label: string }> = {
  order: { icon: ShoppingBag, tile: "bg-brand-soft text-brand", label: "Order" },
  inventory: { icon: TriangleAlert, tile: "bg-saffron-soft text-warning", label: "Stock" },
  customer: { icon: UserPlus, tile: "bg-sky-50 text-info", label: "Customer" },
  system: { icon: Info, tile: "bg-muted text-muted-foreground", label: "System" },
};

export function NotificationsView() {
  // Sirf is screen par — reload par sample alerts wapas
  const [items, setItems] = useState(NOTIFICATIONS);
  const [view, setView] = useState<View>("ALL");

  const unreadCount = items.filter((item) => !item.read).length;
  const visible = view === "UNREAD" ? items.filter((item) => !item.read) : items;

  const markRead = (id: string) =>
    setItems((current) => current.map((item) => (item.id === id ? { ...item, read: true } : item)));
  const dismiss = (id: string) => setItems((current) => current.filter((item) => item.id !== id));

  return (
    <AdminPage
      demo
      title="Notifications"
      description="Order, stock and account alerts. These are sample alerts — real notifications aren't connected yet."
      actions={
        <Button
          variant="outline"
          disabled={unreadCount === 0}
          onClick={() => setItems((current) => current.map((item) => ({ ...item, read: true })))}
        >
          <CheckCheck aria-hidden="true" />
          Mark all as read
        </Button>
      }
    >
      <section className="flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border">
        <div className="border-b p-3 sm:px-4">
          <FilterChips<View>
            aria-label="Show notifications"
            options={[
              { value: "ALL", label: "All", count: items.length },
              { value: "UNREAD", label: "Unread", count: unreadCount },
            ]}
            value={view}
            onChange={setView}
          />
        </div>

        {visible.length === 0 ? (
          <EmptyState
            icon={<BellOff aria-hidden="true" />}
            title={view === "UNREAD" ? "You're all caught up" : "No notifications"}
            message={view === "UNREAD" ? "New alerts will show up here." : undefined}
          />
        ) : (
          <ul className="divide-y">
            {visible.map((item) => {
              const { icon: Icon, tile, label } = KIND_STYLES[item.kind];
              return (
                <li
                  key={item.id}
                  className={cn("group/item flex items-start gap-3.5 p-4 sm:px-5", !item.read && "bg-brand-soft/60")}
                >
                  <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", tile)}>
                    <Icon className="size-4.5" aria-hidden="true" />
                    <span className="sr-only">{label}</span>
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex flex-wrap items-center gap-x-2">
                      {!item.read && (
                        <span className="size-2 shrink-0 rounded-full bg-brand" aria-label="Unread" role="img" />
                      )}
                      <p className={cn("text-sm", item.read ? "font-medium" : "font-semibold")}>{item.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.message}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {!item.read && (
                      <Button
                        variant="ghost"
                        size="xs"
                        className="text-brand"
                        onClick={() => markRead(item.id)}
                      >
                        Mark read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Dismiss “${item.title}”`}
                      className="text-muted-foreground"
                      onClick={() => dismiss(item.id)}
                    >
                      <X aria-hidden="true" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </AdminPage>
  );
}

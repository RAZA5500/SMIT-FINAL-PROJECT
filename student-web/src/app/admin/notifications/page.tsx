"use client";

import AdminPageShell from "@/components/admin/AdminPageShell";

import React, { useState, useMemo } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  Search,
  ShoppingBag,
  UserPlus,
  AlertTriangle,
  Info,
  Clock,
} from "lucide-react";

type NotifType = "order" | "user" | "inventory" | "system";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotifType;
  timestamp: string;
  isRead: boolean;
  linkUrl?: string;
}

const INITIAL_NOTIFS: NotificationItem[] = [
  {
    id: "n1",
    title: "New Order Received (#ORD-9823)",
    message: "Sarah Jenkins placed an order for £16.49 containing 4 items.",
    type: "order",
    timestamp: "10 mins ago",
    isRead: false,
  },
  {
    id: "n2",
    title: "Low Stock Alert: Organic Strawberries",
    message: "Stock level dropped to 8 units. Reorder recommended.",
    type: "inventory",
    timestamp: "45 mins ago",
    isRead: false,
  },
  {
    id: "n3",
    title: "New Customer Registration",
    message: "Marcus Brown created a new customer account.",
    type: "user",
    timestamp: "2 hours ago",
    isRead: true,
  },
  {
    id: "n4",
    title: "System Backup Complete",
    message: "Automated daily database backup finished successfully.",
    type: "system",
    timestamp: "5 hours ago",
    isRead: true,
  },
  {
    id: "n5",
    title: "New Order Received (#ORD-9822)",
    message: "Robert Miller placed an order for £10.18.",
    type: "order",
    timestamp: "Yesterday at 11:05",
    isRead: true,
  },
];

const typeIcon: Record<NotifType, React.ReactNode> = {
  order: <ShoppingBag className="w-4 h-4 text-emerald-600" />,
  inventory: <AlertTriangle className="w-4 h-4 text-amber-600" />,
  user: <UserPlus className="w-4 h-4 text-blue-600" />,
  system: <Info className="w-4 h-4 text-purple-600" />,
};

const typeBg: Record<NotifType, string> = {
  order: "bg-emerald-50 border-emerald-200",
  inventory: "bg-amber-50 border-amber-200",
  user: "bg-blue-50 border-blue-200",
  system: "bg-purple-50 border-purple-200",
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<NotificationItem[]>(INITIAL_NOTIFS);
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return notifs.filter((n) => {
      const q = search.toLowerCase();
      const matchSearch =
        n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
      const matchType = filterType === "all" || n.type === filterType;
      return matchSearch && matchType;
    });
  }, [notifs, search, filterType]);

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    if (confirm("Clear all notifications?")) {
      setNotifs([]);
    }
  };

  const toggleRead = (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const deleteNotif = (id: string) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <AdminPageShell>
      {/* Page Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Notifications</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 px-4 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-[12px] transition-colors cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            Mark All Read
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 px-4 h-10 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-[12px] transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>

      {/* ── Search & Filter Bar ──────────────────── */}
      <div className="px-5 pt-4 pb-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-full max-w-[320px]">
            <Search className="w-[14px] h-[14px] absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 text-sm bg-transparent border border-gray-200 rounded-[15px] focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/30 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-5 h-12 bg-white border border-gray-300 hover:border-brand-green rounded-[15px] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm focus:outline-none shrink-0"
            >
              <option value="all">Type: All</option>
              <option value="order">Orders</option>
              <option value="inventory">Inventory</option>
              <option value="user">Users</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Notifications Feed ──────────────────── */}
      <div className="overflow-y-auto flex-1">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 flex flex-col items-center gap-2">
            <Bell className="w-10 h-10 text-gray-300" />
            <p className="font-medium text-[14px]">No notifications found</p>
            <p className="text-[13px] text-gray-400 mt-0.5">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 bg-white">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`px-5 py-4 flex items-start gap-4 transition-colors ${
                  n.isRead ? "bg-white hover:bg-gray-50/50" : "bg-green-50/20 hover:bg-green-50/40"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-[12px] flex items-center justify-center border shrink-0 ${
                    typeBg[n.type]
                  }`}
                >
                  {typeIcon[n.type]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-[14px] truncate ${
                        n.isRead ? "font-semibold text-gray-800" : "font-bold text-gray-900"
                      }`}
                    >
                      {n.title}
                    </h4>
                    <span className="text-[12px] text-gray-400 whitespace-nowrap flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {n.timestamp}
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleRead(n.id)}
                    title={n.isRead ? "Mark as unread" : "Mark as read"}
                    className="p-1.5 text-gray-400 hover:text-brand-green rounded-lg transition-colors"
                  >
                    <CheckCheck className={`w-4 h-4 ${n.isRead ? "text-emerald-500" : ""}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteNotif(n.id)}
                    title="Delete"
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between text-[13px] text-gray-500 border-t border-gray-100 shrink-0">
        <div>
          Showing <span className="font-bold text-gray-900">{filtered.length}</span> of{" "}
          <span className="font-bold text-gray-900">{notifs.length}</span> notifications
        </div>
      </div>
    </AdminPageShell>
  );
}

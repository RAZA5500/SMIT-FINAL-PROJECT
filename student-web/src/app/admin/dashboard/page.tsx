"use client";

import React, { useMemo } from "react";
import { useAuthStore } from "@/stores/auth-store";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarClock,
  CircleCheck,
  CircleMinus,
  CirclePlus,
  FileDown,
  Pencil,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  TriangleAlert,
  Users,
  Wallet,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Snapshot data                                                      */
/* ------------------------------------------------------------------ */
const SUMMARY = {
  orders: 19,
  ordersDelta: "+72.7%",
  revenue: "£1,326",
  revenueDelta: "+100%",
  customers: 7,
  refundRate: "0%",
  refundDelta: "+0%",
};

const REVENUE_POINTS = [
  { day: "Wed", revenue: 0 },
  { day: "Thu", revenue: 0 },
  { day: "Fri", revenue: 0 },
  { day: "Sat", revenue: 0 },
  { day: "Sun", revenue: 0 },
  { day: "Mon", revenue: 0 },
  { day: "Tue", revenue: 1326 },
];

const CATEGORY_SALES = [
  { name: "Frozen Foods", value: 64.9, color: "#16a34a" },
  { name: "Dairy & Eggs", value: 20.4, color: "#4ade80" },
  { name: "Meat & Poultry", value: 10.7, color: "#f97316" },
  { name: "Snacks", value: 4.1, color: "#eab308" },
];

const CATEGORY_TOTAL = "£1k";

const BATCH_LEGEND = [
  { label: "Critical", color: "#ef4444" },
  { label: "Warning", color: "#f97316" },
  { label: "Caution", color: "#eab308" },
  { label: "Safe", color: "#16a34a" },
];

const BATCH_DATA = [{ name: "Crisp Romaine Lettuce", days: 3, color: "#ef4444" }];

type ActivityTone = "create" | "delete" | "update" | "confirm";

const ACTIVITY_TONES: Record<ActivityTone, { wrap: string; icon: React.ReactNode }> = {
  create: {
    wrap: "bg-icon-bg-green text-green-600",
    icon: <CirclePlus className="w-4 h-4" aria-hidden="true" />,
  },
  confirm: {
    wrap: "bg-icon-bg-green text-green-600",
    icon: <CircleCheck className="w-4 h-4" aria-hidden="true" />,
  },
  delete: {
    wrap: "bg-red-100 text-red-500",
    icon: <CircleMinus className="w-4 h-4" aria-hidden="true" />,
  },
  update: {
    wrap: "bg-blue-100 text-blue-500",
    icon: <Pencil className="w-4 h-4" aria-hidden="true" />,
  },
};

const ACTIVITY_ITEMS: { tone: ActivityTone; title: string; tag: string; time: string }[] = [
  { tone: "delete", title: "Brand 'test' deleted by Admin User", tag: "Brand", time: "19:49" },
  { tone: "delete", title: "Category 'Mutahir' deleted by Admin User", tag: "Category", time: "19:48" },
  { tone: "update", title: "Category image updated by Admin User", tag: "Category", time: "19:48" },
  { tone: "create", title: "Category 'Mutahir' created by Admin User", tag: "Category", time: "19:47" },
  { tone: "delete", title: "Category 'Mutahir' deleted by Admin User", tag: "Category", time: "19:47" },
  { tone: "update", title: "Category image updated by Admin User", tag: "Category", time: "19:46" },
  { tone: "create", title: "Category 'Mutahir' created by Admin User", tag: "Category", time: "19:46" },
  { tone: "confirm", title: "Order ORD-2026-000076 confirmed via Stripe payment", tag: "Payment", time: "19:05" },
  {
    tone: "create",
    title: "Payment initiated for order ORD-2026-000076 by munimdalmiatest1",
    tag: "Payment",
    time: "19:05",
  },
  {
    tone: "create",
    title: "Order ORD-2026-000076 created by munimdalmiatest1 (2 items)",
    tag: "Order",
    time: "19:05",
  },
];

/* ------------------------------------------------------------------ */
/*  Charts                                                             */
/* ------------------------------------------------------------------ */
const AXIS_TICK = { fill: "#9ca3af", fontSize: 11 };

function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={REVENUE_POINTS} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#228b22" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#228b22" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" tick={AXIS_TICK} tickLine={false} axisLine={false} />
        <YAxis
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          domain={[0, 2000]}
          ticks={[0, 500, 1000, 1500, 2000]}
          tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
          width={40}
        />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#228b22"
          strokeWidth={2.5}
          fill="url(#actualGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function CategoryChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={CATEGORY_SALES} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80}>
          {CATEGORY_SALES.map((slice) => (
            <Cell key={slice.name} fill={slice.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip />
        <text x="50%" y="50%" textAnchor="middle" fontSize={24} fontWeight={600} fill="#0B140D">
          {CATEGORY_TOTAL}
        </text>
        <text x="50%" y="50%" dy={24} textAnchor="middle" fontSize={11} fontWeight={400} fill="#5C675D">
          total
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}

function BatchExpiryChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={BATCH_DATA} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={AXIS_TICK} tickLine={false} axisLine={false} />
        <YAxis
          tick={AXIS_TICK}
          tickLine={false}
          axisLine={false}
          domain={[0, 3]}
          ticks={[0, 0.75, 1.5, 2.25, 3]}
          width={40}
        />
        <Tooltip cursor={false} />
        <Bar dataKey="days" name="Days remaining" barSize={80} radius={[4, 4, 0, 0]}>
          {BATCH_DATA.map((batch) => (
            <Cell key={batch.name} fill={batch.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat card                                                          */
/* ------------------------------------------------------------------ */
const STAT_CARD_CLASS =
  "group/card rounded-lg text-xs/relaxed text-card-foreground ring-foreground/10 relative flex flex-col gap-2.5 xl:gap-3 shadow-none p-3.5 xl:p-4 rounded-22! overflow-hidden bg-white border border-border-card ring-0";

function StatCard({
  icon,
  iconClass,
  label,
  value,
  delta,
}: {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <div data-slot="card" data-size="default" className={STAT_CARD_CLASS}>
      <div className="z-10 relative flex items-center gap-3">
        <div className={`flex justify-center items-center rounded-15 shrink-0 w-10 h-10 ${iconClass}`}>{icon}</div>
        <div className="flex items-center xl:min-h-[2.5em]">
          <p className="font-bold text-xs sm:text-sm leading-tight line-clamp-2 text-muted-foreground">{label}</p>
        </div>
      </div>
      <div className="z-10 relative flex flex-col gap-1.5 xl:mt-auto">
        <h3 className="font-bold text-[24px] leading-none tracking-tight text-foreground">{value}</h3>
        {delta && (
          <p className="font-normal text-fs-11 text-muted-green">
            <span>{delta}</span> <span>vs previous period</span>
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Dashboard Page                                                */
/* ------------------------------------------------------------------ */
export default function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  }, []);

  return (
    <main className="flex flex-col flex-1 bg-navbar-bg sm:p-4 overflow-y-auto px-4 py-4 sm:px-4 sm:py-5">
      <div className="flex flex-col gap-4">
        {/* ── Hero Banner ─────────────────────────────────── */}
        <section className="p-5 rounded-3xl w-full" style={{ background: "var(--gradient-hero)" }}>
          <div className="flex lg:flex-row flex-col lg:justify-between lg:items-center gap-5 lg:gap-6">
            <div className="flex flex-col gap-2 min-w-0">
              <div className="flex items-center gap-1.5 bg-sea-green-bg px-2.5 py-1 rounded-full w-fit">
                <span className="bg-sea-green rounded-full w-1.5 h-1.5 shrink-0"></span>
                <span className="font-medium text-fs-10 text-sea-green sm:text-fs-11">Live · {today}</span>
              </div>
              <h1 className="font-semibold text-section-md text-white leading-tight">
                {greeting}, {user?.name?.split(" ")[0] ?? "Admin"}.
              </h1>
              <p className="max-w-md text-white/80 text-xs sm:text-sm leading-relaxed">
                You have <strong className="font-bold text-white">{SUMMARY.orders} orders</strong> in the last 7 days,{" "}
                <strong className="font-bold text-white">{SUMMARY.customers} active customers</strong>, and revenue is{" "}
                <strong className="font-bold text-white">{SUMMARY.revenue}</strong>.
              </p>
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  className="flex items-center gap-2 bg-brand-green-vivid hover:opacity-90 disabled:opacity-60 shadow-btn px-4 py-2 rounded-15 text-white text-xs sm:text-sm transition-opacity cursor-pointer disabled:cursor-not-allowed"
                >
                  <FileDown className="w-4 h-4" aria-hidden="true" />
                  Export report
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 hover:opacity-90 disabled:opacity-60 px-4 py-2 border border-white/20 rounded-15 text-white text-xs sm:text-sm transition-opacity cursor-pointer disabled:cursor-not-allowed"
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  Sync inventory
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:flex sm:items-stretch gap-3 shrink-0">
              <div className="flex flex-col gap-1 px-4 py-3 rounded-22 min-w-25 text-white bg-(--color-stat-card-glass) backdrop-blur">
                <ShoppingCart className="w-4 h-4 text-white/70" aria-hidden="true" />
                <span className="pt-1 font-semibold text-lg leading-tight">{SUMMARY.orders}</span>
                <span className="text-fs-11 text-white/60 sm:text-xs">Orders</span>
              </div>
              <div className="flex flex-col gap-1 px-4 py-3 rounded-22 min-w-25 text-white bg-(--color-stat-card-glass) backdrop-blur">
                <TrendingUp className="w-4 h-4 text-white/70" aria-hidden="true" />
                <span className="pt-1 font-semibold text-lg leading-tight">{SUMMARY.revenue}</span>
                <span className="text-fs-11 text-white/60 sm:text-xs">Revenue</span>
              </div>
              <div className="flex flex-col gap-1 px-4 py-3 rounded-22 min-w-25 text-white bg-(--color-stat-card-glass) backdrop-blur">
                <Users className="w-4 h-4 text-white/70" aria-hidden="true" />
                <span className="pt-1 font-semibold text-lg leading-tight">{SUMMARY.customers}</span>
                <span className="text-fs-11 text-white/60 sm:text-xs">Customers</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4 Stat Cards Row ───────────────────────────── */}
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 transition-opacity">
          <StatCard
            icon={<Wallet className="w-5 h-5" aria-hidden="true" />}
            iconClass="bg-icon-bg-green text-green-600"
            label="Revenue"
            value={SUMMARY.revenue}
            delta={SUMMARY.revenueDelta}
          />
          <StatCard
            icon={<ShoppingCart className="w-5 h-5" aria-hidden="true" />}
            iconClass="bg-icon-bg-green text-green-600"
            label="Orders"
            value={String(SUMMARY.orders)}
            delta={SUMMARY.ordersDelta}
          />
          <StatCard
            icon={<Users className="w-5 h-5" aria-hidden="true" />}
            iconClass="bg-icon-bg-green text-green-600"
            label="Active Customers"
            value={String(SUMMARY.customers)}
          />
          <StatCard
            icon={<TriangleAlert className="w-5 h-5" aria-hidden="true" />}
            iconClass="bg-icon-bg-orange text-orange-400"
            label="Refund Rate"
            value={SUMMARY.refundRate}
            delta={SUMMARY.refundDelta}
          />
        </div>

        {/* ── Revenue & Orders + Sales by Category Row ───── */}
        <div className="gap-4 grid grid-cols-1 lg:grid-cols-10 transition-opacity">
          <div className="lg:col-span-7 bg-white shadow-sm p-5 border border-gray-100 rounded-3xl">
            <div className="flex flex-col gap-1">
              <div className="mx-5">
                <h3 className="font-semibold text-gray-800 text-base">Revenue &amp; orders</h3>
                <p className="text-muted-green text-fs-11 sm:text-xs">Selected period</p>
              </div>
            </div>
            <div className="mt-2 w-full h-56 min-h-56">
              <RevenueChart />
            </div>
          </div>

          <div className="lg:col-span-3 bg-white shadow-sm p-6 border border-gray-100 rounded-3xl">
            <div className="flex flex-col gap-1">
              <div>
                <h3 className="font-semibold text-gray-800 text-base">Sales by Category</h3>
                <p className="text-fs-11 text-muted-green sm:text-xs">Selected period</p>
              </div>
            </div>
            <div className="w-full h-44 min-h-44">
              <CategoryChart />
            </div>
            <div className="flex flex-col gap-2 px-1">
              {CATEGORY_SALES.map((slice) => (
                <div key={slice.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full w-2.5 h-2.5 shrink-0"
                      style={{ backgroundColor: slice.color }}
                    ></span>
                    <span className="text-gray-600 text-xs sm:text-sm">{slice.name}</span>
                  </div>
                  <span className="font-semibold text-gray-700 text-xs sm:text-sm">{slice.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Batch Expiry Tracker + Activity Row ────────── */}
        <div className="gap-4 grid grid-cols-1 lg:grid-cols-10 transition-opacity">
          <div className="lg:col-span-7 bg-white shadow-sm p-6 border border-gray-100 rounded-3xl">
            <div className="flex flex-col gap-4 h-full">
              <div className="sm:flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="flex justify-center items-center bg-icon-bg-green rounded-15 w-10 h-10 shrink-0">
                    <CalendarClock className="w-5 h-5 text-green-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-base leading-tight">Batch Expiry Tracker</h3>
                    <p className="text-fs-11 text-muted-green sm:text-xs">
                      Days remaining until each batch expires
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap justify-end items-center gap-3">
                  {BATCH_LEGEND.map((entry) => (
                    <div key={entry.label} className="flex items-center gap-1.5">
                      <span
                        className="rounded-full w-2.5 h-2.5 shrink-0"
                        style={{ backgroundColor: entry.color }}
                      ></span>
                      <span className="text-fs-11 text-gray-500 sm:text-xs">{entry.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 w-full min-h-[286px]">
                <BatchExpiryChart />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white p-6 border border-gray-100 border-l-4 border-l-brand-green rounded-3xl shadow-[0px_8px_24px_-8px_#3C5F4314,0px_1px_0px_0px_#3C5F430A]">
            <div className="flex flex-col h-full min-h-0">
              <div className="flex justify-between items-center mb-5 shrink-0">
                <h2 className="font-semibold text-gray-800 text-base">Activity</h2>
                <span className="bg-activity-badge-bg px-2.5 py-1 rounded-full font-medium text-fs-11 text-muted-green sm:text-xs">
                  Today
                </span>
              </div>
              <div className="relative flex flex-col grow basis-0 min-h-0 overflow-y-auto scrollbar-hide">
                <div className="top-5 bottom-5 left-5 absolute bg-gray-200 w-px"></div>
                {ACTIVITY_ITEMS.map((item, i) => {
                  const tone = ACTIVITY_TONES[item.tone];
                  const last = i === ACTIVITY_ITEMS.length - 1;
                  return (
                    <div
                      key={`${item.title}-${item.time}-${i}`}
                      className={last ? "relative flex items-start gap-3" : "relative flex items-start gap-3 pb-5"}
                    >
                      <div
                        className={`z-10 relative flex justify-center items-center rounded-full w-8 h-8 shrink-0 ${tone.wrap}`}
                      >
                        {tone.icon}
                      </div>
                      <div className="flex flex-1 justify-between items-start gap-2 pt-1">
                        <div className="flex flex-col gap-0.5">
                          <p className="font-semibold text-gray-800 text-xs sm:text-sm leading-snug">{item.title}</p>
                          <p className="text-fs-11 text-muted-green sm:text-xs">{item.tag}</p>
                        </div>
                        <span className="text-fs-11 text-gray-400 sm:text-xs shrink-0">{item.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

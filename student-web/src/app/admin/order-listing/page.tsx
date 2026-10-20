"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown, EllipsisVertical, Maximize2, RefreshCw, Search, SlidersHorizontal } from "lucide-react";
import { ADMIN_SEARCH_INPUT_CLASS } from "@/components/admin/AdminListPage";
import { ORDERS, ORDER_BOARD_TABS, ORDER_DETAILS } from "@/data/admin";
import { formatMoney } from "@/lib/format";

const CHROME_BUTTON =
  "inline-flex items-center justify-center gap-2 h-11 px-4 rounded-15 border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors shrink-0 cursor-pointer";

const BADGE_BASE =
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border-transparent py-0.5 whitespace-nowrap transition-all font-normal text-xs h-7 px-3 border";

export default function AdminOrderListingPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");

  const cards = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ORDERS.filter((o) => {
      if (tab !== "All" && o.orderStatus !== tab) return false;
      return !term || o.reference.toLowerCase().includes(term);
    });
  }, [search, tab]);

  return (
    <main className="flex flex-col flex-1 bg-navbar-bg sm:p-4 sm:px-4 sm:py-5 overflow-y-auto lg:overflow-hidden">
      <div className="flex flex-col flex-1 bg-white shadow-card sm:rounded-xl min-h-0">
        <div className="px-5 pt-4 pb-2 shrink-0 flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-full max-w-search min-w-0">
              <Search className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
              <input
                data-slot="input"
                className={ADMIN_SEARCH_INPUT_CLASS}
                placeholder="Search by order number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="ml-auto flex items-center gap-3">
              <SlidersHorizontal className="w-5 h-5 text-gray-400 shrink-0" />
              <button type="button" className={CHROME_BUTTON}>
                Sort By
                <ChevronDown className="w-4 h-4 shrink-0" />
              </button>
              <button type="button" className={CHROME_BUTTON}>
                <RefreshCw className="w-4 h-4 shrink-0" />
                Refresh
              </button>
              <button type="button" className={CHROME_BUTTON}>
                <Maximize2 className="w-4 h-4 shrink-0" />
                Full Screen
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {ORDER_BOARD_TABS.map((t) => {
              const active = tab === t.label;
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setTab(t.label)}
                  className={`inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    active ? "bg-brand-green text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t.label}
                  {t.count !== null && (
                    <span className={active ? "text-white/80" : "text-gray-400"}>{t.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {cards.map((o) => {
              const detail = ORDER_DETAILS[o.reference];
              return (
                <div
                  key={o.reference}
                  className="bg-order-card-bg rounded-2xl p-3 gap-2.5 sm:p-4 sm:gap-3 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-sm font-semibold text-gray-900 whitespace-nowrap">
                        #{o.reference}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{detail?.ago}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`${BADGE_BASE} bg-red-50 text-red-700`}>{o.orderStatus}</span>
                      <button
                        type="button"
                        className="flex items-center justify-center w-6 h-6 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <EllipsisVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold text-gray-800 truncate">{o.customer}</p>
                    <p className="text-xs text-gray-500 truncate">{detail?.email}</p>
                  </div>

                  <div className="flex flex-col gap-1 rounded-lg bg-white/60 px-2.5 py-2 border border-gray-100">
                    {detail?.lines.map((l) => (
                      <div
                        key={l.product}
                        className="flex items-center justify-between gap-2 text-xs text-gray-600"
                      >
                        <span className="truncate">{l.product}</span>
                        <span className="shrink-0 tabular-nums text-gray-500">× {l.qty}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-400">items</span>
                    <span className="text-sm font-semibold text-gray-900">{formatMoney(o.total)}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`${BADGE_BASE} bg-amber-50 text-amber-700`}>{o.paymentStatus}</span>
                    <span className={`${BADGE_BASE} bg-gray-100 text-gray-600`}>{o.deliveryType}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

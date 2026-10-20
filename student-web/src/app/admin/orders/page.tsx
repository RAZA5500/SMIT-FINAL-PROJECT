"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown, Download } from "lucide-react";
import AdminListPage, {
  AdminSearch,
  RowActions,
  TH_CENTER_CLASS,
  TH_CLASS,
  TR_CLASS,
} from "@/components/admin/AdminListPage";
import { ORDERS } from "@/data/admin";
import { formatPrice } from "@/data/products";

const PAGE_SIZE = 10;

const SECONDARY_BUTTON =
  "inline-flex items-center justify-between gap-2 h-11 px-4 rounded-15 border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors shrink-0 cursor-pointer";

const PAYMENT_TONE: Record<string, string> = {
  Paid: "bg-green-50 text-green-700",
  Unpaid: "bg-amber-50 text-amber-700",
  Refunded: "bg-gray-100 text-gray-600",
};

const ORDER_TONE: Record<string, string> = {
  Cancelled: "bg-red-50 text-red-700",
  Delivered: "bg-green-50 text-green-700",
  Pending: "bg-amber-50 text-amber-700",
  Processing: "bg-blue-50 text-blue-700",
};

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ORDERS.filter(
      (o) => !term || o.reference.toLowerCase().includes(term) || o.customer.toLowerCase().includes(term)
    );
  }, [search]);

  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toolbar = (
    <>
      <div className="flex items-center gap-3">
        <AdminSearch
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search by order # & customer..."
        />
        <button type="button" className={SECONDARY_BUTTON}>
          <Download className="w-4 h-4 shrink-0" />
          Export CSV
        </button>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <button type="button" className={SECONDARY_BUTTON}>
          All Status
          <ChevronDown className="w-4 h-4 shrink-0" />
        </button>
        <button type="button" className={SECONDARY_BUTTON}>
          Payment Status
          <ChevronDown className="w-4 h-4 shrink-0" />
        </button>
        <button type="button" className={SECONDARY_BUTTON}>
          Sort By
          <ChevronDown className="w-4 h-4 shrink-0" />
        </button>
        <button type="button" className={SECONDARY_BUTTON}>
          Last 7 Days
        </button>
      </div>
    </>
  );

  return (
    <AdminListPage
      toolbar={toolbar}
      toolbarClassName="hidden lg:flex flex-col gap-3"
      total={rows.length}
      page={page}
      pageSize={PAGE_SIZE}
      onPageChange={setPage}
      noun="orders"
    >
      <table className="w-full text-sm table-fixed min-w-215">
        <colgroup>
          {["13%", "13%", "10%", "9%", "13%", "15%", "14%", "8%"].map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-gray-200 border-b">
            <th className={`${TH_CLASS} rounded-tl-5`}>Order #</th>
            <th className={TH_CENTER_CLASS}>Customer</th>
            <th className={TH_CENTER_CLASS}>Delivery Type</th>
            <th className={TH_CENTER_CLASS}>Total</th>
            <th className={TH_CENTER_CLASS}>Payment Status</th>
            <th className={TH_CENTER_CLASS}>Order Status</th>
            <th className={TH_CENTER_CLASS}>Date &amp; Time</th>
            <th className={TH_CENTER_CLASS}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((o) => (
            <tr key={o.reference} className={TR_CLASS}>
              <td className="px-3 py-2 text-left">
                <p className="text-sm font-semibold text-body-text whitespace-nowrap">{o.reference}</p>
              </td>
              <td className="px-3 py-2 text-center text-gray-500 truncate">{o.customer}</td>
              <td className="px-3 py-2 text-center text-gray-500">{o.deliveryType}</td>
              <td className="px-3 py-2 text-center font-semibold text-body-text whitespace-nowrap">
                £{formatPrice(o.total)}
              </td>
              <td className="px-3 py-2 text-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PAYMENT_TONE[o.paymentStatus]}`}
                >
                  {o.paymentStatus}
                </span>
              </td>
              <td className="px-3 py-2 text-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ORDER_TONE[o.orderStatus]}`}
                >
                  {o.orderStatus}
                </span>
              </td>
              <td className="px-3 py-2 text-center text-gray-500 whitespace-nowrap">{o.placedAt}</td>
              <td className="px-3 py-2 text-center">
                <RowActions />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminListPage>
  );
}

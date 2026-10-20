"use client";

import React, { useMemo, useState } from "react";
import { Download } from "lucide-react";
import AdminListPage, {
  AdminSearch,
  ADMIN_TOGGLE_BUTTON_CLASS,
  FilterIcon,
  FilterSelect,
  TH_CENTER_CLASS,
  TH_CLASS,
  TR_CLASS,
} from "@/components/admin/AdminListPage";
import { TRANSACTIONS, TransactionType } from "@/data/admin";

const PAGE_SIZE = 10;

const TYPE_TONE: Record<TransactionType, string> = {
  RELEASED: "bg-blue-50 text-blue-700",
  CONSUMED: "bg-amber-50 text-amber-700",
  RESERVED: "bg-purple-50 text-purple-700",
  RECEIVED: "bg-green-50 text-green-700",
};

export default function AdminInventoryTransactionsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return TRANSACTIONS.filter((t) => !term || t.product.toLowerCase().includes(term));
  }, [search]);

  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toolbar = (
    <>
      <AdminSearch
        variant="capped"
        value={search}
        onChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        placeholder="Search by product name..."
      />
      <div className="flex items-center gap-3 ml-auto shrink-0">
        <FilterIcon />
        <FilterSelect label="Transaction Type" />
        <button type="button" className={ADMIN_TOGGLE_BUTTON_CLASS}>
          Date Range
        </button>
        <button type="button" className={ADMIN_TOGGLE_BUTTON_CLASS + " inline-flex items-center gap-2"}>
          <Download className="w-4 h-4 shrink-0" />
          Export CSV
        </button>
      </div>
    </>
  );

  return (
    <AdminListPage
      toolbar={toolbar}
      toolbarClassName="hidden lg:flex items-center gap-3"
      total={rows.length}
      page={page}
      pageSize={PAGE_SIZE}
      onPageChange={setPage}
      noun="transactions"
    >
      <table className="w-full text-sm table-fixed min-w-150">
        <colgroup>
          {/* Production leaves these auto so the five columns share the width evenly. */}
          {Array.from({ length: 5 }, (_, i) => (
            <col key={i} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-gray-200 border-b">
            <th className={`${TH_CLASS} rounded-tl-5`}>Product Name</th>
            <th className={TH_CENTER_CLASS}>Transaction Type</th>
            <th className={TH_CENTER_CLASS}>Quantity</th>
            <th className={TH_CENTER_CLASS}>Reason</th>
            <th className={TH_CENTER_CLASS}>Performed By</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((t, i) => (
            <tr key={`${t.product}-${i}`} className={TR_CLASS}>
              <td className="px-3 py-2 text-left">
                <p className="text-base font-semibold text-body-text truncate">{t.product}</p>
              </td>
              <td className="px-3 py-2 text-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_TONE[t.type]}`}
                >
                  {t.type}
                </span>
              </td>
              <td className="px-3 py-2 text-center font-semibold text-body-text">{t.quantity}</td>
              <td className="px-3 py-2 text-center text-gray-500">—</td>
              <td className="px-3 py-2 text-center text-gray-500">—</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminListPage>
  );
}

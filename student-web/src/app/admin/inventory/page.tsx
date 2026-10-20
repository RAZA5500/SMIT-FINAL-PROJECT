"use client";

import React, { useMemo, useState } from "react";
import AdminListPage, {
  AdminSearch,
  FilterIcon,
  PrimaryAction,
  RowActions,
  TH_CENTER_CLASS,
  TH_CLASS,
  TR_CLASS,
} from "@/components/admin/AdminListPage";
import { INVENTORY } from "@/data/admin";

const PAGE_SIZE = 10;

const STATUS_TONE: Record<string, string> = {
  "In Stock": "bg-green-50 text-green-700",
  "Out Of Stock": "bg-red-50 text-red-700",
  "Low Stock": "bg-amber-50 text-amber-700",
};

export default function AdminInventoryPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return INVENTORY.filter((r) => !term || r.product.toLowerCase().includes(term));
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
        placeholder="Search by Product Name..."
      />
      <div className="flex items-center gap-3 ml-auto shrink-0">
        <FilterIcon />
        <PrimaryAction label="Add Inventory" />
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
      noun="inventories"
    >
      <table className="w-full text-sm table-fixed min-w-175">
        <colgroup>
          {/* Production leaves these auto so the seven columns share the width evenly. */}
          {Array.from({ length: 7 }, (_, i) => (
            <col key={i} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-gray-200 border-b">
            <th className={`${TH_CLASS} rounded-tl-5`}>Product Name</th>
            <th className={TH_CENTER_CLASS}>Batch Tracked</th>
            <th className={TH_CENTER_CLASS}>Stock Status</th>
            <th className={TH_CENTER_CLASS}>Low Threshold</th>
            <th className={TH_CENTER_CLASS}>Qty On Hand</th>
            <th className={TH_CENTER_CLASS}>Batch Count</th>
            <th className={TH_CENTER_CLASS}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((r) => (
            <tr key={r.product} className={TR_CLASS}>
              <td className="px-3 py-2 text-left">
                <p className="text-base font-semibold text-body-text truncate">{r.product}</p>
              </td>
              <td className="px-3 py-2 text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {r.batchTracked ? "Yes" : "No"}
                </span>
              </td>
              <td className="px-3 py-2 text-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_TONE[r.status]}`}
                >
                  {r.status}
                </span>
              </td>
              <td className="px-3 py-2 text-center text-gray-500">{r.lowThreshold}</td>
              <td className="px-3 py-2 text-center font-semibold text-body-text">{r.qtyOnHand}</td>
              <td className="px-3 py-2 text-center text-gray-500">{r.batchCount ?? "—"}</td>
              <td className="px-3 py-2 text-center">
                <RowActions variant="chip" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminListPage>
  );
}

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
import { ALLERGENS, Presence } from "@/data/admin";

const PAGE_SIZE = 10;

const PRESENCE_TONE: Record<Presence, string> = {
  Contains: "bg-red-50 text-red-700",
  "May Contain": "bg-amber-50 text-amber-700",
  "Free From": "bg-green-50 text-green-700",
};

export default function AdminAllergensPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ALLERGENS.filter((a) => !term || a.product.toLowerCase().includes(term));
  }, [search]);

  /* Production counts distinct products, not individual allergen rows. */
  const productCount = new Set(rows.map((r) => r.product)).size;
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
        <PrimaryAction label="Add Allergen" />
      </div>
    </>
  );

  return (
    <AdminListPage
      toolbar={toolbar}
      toolbarClassName="hidden lg:flex items-center gap-3"
      total={productCount}
      page={page}
      pageSize={PAGE_SIZE}
      onPageChange={setPage}
      noun="allergens"
    >
      <table className="w-full text-sm table-fixed min-w-150">
        <colgroup>
          {["28%", "18%", "22%", "20%", "12%"].map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-gray-200 border-b">
            <th className={`${TH_CLASS} rounded-tl-5`}>Product</th>
            <th className={TH_CENTER_CLASS}>SKU</th>
            <th className={TH_CENTER_CLASS}>Allergen Type</th>
            <th className={TH_CENTER_CLASS}>Presence</th>
            <th className={TH_CENTER_CLASS}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((a, i) => (
            <tr key={`${a.sku}-${a.allergen}-${i}`} className={TR_CLASS}>
              <td className="px-3 py-2 text-left">
                <p className="text-base font-semibold text-body-text truncate">{a.product}</p>
              </td>
              <td className="px-3 py-2 text-center text-gray-500 whitespace-nowrap">{a.sku}</td>
              <td className="px-3 py-2 text-center text-gray-500">{a.allergen}</td>
              <td className="px-3 py-2 text-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PRESENCE_TONE[a.presence]}`}
                >
                  {a.presence}
                </span>
              </td>
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

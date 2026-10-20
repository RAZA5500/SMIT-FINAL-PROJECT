"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import AdminListPage, {
  ADMIN_TOGGLE_BUTTON_CLASS,
  AdminSearch,
  FilterIcon,
  FilterSelect,
  PrimaryAction,
  RowActions,
  StatusBadge,
  TH_CENTER_CLASS,
  TH_CLASS,
  TR_CLASS,
} from "@/components/admin/AdminListPage";
import { ADMIN_PRODUCT_META, PRODUCTS, formatPrice } from "@/data/products";

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      if (!term) return true;
      const meta = ADMIN_PRODUCT_META[p.id];
      return p.name.toLowerCase().includes(term) || (meta?.sku || "").toLowerCase().includes(term);
    });
  }, [search]);

  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toolbar = (
    <>
      <div className="flex items-center gap-3">
        <AdminSearch value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by product name or SKU..." />
        <PrimaryAction pushRight label="Create Product" href="/admin/products/new" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <FilterIcon />
        <FilterSelect label="Storage Type" />
        <FilterSelect label="All Brands" />
        <FilterSelect label="All Status" />
        <FilterSelect label="Sort by" />
        <button type="button" className={ADMIN_TOGGLE_BUTTON_CLASS}>
          Batch Tracked
        </button>
      </div>
    </>
  );

  return (
    <AdminListPage
      toolbar={toolbar}
      total={rows.length}
      page={page}
      pageSize={PAGE_SIZE}
      onPageChange={setPage}
      noun="products"
    >
      <table className="w-full text-sm table-fixed min-w-225">
        <colgroup>
          {["8%", "18%", "12%", "9%", "10%", "10%", "10%", "9%", "9%"].map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-gray-200 border-b">
            <th className={`${TH_CENTER_CLASS} rounded-tl-5`}>Image</th>
            <th className={TH_CLASS}>Product</th>
            <th className={TH_CLASS}>Category</th>
            <th className={TH_CLASS}>Price</th>
            <th className={TH_CLASS}>Brand</th>
            <th className={TH_CLASS}>Storage Type</th>
            <th className={TH_CLASS}>Batch Tracked</th>
            <th className={TH_CLASS}>Status</th>
            <th className={TH_CENTER_CLASS}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((p) => {
            const meta = ADMIN_PRODUCT_META[p.id];
            return (
              <tr key={p.id} className={TR_CLASS}>
                <td className="px-3 py-2 text-center">
                  <div className="relative mx-auto w-product-thumb h-product-thumb rounded-lg overflow-hidden border border-gray-100 shrink-0">
                    {p.image && (
                      <Image alt={p.name} fill sizes="70px" className="object-cover" src={p.image} />
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 text-left max-w-44">
                  <p className="text-base font-semibold text-body-text truncate">{p.name}</p>
                  <p className="text-sm font-light text-gray-500 truncate">SKU: {meta?.sku ?? "-"}</p>
                </td>
                <td className="px-3 py-2 text-left text-gray-500 max-w-32">
                  <p className="truncate">{p.category}</p>
                </td>
                <td className="px-3 py-2 text-left font-semibold text-body-text whitespace-nowrap">
                  ${formatPrice(p.price)}
                </td>
                <td className="px-3 py-2 text-left text-gray-500 max-w-32">
                  <p className="truncate">{meta?.brand ?? "-"}</p>
                </td>
                <td className="px-3 py-2 text-left text-gray-500 whitespace-nowrap capitalize">
                  {(meta?.storage ?? "-").toLowerCase()}
                </td>
                <td className="px-3 py-2 text-left">
                  {meta?.batchTracked ? (
                    <span
                      data-slot="badge"
                      className="inline-flex items-center justify-center rounded-full border gap-1 font-light text-xs h-7 px-3 bg-amber-50 text-amber-700 border-transparent"
                    >
                      Tracked
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-3 py-2 text-left whitespace-nowrap">
                  <StatusBadge label={meta?.status ?? "ACTIVE"} />
                </td>
                <td className="px-3 py-2 text-left">
                  <RowActions />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </AdminListPage>
  );
}

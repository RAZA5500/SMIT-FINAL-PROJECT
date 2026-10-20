"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import AdminListPage, {
  AdminSearch,
  FilterIcon,
  FilterSelect,
  PrimaryAction,
  RowActions,
  TH_CENTER_CLASS,
  TR_CLASS,
} from "@/components/admin/AdminListPage";
import { BRANDS } from "@/data/admin";

const PAGE_SIZE = 10;

export default function AdminBrandsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return BRANDS.filter((b) => !term || b.name.toLowerCase().includes(term));
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
        placeholder="Search by brand name..."
      />
      <div className="flex items-center gap-3 ml-auto shrink-0">
        <FilterIcon />
        <FilterSelect label="Own Label" />
        <PrimaryAction label="Create Brand" href="/admin/brands/create" />
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
      noun="brands"
    >
      <table className="w-full text-sm table-fixed min-w-175">
        <colgroup>
          {["15%", "45%", "25%", "15%"].map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-gray-200 border-b">
            <th className={`${TH_CENTER_CLASS} rounded-tl-5`}>Logo</th>
            <th className={TH_CENTER_CLASS}>Brand Name</th>
            <th className={TH_CENTER_CLASS}>Own Label</th>
            <th className={TH_CENTER_CLASS}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((b) => (
            <tr key={b.name} className={TR_CLASS}>
              <td className="px-3 py-2 text-center">
                <div className="flex justify-center">
                  <div className="relative border border-gray-100 rounded-lg w-11 h-11 overflow-hidden shrink-0">
                    <Image alt={b.name} fill sizes="44px" className="object-contain" src={b.logo} />
                  </div>
                </div>
              </td>
              <td className="px-3 py-2 text-center max-w-0 font-semibold text-gray-900">
                <p className="truncate">{b.name}</p>
              </td>
              <td className="px-3 py-2 text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  {b.ownLabel ? "Yes" : "No"}
                </span>
              </td>
              <td className="px-3 py-2 text-center">
                <RowActions variant="solid" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminListPage>
  );
}

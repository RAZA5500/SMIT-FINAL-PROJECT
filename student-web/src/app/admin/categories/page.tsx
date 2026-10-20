"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import AdminListPage, {
  AdminSearch,
  FilterIcon,
  FilterSelect,
  PrimaryAction,
  RowActions,
  StatusBadge,
  TH_CENTER_CLASS,
  TR_CLASS,
} from "@/components/admin/AdminListPage";
import { ADMIN_CATEGORIES } from "@/data/categories";

const PAGE_SIZE = 10;
const COL_WIDTHS = ["11%", "23.5%", "18.5%", "17.8%", "14.3%", "14.8%"];

export default function AdminCategoryPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ADMIN_CATEGORIES.filter((c) => !term || c.name.toLowerCase().includes(term));
  }, [search]);

  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  const toolbar = (
    <>
      <AdminSearch variant="capped" value={search} onChange={onSearch} placeholder="Search by category name..." />
      <div className="flex items-center gap-3 ml-auto shrink-0">
        <FilterIcon />
        <FilterSelect label="All Levels" />
        <FilterSelect label="Feature" />
        <PrimaryAction label="Create Category" href="/admin/category/create" />
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
      noun="categories"
    >
      <table className="w-full text-sm table-fixed min-w-175">
        <colgroup>
          {COL_WIDTHS.map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-gray-200 border-b">
            <th className={`${TH_CENTER_CLASS} rounded-tl-5`}>Image</th>
            <th className={TH_CENTER_CLASS}>Category Name</th>
            <th className={TH_CENTER_CLASS}>Description</th>
            <th className={TH_CENTER_CLASS}>Category Type</th>
            <th className={TH_CENTER_CLASS}>Status</th>
            <th className={TH_CENTER_CLASS}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((c) => (
            <tr key={c.name} className={TR_CLASS}>
              <td className="px-3 py-2 text-center">
                <div className="flex justify-center">
                  <div className="relative border border-gray-100 rounded-lg w-11 h-11 overflow-hidden shrink-0">
                    <Image alt={c.name} fill sizes="44px" className="object-cover" src={c.image} />
                  </div>
                </div>
              </td>
              <td className="px-3 py-2 text-center max-w-0 font-semibold text-gray-900">
                <p className="truncate">{c.name}</p>
              </td>
              <td className="px-3 py-2 text-center max-w-0 text-gray-500 text-sm">
                <p className="truncate">{c.description}</p>
              </td>
              <td className="px-3 py-2 text-center text-gray-700 text-sm whitespace-nowrap">{c.type}</td>
              <td className="px-3 py-2 text-center">
                <StatusBadge label={c.status} />
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

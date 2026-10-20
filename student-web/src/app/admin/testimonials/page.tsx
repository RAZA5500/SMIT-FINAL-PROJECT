"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import AdminListPage, {
  AdminSearch,
  FilterIcon,
  FilterSelect,
  PrimaryAction,
  RowActions,
  TH_CENTER_CLASS,
  TR_CLASS,
} from "@/components/admin/AdminListPage";
import { ADMIN_TESTIMONIALS } from "@/data/admin";

const PAGE_SIZE = 10;

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminTestimonialsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ADMIN_TESTIMONIALS.filter((t) => !term || t.customer.toLowerCase().includes(term));
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
        placeholder="Search by customer name..."
      />
      <div className="flex items-center gap-3 ml-auto shrink-0">
        <FilterIcon />
        <FilterSelect label="All Status" />
        <FilterSelect label="All" />
        <FilterSelect label="All Ratings" />
        <PrimaryAction label="Create Testimonial" />
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
      noun="testimonials"
    >
      <table className="w-full text-sm table-fixed min-w-250">
        <colgroup>
          {["8%", "14%", "8%", "26%", "10%", "10%", "9%", "8%", "7%"].map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-gray-200 border-b">
            <th className={`${TH_CENTER_CLASS} rounded-tl-5`}>Photo</th>
            <th className={TH_CENTER_CLASS}>Customer</th>
            <th className={TH_CENTER_CLASS}>Rating</th>
            <th className={TH_CENTER_CLASS}>Testimonial</th>
            <th className={TH_CENTER_CLASS}>Source</th>
            <th className={TH_CENTER_CLASS}>Status</th>
            <th className={TH_CENTER_CLASS}>Published</th>
            <th className={TH_CENTER_CLASS}>Date</th>
            <th className={TH_CENTER_CLASS}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((t) => (
            <tr key={t.customer} className={TR_CLASS}>
              <td className="px-3 py-2 text-center">
                <div className="relative mx-auto w-11 h-11 rounded-full overflow-hidden border border-gray-100 shrink-0 flex items-center justify-center bg-gray-900 text-white text-xs font-semibold">
                  {t.photo ? (
                    <Image alt={t.customer} fill sizes="44px" className="object-cover" src={t.photo} />
                  ) : (
                    initials(t.customer)
                  )}
                </div>
              </td>
              <td className="px-3 py-2 text-center">
                <p className="text-base font-semibold text-body-text truncate">{t.customer}</p>
              </td>
              <td className="px-3 py-2 text-center">
                <span className="inline-flex items-center gap-1 text-gray-700">
                  <Star className="w-3.5 h-3.5 fill-brand-orange stroke-brand-orange" />
                  {t.rating.toFixed(1)}
                </span>
              </td>
              <td className="px-3 py-2 text-center text-gray-500">
                <p className="truncate">{t.text}</p>
              </td>
              <td className="px-3 py-2 text-center text-gray-500 text-xs whitespace-nowrap">{t.source}</td>
              <td className="px-3 py-2 text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                  {t.status}
                </span>
              </td>
              <td className="px-3 py-2 text-center text-gray-500">{t.published ? "Yes" : "No"}</td>
              <td className="px-3 py-2 text-center text-gray-500 whitespace-nowrap">{t.date}</td>
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

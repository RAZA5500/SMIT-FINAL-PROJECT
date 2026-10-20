"use client";

import React, { useState } from "react";
import AdminListPage, { AdminSearch, FilterIcon, FilterSelect, TH_CENTER_CLASS } from "@/components/admin/AdminListPage";

const PAGE_SIZE = 10;

/* No product reviews have been left on the production store yet. */
const REVIEWS: never[] = [];

export default function AdminReviewsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const toolbar = (
    <>
      <AdminSearch variant="capped" value={search} onChange={setSearch} placeholder="Search by product name..." />
      <div className="flex items-center gap-3 ml-auto shrink-0">
        <FilterIcon />
        <FilterSelect label="All Status" />
        <FilterSelect label="All Ratings" />
      </div>
    </>
  );

  return (
    <AdminListPage
      toolbar={toolbar}
      toolbarClassName="hidden lg:flex items-center gap-3"
      total={REVIEWS.length}
      page={page}
      pageSize={PAGE_SIZE}
      onPageChange={setPage}
      noun="reviews"
    >
      <table className="w-full text-sm table-fixed min-w-250">
        <colgroup>
          {["8%", "13%", "14%", "8%", "18%", "10%", "9%", "12%", "8%"].map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-gray-200 border-b">
            <th className={`${TH_CENTER_CLASS} rounded-tl-5`}>Image</th>
            <th className={TH_CENTER_CLASS}>Product</th>
            <th className={TH_CENTER_CLASS}>Customer</th>
            <th className={TH_CENTER_CLASS}>Rating</th>
            <th className={TH_CENTER_CLASS}>Description</th>
            <th className={TH_CENTER_CLASS}>Status</th>
            <th className={TH_CENTER_CLASS}>Reply</th>
            <th className={TH_CENTER_CLASS}>Date</th>
            <th className={TH_CENTER_CLASS}>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={9} className="px-3 py-10 text-center text-gray-500">
              No reviews match the current filters.
            </td>
          </tr>
        </tbody>
      </table>
    </AdminListPage>
  );
}

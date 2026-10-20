"use client";

import React, { useState } from "react";
import AdminListPage, {
  AdminSearch,
  ADMIN_TOGGLE_BUTTON_CLASS,
  FilterIcon,
  FilterSelect,
  PrimaryAction,
  TH_CENTER_CLASS,
  TH_CLASS,
} from "@/components/admin/AdminListPage";

const PAGE_SIZE = 10;

/* The production store has no coupons configured yet. */
const COUPONS: never[] = [];

export default function AdminCouponsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const toolbar = (
    <>
      <AdminSearch variant="capped" value={search} onChange={setSearch} placeholder="Search by coupon code..." />
      <div className="flex items-center gap-3 ml-auto shrink-0">
        <FilterIcon />
        <FilterSelect label="All Status" />
        <FilterSelect label="All Types" />
        <button type="button" className={ADMIN_TOGGLE_BUTTON_CLASS}>
          Date Range
        </button>
        <PrimaryAction label="Create Coupon" />
      </div>
    </>
  );

  return (
    <AdminListPage
      toolbar={toolbar}
      toolbarClassName="hidden lg:flex items-center gap-3"
      total={COUPONS.length}
      page={page}
      pageSize={PAGE_SIZE}
      onPageChange={setPage}
      noun="coupons"
    >
      <table className="w-full text-sm table-fixed min-w-225">
        <colgroup>
          {["14%", "16%", "11%", "10%", "12%", "12%", "11%", "7%"].map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-gray-200 border-b">
            <th className={`${TH_CLASS} rounded-tl-5`}>Coupon Code</th>
            <th className={TH_CENTER_CLASS}>Discount Type &amp; Value</th>
            <th className={TH_CENTER_CLASS}>Min. Order</th>
            <th className={TH_CENTER_CLASS}>Usage</th>
            <th className={TH_CENTER_CLASS}>Valid From</th>
            <th className={TH_CENTER_CLASS}>Valid Till</th>
            <th className={TH_CENTER_CLASS}>Status</th>
            <th className={TH_CENTER_CLASS}>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={8} className="px-3 py-10 text-center text-gray-500">
              No coupons match the current filters.
            </td>
          </tr>
        </tbody>
      </table>
    </AdminListPage>
  );
}

"use client";

import React, { useMemo, useState } from "react";
import AdminListPage, {
  AdminSearch,
  FilterIcon,
  FilterSelect,
  PrimaryAction,
  RowActions,
  TH_CENTER_CLASS,
  TH_CLASS,
  TR_CLASS,
} from "@/components/admin/AdminListPage";
import { USERS } from "@/data/admin";

const PAGE_SIZE = 10;

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return USERS.filter(
      (u) =>
        !term ||
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.phone || "").includes(term)
    );
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
        placeholder="Search by name, email or phone no..."
      />
      <div className="flex items-center gap-3 ml-auto shrink-0">
        <FilterIcon />
        <FilterSelect label="All Status" />
        <FilterSelect label="All Role" />
        <PrimaryAction label="Create Admin" />
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
      noun="users"
    >
      <table className="w-full text-sm table-fixed min-w-175">
        <colgroup>
          {["25%", "17%", "12%", "18%", "14%", "9%"].map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-gray-200 border-b">
            <th className={`${TH_CLASS} rounded-tl-5`}>Name + Email</th>
            <th className={TH_CENTER_CLASS}>Phone No</th>
            <th className={TH_CENTER_CLASS}>Role</th>
            <th className={TH_CENTER_CLASS}>Last Login</th>
            <th className={TH_CENTER_CLASS}>Status</th>
            <th className={TH_CENTER_CLASS}>Action</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((u) => (
            <tr key={u.email} className={TR_CLASS}>
              <td className="px-3 py-2 text-left">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="flex justify-center items-center rounded-full w-9 h-9 shrink-0 text-white text-xs font-semibold"
                    style={{ background: "var(--gradient-avatar)" }}
                  >
                    {initials(u.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-body-text truncate">{u.name}</p>
                    <p className="text-sm font-light text-gray-500 truncate">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2 text-center text-gray-500 whitespace-nowrap">{u.phone ?? "—"}</td>
              <td className="px-3 py-2 text-center text-gray-500">{u.role}</td>
              <td className="px-3 py-2 text-center text-gray-500 whitespace-nowrap">{u.lastLogin ?? "—"}</td>
              <td className="px-3 py-2 text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                  {u.status}
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

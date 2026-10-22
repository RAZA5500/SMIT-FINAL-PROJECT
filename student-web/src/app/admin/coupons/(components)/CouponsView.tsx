"use client";

import { BadgePercent, Copy, Pencil, Plus, Power } from "lucide-react";
import { useState } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTableCard, ToolbarFilters } from "@/components/admin/DataTableCard";
import { CAMPAIGN_TONES, demoAction } from "@/components/admin/demo";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CAMPAIGN_STATUSES, COUPONS, type AdminCoupon } from "@/data/admin";
import { useClientPages } from "@/hooks/useClientPages";
import { formatMoney } from "@/lib/format";

const PAGE_SIZE = 10;
const ALL = "ALL";

const STATUS_OPTIONS = [
  { value: ALL, label: "All statuses" },
  ...CAMPAIGN_STATUSES.map((status) => ({ value: status, label: status })),
];

/** Redemptions vs limit — text value leads; green bar on a neutral grey track */
function UsageMeter({ coupon }: { coupon: AdminCoupon }) {
  const width = Math.min(100, Math.round((coupon.used / coupon.limit) * 100));
  return (
    <div className="flex flex-col gap-1.5">
      <span className="numeric text-sm">
        <span className="font-semibold">{coupon.used}</span>
        <span className="text-muted-foreground"> / {coupon.limit}</span>
      </span>
      <span className="h-1.5 w-24 overflow-hidden rounded-full bg-foreground/10" aria-hidden="true">
        <span className="block h-full rounded-full bg-brand" style={{ width: `${width}%` }} />
      </span>
    </div>
  );
}

export function CouponsView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL);

  const term = search.trim().toLowerCase();
  const rows = COUPONS.filter(
    (coupon) => (status === ALL || coupon.status === status) && (!term || coupon.code.toLowerCase().includes(term)),
  );
  const { currentPage, totalPages, setPage, pageRows } = useClientPages(rows, PAGE_SIZE);

  return (
    <AdminPage
      demo
      title="Coupons"
      description="Discount codes for checkout. Checkout doesn't accept codes yet, so none of these are live and changes aren't saved."
      actions={
        <Button onClick={() => demoAction("Creating coupons")}>
          <Plus aria-hidden="true" />
          New coupon
        </Button>
      }
    >
      <DataTableCard
        toolbar={
          <>
            <SearchInput
              value={search}
              onValueChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search codes…"
              className="w-full md:max-w-xs"
            />
            <ToolbarFilters>
              <SelectField
                id="coupon-status-filter"
                aria-label="Filter by status"
                size="sm"
                options={STATUS_OPTIONS}
                value={status}
                onValueChange={(value) => {
                  setStatus(value ?? ALL);
                  setPage(1);
                }}
                containerClassName="w-36"
              />
            </ToolbarFilters>
          </>
        }
        footer={
          rows.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              total={rows.length}
              limit={PAGE_SIZE}
              onPageChange={setPage}
              itemLabel="coupons"
            />
          ) : undefined
        }
      >
        {rows.length === 0 ? (
          <EmptyState
            icon={<BadgePercent aria-hidden="true" />}
            title="No coupons match"
            message="Try another code or status."
          />
        ) : (
          <Table className="min-w-220">
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead className="text-right">Min. spend</TableHead>
                <TableHead>Used</TableHead>
                <TableHead>Valid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((coupon) => (
                <TableRow key={coupon.code}>
                  <TableCell>
                    <span className="rounded-md border border-dashed border-brand bg-brand-soft px-2 py-1 font-mono text-sm font-semibold text-brand">
                      {coupon.code}
                    </span>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold">{coupon.discount}</p>
                    <p className="text-xs text-muted-foreground">{coupon.appliesTo}</p>
                  </TableCell>
                  <TableCell className="numeric text-right">
                    {coupon.minimumSpend ? formatMoney(coupon.minimumSpend) : <span className="text-muted-foreground">None</span>}
                  </TableCell>
                  <TableCell>
                    <UsageMeter coupon={coupon} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {coupon.from} – {coupon.to}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={coupon.status} tone={CAMPAIGN_TONES[coupon.status]} />
                  </TableCell>
                  <TableCell>
                    <RowActionsMenu
                      label={coupon.code}
                      actions={[
                        { label: "Edit", icon: Pencil, onSelect: () => demoAction("Editing coupons") },
                        { label: "Duplicate", icon: Copy, onSelect: () => demoAction("Duplicating coupons") },
                        {
                          label: "Deactivate",
                          icon: Power,
                          destructive: true,
                          disabled: coupon.status === "Expired",
                          onSelect: () => demoAction("Deactivating coupons"),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DataTableCard>
    </AdminPage>
  );
}

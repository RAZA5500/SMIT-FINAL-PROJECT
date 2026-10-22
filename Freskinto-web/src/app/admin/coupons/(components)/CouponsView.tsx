"use client";

import { BadgePercent, Copy, Pencil, Plus, Power } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/flex";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Text } from "@/components/ui/typography";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTableCard, ToolbarFilters } from "@/components/admin/DataTableCard";
import { CAMPAIGN_TONES, demoAction } from "@/components/admin/demo";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CAMPAIGN_STATUSES, COUPONS, type AdminCoupon } from "@/data/admin";
import { useClientPages } from "@/hooks/useClientPages";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;
const ALL = "ALL";

const STATUS_OPTIONS = [{ value: ALL, label: "All statuses" }, ...CAMPAIGN_STATUSES.map((status) => ({ value: status, label: status }))];

/** Redemptions vs limit — text value leads; emerald bar on a neutral track */
function UsageMeter({ coupon }: { coupon: AdminCoupon }) {
  const value = Math.min(100, Math.round((coupon.used / coupon.limit) * 100));
  return (
    <Stack gap="1.5">
      <Text as="span" numeric>
        <Text as="span" weight="semibold">
          {coupon.used}
        </Text>
        <Text as="span" tone="muted">
          {" "}
          / {coupon.limit}
        </Text>
      </Text>
      <Progress value={value} aria-label={`${coupon.code} redemptions`} className={cn("w-24 **:data-[slot=progress-track]:h-1.5")} />
    </Stack>
  );
}

export function CouponsView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL);

  const term = search.trim().toLowerCase();
  const rows = COUPONS.filter((coupon) => (status === ALL || coupon.status === status) && (!term || coupon.code.toLowerCase().includes(term)));
  const { currentPage, totalPages, setPage, pageRows } = useClientPages(rows, PAGE_SIZE);

  return (
    <AdminPage
      demo
      eyebrow="Marketing"
      title="Coupons"
      description="Discount codes for checkout. Checkout doesn't accept codes yet, so none of these are live and changes aren't saved."
      actions={
        <Button onClick={() => demoAction("Creating coupons")}>
          <Plus data-icon="inline-start" aria-hidden="true" />
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
              aria-label="Search coupons"
              className={cn("w-full md:max-w-xs")}
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
                containerClassName={cn("w-36")}
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
          <EmptyState icon={<BadgePercent aria-hidden="true" />} title="No coupons match" message="Try another code or status." />
        ) : (
          <Table className={cn("min-w-220")}>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead className={cn("text-right")}>Min. spend</TableHead>
                <TableHead>Used</TableHead>
                <TableHead>Valid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className={cn("w-12")}>
                  <Text as="span" className={cn("sr-only")}>
                    Actions
                  </Text>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((coupon) => (
                <TableRow key={coupon.code}>
                  <TableCell>
                    <Badge variant="tag" className={cn("border-dashed border-primary text-sm font-semibold text-brand")}>
                      {coupon.code}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Stack gap="0.5">
                      <Text weight="semibold">{coupon.discount}</Text>
                      <Text variant="small" tone="muted">
                        {coupon.appliesTo}
                      </Text>
                    </Stack>
                  </TableCell>
                  <TableCell className={cn("text-right tabular-nums")}>
                    {coupon.minimumSpend ? (
                      formatMoney(coupon.minimumSpend)
                    ) : (
                      <Text as="span" tone="muted">
                        None
                      </Text>
                    )}
                  </TableCell>
                  <TableCell>
                    <UsageMeter coupon={coupon} />
                  </TableCell>
                  <TableCell className={cn("whitespace-nowrap text-muted-foreground")}>
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

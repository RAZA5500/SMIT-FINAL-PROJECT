"use client";

import { Pencil, Plus, Tags, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { BrandMonogram } from "@/components/admin/BrandMonogram";
import { DataTableCard, ToolbarFilters } from "@/components/admin/DataTableCard";
import { demoAction } from "@/components/admin/demo";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BRANDS } from "@/data/admin";
import { useClientPages } from "@/hooks/useClientPages";
import { adminMockRoutes } from "@/lib/routes/routes";

const PAGE_SIZE = 10;

type LabelFilter = "ALL" | "OWN" | "PARTNER";

const LABEL_OPTIONS: { value: LabelFilter; label: string }[] = [
  { value: "ALL", label: "All brands" },
  { value: "OWN", label: "Own label" },
  { value: "PARTNER", label: "Partner brands" },
];

export function BrandsView() {
  const [search, setSearch] = useState("");
  const [labelFilter, setLabelFilter] = useState<LabelFilter>("ALL");

  const term = search.trim().toLowerCase();
  const rows = BRANDS.filter(
    (brand) =>
      (labelFilter === "ALL" || brand.ownLabel === (labelFilter === "OWN")) &&
      (!term || brand.name.toLowerCase().includes(term)),
  );
  const { currentPage, totalPages, setPage, pageRows } = useClientPages(rows, PAGE_SIZE);

  return (
    <AdminPage
      demo
      title="Brands"
      description="Our own label and the producers we stock. Brands aren't linked to products yet, so changes here aren't saved."
      actions={
        <Link href={adminMockRoutes.brandNew} className={buttonVariants()}>
          <Plus aria-hidden="true" />
          New brand
        </Link>
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
              placeholder="Search brands…"
              className="w-full md:max-w-xs"
            />
            <ToolbarFilters>
              <SelectField
                id="brand-label-filter"
                aria-label="Filter by label"
                size="sm"
                options={LABEL_OPTIONS}
                value={labelFilter}
                onValueChange={(value) => {
                  setLabelFilter(value ?? "ALL");
                  setPage(1);
                }}
                containerClassName="w-40"
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
              itemLabel="brands"
            />
          ) : undefined
        }
      >
        {rows.length === 0 ? (
          <EmptyState icon={<Tags aria-hidden="true" />} title="No brands match" message="Try a different name or filter." />
        ) : (
          <Table className="min-w-160">
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Main aisle</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead>Label</TableHead>
                <TableHead className="w-12">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((brand) => (
                <TableRow key={brand.name}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <BrandMonogram name={brand.name} aisle={brand.aisle} />
                      <span className="font-semibold">{brand.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{brand.aisle}</TableCell>
                  <TableCell className="numeric text-right">{brand.products}</TableCell>
                  <TableCell>
                    {brand.ownLabel ? (
                      <StatusBadge status="OWN_LABEL" label="Own label" tone="success" />
                    ) : (
                      <StatusBadge status="PARTNER" label="Partner" tone="neutral" />
                    )}
                  </TableCell>
                  <TableCell>
                    <RowActionsMenu
                      label={brand.name}
                      actions={[
                        { label: "Edit", icon: Pencil, onSelect: () => demoAction("Editing brands") },
                        { label: "Delete", icon: Trash2, destructive: true, onSelect: () => demoAction("Deleting brands") },
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

"use client";

import { Pencil, Plus, ShieldAlert, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Text } from "@/components/ui/typography";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTableCard, ToolbarFilters } from "@/components/admin/DataTableCard";
import { demoAction } from "@/components/admin/demo";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { ProductImage } from "@/components/shared/ProductImage";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge, type StatusTone } from "@/components/shared/StatusBadge";
import { ALLERGENS, PRESENCES, UK_ALLERGENS, type Presence } from "@/data/admin";
import { useClientPages } from "@/hooks/useClientPages";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;
const ALL = "ALL";

const PRESENCE_TONES: Record<Presence, StatusTone> = {
  Contains: "danger",
  "May contain": "warning",
  "Free from": "success",
};

const ALLERGEN_OPTIONS = [{ value: ALL, label: "All allergens" }, ...UK_ALLERGENS.map((allergen) => ({ value: allergen, label: allergen }))];

const PRESENCE_OPTIONS = [{ value: ALL, label: "Any declaration" }, ...PRESENCES.map((presence) => ({ value: presence, label: presence }))];

export function AllergensView() {
  const [search, setSearch] = useState("");
  const [allergen, setAllergen] = useState(ALL);
  const [presence, setPresence] = useState(ALL);

  const term = search.trim().toLowerCase();
  const rows = ALLERGENS.filter(
    (row) =>
      (allergen === ALL || row.allergen === allergen) &&
      (presence === ALL || row.presence === presence) &&
      (!term || row.product.toLowerCase().includes(term) || row.sku.toLowerCase().includes(term)),
  );
  const { currentPage, totalPages, setPage, pageRows } = useClientPages(rows, PAGE_SIZE);

  const filterBy = (setter: (value: string) => void) => (value: string | null) => {
    setter(value ?? ALL);
    setPage(1);
  };

  return (
    <AdminPage
      demo
      eyebrow="Catalogue"
      title="Allergens"
      description="What each product contains, may contain or is free from — across the 14 allergens UK law asks us to declare. Changes here aren't saved."
      actions={
        <Button onClick={() => demoAction("Adding allergen declarations")}>
          <Plus data-icon="inline-start" aria-hidden="true" />
          Add declaration
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
              placeholder="Product or SKU…"
              className={cn("w-full md:max-w-xs")}
            />
            <ToolbarFilters>
              <SelectField
                id="allergen-filter"
                aria-label="Filter by allergen"
                size="sm"
                options={ALLERGEN_OPTIONS}
                value={allergen}
                onValueChange={filterBy(setAllergen)}
                containerClassName={cn("w-52")}
              />
              <SelectField
                id="presence-filter"
                aria-label="Filter by declaration"
                size="sm"
                options={PRESENCE_OPTIONS}
                value={presence}
                onValueChange={filterBy(setPresence)}
                containerClassName={cn("w-40")}
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
              itemLabel="declarations"
            />
          ) : undefined
        }
      >
        {rows.length === 0 ? (
          <EmptyState icon={<ShieldAlert aria-hidden="true" />} title="No declarations match" message="Try another allergen or clear the search." />
        ) : (
          <Table className={cn("min-w-180")}>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Allergen</TableHead>
                <TableHead>Declaration</TableHead>
                <TableHead className={cn("w-12")}>
                  <Text as="span" className={cn("sr-only")}>
                    Actions
                  </Text>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((row) => (
                <TableRow key={`${row.sku}-${row.allergen}`}>
                  <TableCell>
                    <Flex align="center" gap="3">
                      <ProductImage
                        name={row.product}
                        categoryName={row.category}
                        sizes="44px"
                        className={cn("size-11 shrink-0 rounded-lg border")}
                        imageClassName={cn("p-1")}
                      />
                      <Stack gap="0.5" className={cn("min-w-0")}>
                        <Text weight="semibold" className={cn("truncate")}>
                          {row.product}
                        </Text>
                        <Text variant="code" tone="muted">
                          {row.sku}
                        </Text>
                      </Stack>
                    </Flex>
                  </TableCell>
                  <TableCell>{row.allergen}</TableCell>
                  <TableCell>
                    <StatusBadge status={row.presence} tone={PRESENCE_TONES[row.presence]} />
                  </TableCell>
                  <TableCell>
                    <RowActionsMenu
                      label={`${row.product} — ${row.allergen}`}
                      actions={[
                        { label: "Edit", icon: Pencil, onSelect: () => demoAction("Editing declarations") },
                        { label: "Remove", icon: Trash2, destructive: true, onSelect: () => demoAction("Removing declarations") },
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

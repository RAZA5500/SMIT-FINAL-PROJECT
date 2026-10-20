"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import AdminListPage, {
  ADMIN_FILTER_FIELD_CLASS,
  ADMIN_SEARCH_FIELD_CLASS,
  FilterIcon,
  PrimaryAction,
  TD_CLASS,
  TH_CENTER_CLASS,
  TH_CLASS,
  TR_STATIC_CLASS,
} from "@/components/admin/AdminListPage";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useDeleteCategory } from "@/services/categories/mutations";
import { useGetAdminCategories } from "@/services/categories/queries";
import type { ICategory } from "@/services/categories/types";
import { CategoryFormDialog } from "./CategoryFormDialog";

const PAGE_SIZE = 10;
/** Parent dropdown/filter ke liye saari categories (backend max limit) */
const ALL_CATEGORIES_LIMIT = 100;
const ALL = "ALL";

const STATUS_OPTIONS = [
  { value: ALL, label: "All statuses" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export function CategoriesView() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [parentId, setParentId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ICategory | null>(null);
  const [deleting, setDeleting] = useState<ICategory | null>(null);

  const debouncedSearch = useDebounce(search.trim());
  const { data, isLoading, isFetching, isError, error, refetch } = useGetAdminCategories({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    parentId: parentId ?? undefined,
    isActive: isActive ?? undefined,
  });
  const { data: allCategories } = useGetAdminCategories({ limit: ALL_CATEGORIES_LIMIT });
  const deleteCategory = useDeleteCategory();

  const topLevel = useMemo(
    () => (allCategories?.data ?? []).filter((category) => category.depth === 0),
    [allCategories],
  );
  const nameById = useMemo(
    () => new Map((allCategories?.data ?? []).map((category) => [category.id, category.name])),
    [allCategories],
  );

  const resetPage = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const openForm = (category: ICategory | null) => {
    setEditing(category);
    setFormOpen(true);
  };

  const toolbar = (
    <>
      <SearchInput
        value={search}
        onValueChange={resetPage(setSearch)}
        placeholder="Search by category name..."
        className="max-w-search"
        inputClassName={ADMIN_SEARCH_FIELD_CLASS}
      />
      <div className="ml-auto flex shrink-0 flex-wrap items-center gap-3">
        <FilterIcon />
        <SelectField
          id="category-parent-filter"
          options={[
            { value: ALL, label: "All levels" },
            ...topLevel.map((category) => ({ value: category.id, label: `Under ${category.name}` })),
          ]}
          value={parentId ?? ALL}
          onValueChange={(value) => resetPage(setParentId)(!value || value === ALL ? null : value)}
          className={ADMIN_FILTER_FIELD_CLASS}
        />
        <SelectField
          id="category-status-filter"
          options={STATUS_OPTIONS}
          value={isActive === null ? ALL : String(isActive)}
          onValueChange={(value) => resetPage(setIsActive)(!value || value === ALL ? null : value === "true")}
          className={ADMIN_FILTER_FIELD_CLASS}
        />
        <PrimaryAction label="Create Category" onClick={() => openForm(null)} />
      </div>
    </>
  );

  let content: ReactNode;
  if (isLoading) {
    content = <TableSkeleton columns={6} />;
  } else if (isError) {
    content = <ErrorState title="Couldn't load categories" message={error.message} onRetry={() => void refetch()} />;
  } else if (!data?.data.length) {
    content = (
      <EmptyState
        title="No categories found"
        message={debouncedSearch || parentId || isActive !== null ? "Try different filters." : "Create your first category."}
      />
    );
  } else {
    content = (
      <Table className={cn("min-w-175", isFetching && "opacity-60 transition-opacity")}>
        <TableHeader>
          <TableRow className="border-gray-200">
            <TableHead className={TH_CLASS}>Category</TableHead>
            <TableHead className={TH_CLASS}>Parent</TableHead>
            <TableHead className={TH_CLASS}>Description</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Sub-categories</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Products</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Status</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((category) => (
            <TableRow key={category.id} className={TR_STATIC_CLASS}>
              <TableCell className={TD_CLASS}>
                <p className="font-semibold text-gray-900">{category.name}</p>
                <p className="text-xs text-gray-500">{category.slug}</p>
              </TableCell>
              <TableCell className={TD_CLASS}>
                {category.parentId ? (nameById.get(category.parentId) ?? "—") : "Top-level"}
              </TableCell>
              <TableCell className={cn(TD_CLASS, "max-w-64 truncate text-gray-500")}>
                {category.description || "—"}
              </TableCell>
              <TableCell className={cn(TD_CLASS, "text-center")}>{category.childCount}</TableCell>
              <TableCell className={cn(TD_CLASS, "text-center")}>{category.productCount}</TableCell>
              <TableCell className={cn(TD_CLASS, "text-center")}>
                <StatusBadge status={category.isActive ? "ACTIVE" : "INACTIVE"} />
              </TableCell>
              <TableCell className={TD_CLASS}>
                <RowActionsMenu
                  label={category.name}
                  actions={[
                    { label: "Edit", icon: Pencil, onSelect: () => openForm(category) },
                    { label: "Delete", icon: Trash2, destructive: true, onSelect: () => setDeleting(category) },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <>
      <AdminListPage
        toolbar={toolbar}
        responsiveToolbar
        total={data?.meta.total ?? 0}
        page={data?.meta.currentPage ?? page}
        pageSize={data?.meta.limit ?? PAGE_SIZE}
        onPageChange={setPage}
        noun="categories"
      >
        {content}
      </AdminListPage>

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editing}
        topLevelCategories={topLevel}
      />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete "${deleting?.name ?? ""}"?`}
        description="Categories with sub-categories or products can't be deleted — deactivate them instead."
        confirmLabel="Delete category"
        destructive
        isPending={deleteCategory.isPending}
        onConfirm={() => deleting && deleteCategory.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
      />
    </>
  );
}

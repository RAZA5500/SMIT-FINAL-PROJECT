"use client";

import { FolderTree, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTableCard, ToolbarFilters } from "@/components/admin/DataTableCard";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/hooks/useDebounce";
import { categoryTheme, TONE_CLASSES } from "@/lib/merchandising";
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

function CategoryName({ category }: { category: ICategory }) {
  const theme = categoryTheme(category.name);
  const Icon = theme.icon;
  return (
    <div className="flex items-center gap-3">
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", TONE_CLASSES[theme.tone].tile)}>
        <Icon className={cn("size-5", TONE_CLASSES[theme.tone].icon)} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate font-semibold text-foreground">{category.name}</p>
        <p className="truncate text-xs text-muted-foreground">/{category.slug}</p>
      </div>
    </div>
  );
}

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

  const hasFilters = Boolean(debouncedSearch || parentId || isActive !== null);

  let content: ReactNode;
  if (isLoading) {
    content = <TableSkeleton columns={6} />;
  } else if (isError) {
    content = <ErrorState title="Couldn't load categories" message={error.message} onRetry={() => void refetch()} />;
  } else if (!data?.data.length) {
    content = (
      <EmptyState
        icon={<FolderTree aria-hidden="true" />}
        title={hasFilters ? "No categories match" : "No categories yet"}
        message={hasFilters ? "Try a different search or filter." : "Create your first aisle to start adding products."}
        action={
          !hasFilters && (
            <Button onClick={() => openForm(null)}>
              <Plus aria-hidden="true" />
              New category
            </Button>
          )
        }
      />
    );
  } else {
    content = (
      <Table className="min-w-200">
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Sub-categories</TableHead>
            <TableHead className="text-right">Products</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="max-w-64">
                <CategoryName category={category} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {category.parentId ? (nameById.get(category.parentId) ?? "—") : "Top-level aisle"}
              </TableCell>
              <TableCell className="max-w-64 truncate text-muted-foreground">{category.description || "—"}</TableCell>
              <TableCell className="numeric text-right">{category.childCount}</TableCell>
              <TableCell className="numeric text-right font-medium">{category.productCount}</TableCell>
              <TableCell>
                <StatusBadge status={category.isActive ? "ACTIVE" : "INACTIVE"} />
              </TableCell>
              <TableCell>
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
    <AdminPage
      title="Categories"
      description="Organise the shop into aisles. Products can only be added to active categories without sub-categories."
      actions={
        <Button onClick={() => openForm(null)}>
          <Plus aria-hidden="true" />
          New category
        </Button>
      }
    >
      <DataTableCard
        busy={isFetching && !isLoading}
        toolbar={
          <>
            <SearchInput
              value={search}
              onValueChange={resetPage(setSearch)}
              placeholder="Search categories…"
              className="w-full md:max-w-xs"
            />
            <ToolbarFilters>
              <SelectField
                id="category-parent-filter"
                aria-label="Filter by parent"
                size="sm"
                options={[
                  { value: ALL, label: "All levels" },
                  ...topLevel.map((category) => ({ value: category.id, label: `In ${category.name}` })),
                ]}
                value={parentId ?? ALL}
                onValueChange={(value) => resetPage(setParentId)(!value || value === ALL ? null : value)}
                containerClassName="w-44"
              />
              <SelectField
                id="category-status-filter"
                aria-label="Filter by status"
                size="sm"
                options={STATUS_OPTIONS}
                value={isActive === null ? ALL : String(isActive)}
                onValueChange={(value) => resetPage(setIsActive)(!value || value === ALL ? null : value === "true")}
                containerClassName="w-36"
              />
            </ToolbarFilters>
          </>
        }
        footer={
          data && data.meta.total > 0 ? (
            <Pagination
              currentPage={data.meta.currentPage}
              totalPages={data.meta.pages}
              total={data.meta.total}
              limit={data.meta.limit}
              onPageChange={setPage}
              itemLabel="categories"
            />
          ) : undefined
        }
      >
        {content}
      </DataTableCard>

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
    </AdminPage>
  );
}

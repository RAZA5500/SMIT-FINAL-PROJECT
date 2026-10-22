"use client";

import { FolderTree, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AdminDataTable, AdminEmptyState, type AdminColumn } from "@/components/admin/AdminDataTable";
import { AdminFilterDropdown } from "@/components/admin/AdminFilterDropdown";
import { AdminPage } from "@/components/admin/AdminPage";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { StandardDestructiveModal } from "@/components/shared/StandardDestructiveModal";
import { ACTIVE_STATUS_OPTIONS, ADMIN_PAGE_SIZE, LOOKUP_LIMIT } from "@/constants/filters";
import { categoryTheme, TONE_CLASSES } from "@/lib/merchandising";
import { cn } from "@/lib/utils";
import { useDeleteCategory, useUpdateCategory } from "@/services/categories/mutations";
import { useGetAdminCategories } from "@/services/categories/queries";
import type { ICategory } from "@/services/categories/types";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { CategoryTableSkeleton } from "./CategoryTableSkeleton";

function CategoryName({ category }: { category: ICategory }) {
  const theme = categoryTheme(category.name);
  const tone = TONE_CLASSES[theme.tone];
  const Icon = theme.icon;
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl [&_svg]:size-5", tone.tile, tone.icon)}
      >
        <Icon />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="truncate font-semibold text-foreground">{category.name}</p>
        <p className="truncate font-mono text-fs-12 text-muted-foreground">/{category.slug}</p>
      </div>
    </div>
  );
}

export function CategoriesView() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [parentId, setParentId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<"true" | "false" | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ICategory | null>(null);
  const [deleting, setDeleting] = useState<ICategory | null>(null);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetAdminCategories({
    page,
    limit: ADMIN_PAGE_SIZE,
    search: search.trim() || undefined,
    parentId: parentId ?? undefined,
    isActive: isActive === null ? undefined : isActive === "true",
  });
  // Parent dropdown/filter ke liye saari categories
  const { data: allCategories } = useGetAdminCategories({ limit: LOOKUP_LIMIT });
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const topLevel = useMemo(() => (allCategories?.data ?? []).filter((category) => category.depth === 0), [allCategories]);
  const nameById = useMemo(
    () => new Map((allCategories?.data ?? []).map((category) => [category.id, category.name])),
    [allCategories],
  );

  const openForm = (category: ICategory | null) => {
    setEditing(category);
    setFormOpen(true);
  };

  const hasFilters = Boolean(search.trim() || parentId || isActive !== null);

  const columns: AdminColumn<ICategory>[] = [
    { key: "name", header: "Category", cell: (category) => <CategoryName category={category} />, className: "max-w-64" },
    {
      key: "parent",
      header: "Parent",
      hideBelow: "md",
      className: "text-muted-foreground",
      cell: (category) => (category.parentId ? (nameById.get(category.parentId) ?? "—") : "Top-level aisle"),
    },
    {
      key: "description",
      header: "Description",
      hideBelow: "lg",
      className: "max-w-64 truncate text-muted-foreground",
      cell: (category) => category.description || "—",
    },
    {
      key: "children",
      header: "Sub-categories",
      align: "right",
      hideBelow: "md",
      className: "numeric",
      cell: (category) => category.childCount,
    },
    { key: "products", header: "Products", align: "right", className: "numeric font-medium", cell: (category) => category.productCount },
    {
      key: "status",
      header: "Active",
      cell: (category) => (
        <Switch
          size="sm"
          checked={category.isActive}
          aria-label={`${category.name} is ${category.isActive ? "active" : "inactive"}`}
          disabled={updateCategory.isPending && updateCategory.variables?.id === category.id}
          onCheckedChange={(checked) => updateCategory.mutate({ id: category.id, payload: { isActive: checked } })}
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      srOnlyHeader: true,
      align: "right",
      cell: (category) => (
        <RowActionsMenu
          label={category.name}
          actions={[
            { label: "Edit", icon: Pencil, onSelect: () => openForm(category) },
            { label: "Delete", icon: Trash2, destructive: true, onSelect: () => setDeleting(category) },
          ]}
        />
      ),
    },
  ];

  return (
    <AdminPage
      eyebrow="Catalogue"
      title="Categories"
      description="Organise the shop into aisles. Products can only be added to active categories without sub-categories."
      actions={
        <Button onClick={() => openForm(null)}>
          <Plus aria-hidden="true" />
          New category
        </Button>
      }
    >
      <AdminDataTable
        caption="Categories"
        columns={columns}
        rows={data?.data}
        getRowId={(category) => category.id}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        errorTitle="Couldn't load categories"
        errorMessage={error?.message}
        onRetry={() => void refetch()}
        skeleton={<CategoryTableSkeleton />}
        emptyState={
          <AdminEmptyState
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
        }
        toolbar={
          <>
            <SearchInput
              value={search}
              onValueChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Search categories…"
              className="w-full md:max-w-xs"
            />
            <div className="flex flex-wrap items-center gap-2">
              <AdminFilterDropdown
                id="category-parent-filter"
                label="Filter by parent"
                allLabel="All levels"
                options={topLevel.map((category) => ({ value: category.id, label: `In ${category.name}` }))}
                value={parentId}
                onValueChange={(value) => {
                  setParentId(value);
                  setPage(1);
                }}
              />
              <AdminFilterDropdown
                id="category-status-filter"
                label="Filter by status"
                allLabel="All statuses"
                options={ACTIVE_STATUS_OPTIONS as { value: "true" | "false"; label: string }[]}
                value={isActive}
                onValueChange={(value) => {
                  setIsActive(value);
                  setPage(1);
                }}
              />
            </div>
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
      />

      <CategoryFormDialog open={formOpen} onOpenChange={setFormOpen} category={editing} topLevelCategories={topLevel} />
      <StandardDestructiveModal
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete "${deleting?.name ?? ""}"?`}
        description="Categories with sub-categories or products cannot be deleted. Deactivate them instead if they have existing items."
        confirmLabel="Delete category"
        isLoading={deleteCategory.isPending}
        onConfirm={() => deleting && deleteCategory.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        entitySummary={
          deleting && (
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-foreground">{deleting.name}</p>
              <p className="font-mono text-fs-12 text-muted-foreground">/{deleting.slug}</p>
              <p className="flex gap-3 pt-1 text-xs text-muted-foreground">
                <span>Sub-categories: {deleting.childCount ?? 0}</span>
                <span aria-hidden="true">•</span>
                <span>Products: {deleting.productCount ?? 0}</span>
              </p>
            </div>
          )
        }
      />
    </AdminPage>
  );
}

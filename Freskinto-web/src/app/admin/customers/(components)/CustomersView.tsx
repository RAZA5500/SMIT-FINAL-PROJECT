"use client";

import { UserCheck, UserX, Users } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTableCard, ToolbarFilters } from "@/components/admin/DataTableCard";
import { RowActionsMenu } from "@/components/admin/RowActionsMenu";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { SearchInput } from "@/components/shared/SearchInput";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { cn, formatDate, formatDateTime, formatMoney, initials } from "@/lib/utils";
import { useUpdateCustomerStatus } from "@/services/customers/mutations";
import { useGetCustomers } from "@/services/customers/queries";
import type { ICustomer } from "@/services/customers/types";

const PAGE_SIZE = 10;
const ALL = "ALL";

const STATUS_OPTIONS = [
  { value: ALL, label: "All statuses" },
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export function CustomersView() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [changing, setChanging] = useState<ICustomer | null>(null);

  const debouncedSearch = useDebounce(search.trim());
  const { data, isLoading, isFetching, isError, error, refetch } = useGetCustomers({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    isActive: isActive ?? undefined,
  });
  const updateStatus = useUpdateCustomerStatus();
  const filtered = Boolean(debouncedSearch || isActive !== null);

  let content: ReactNode;
  if (isLoading) {
    content = <TableSkeleton columns={6} />;
  } else if (isError) {
    content = <ErrorState title="Couldn't load customers" message={error.message} onRetry={() => void refetch()} />;
  } else if (!data?.data.length) {
    content = (
      <EmptyState
        icon={<Users aria-hidden="true" />}
        title={filtered ? "No customers match" : "No customers yet"}
        message={filtered ? "Try different filters." : "Customers appear here after they register."}
      />
    );
  } else {
    content = (
      <Table className={cn("min-w-225")}>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className={cn("text-right")}>Orders</TableHead>
            <TableHead className={cn("text-right")}>Total spent</TableHead>
            <TableHead>Last login</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className={cn("w-12")}>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((customer) => (
            <TableRow key={customer.id} className={cn(!customer.isActive && "text-muted-foreground")}>
              <TableCell className={cn("max-w-64")}>
                <div className="flex items-center gap-3">
                  <Avatar className={cn("size-9")}>
                    <AvatarFallback
                      className={cn(
                        "text-xs font-semibold",
                        customer.isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {initials(customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="font-semibold truncate text-foreground">
                      {customer.name}
                    </p>
                    <p className="text-fs-12 text-muted-foreground truncate">
                      {customer.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className={cn("text-muted-foreground")}>{customer.phone ?? "—"}</TableCell>
              <TableCell className={cn("text-right tabular-nums")}>{customer.totalOrders}</TableCell>
              <TableCell className={cn("text-right font-semibold tabular-nums")}>{formatMoney(customer.totalSpent)}</TableCell>
              <TableCell className={cn("text-muted-foreground tabular-nums")}>{formatDateTime(customer.lastLoginAt)}</TableCell>
              <TableCell className={cn("text-muted-foreground tabular-nums")}>{formatDate(customer.createdAt)}</TableCell>
              <TableCell>
                <StatusBadge status={customer.isActive ? "ACTIVE" : "INACTIVE"} />
              </TableCell>
              <TableCell>
                <RowActionsMenu
                  label={customer.name}
                  actions={[
                    customer.isActive
                      ? { label: "Deactivate", icon: UserX, destructive: true, onSelect: () => setChanging(customer) }
                      : { label: "Activate", icon: UserCheck, onSelect: () => setChanging(customer) },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  const deactivating = changing?.isActive ?? false;

  return (
    <AdminPage
      eyebrow="Sales"
      title="Customers"
      description="Everyone with a Freskinto account. Deactivated customers can't sign in or order."
    >
      <DataTableCard
        busy={isFetching && !isLoading}
        toolbar={
          <>
            <SearchInput
              value={search}
              onValueChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              placeholder="Name, email or phone…"
              className={cn("w-full md:max-w-xs")}
            />
            <ToolbarFilters>
              <SelectField
                id="customer-status-filter"
                aria-label="Filter by status"
                size="sm"
                options={STATUS_OPTIONS}
                value={isActive === null ? ALL : String(isActive)}
                onValueChange={(value) => {
                  setIsActive(!value || value === ALL ? null : value === "true");
                  setPage(1);
                }}
                containerClassName={cn("w-36")}
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
              itemLabel="customers"
            />
          ) : undefined
        }
      >
        {content}
      </DataTableCard>

      <DeleteDialog
        open={changing !== null}
        onOpenChange={(open) => !open && setChanging(null)}
        title={`${deactivating ? "Deactivate" : "Activate"} ${changing?.name ?? ""}?`}
        description={
          deactivating
            ? "They will be signed out and can't sign in or place orders until reactivated."
            : "They will be able to sign in and place orders again."
        }
        confirmLabel={deactivating ? "Deactivate" : "Activate"}
        confirmVariant={deactivating ? "destructive" : "default"}
        isLoading={updateStatus.isPending}
        onConfirm={() =>
          changing &&
          updateStatus.mutate({ id: changing.id, payload: { isActive: !changing.isActive } }, { onSuccess: () => setChanging(null) })
        }
      />
    </AdminPage>
  );
}

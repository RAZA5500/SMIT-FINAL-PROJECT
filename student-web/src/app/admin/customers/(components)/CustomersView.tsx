"use client";

import { UserCheck, UserX } from "lucide-react";
import { useState, type ReactNode } from "react";
import AdminListPage, {
  ADMIN_FILTER_FIELD_CLASS,
  ADMIN_SEARCH_FIELD_CLASS,
  FilterIcon,
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
import { formatDate, formatDateTime, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
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

  const toolbar = (
    <>
      <SearchInput
        value={search}
        onValueChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Search by name, email or phone..."
        className="max-w-search"
        inputClassName={ADMIN_SEARCH_FIELD_CLASS}
      />
      <div className="ml-auto flex shrink-0 flex-wrap items-center gap-3">
        <FilterIcon />
        <SelectField
          id="customer-status-filter"
          options={STATUS_OPTIONS}
          value={isActive === null ? ALL : String(isActive)}
          onValueChange={(value) => {
            setIsActive(!value || value === ALL ? null : value === "true");
            setPage(1);
          }}
          className={ADMIN_FILTER_FIELD_CLASS}
        />
      </div>
    </>
  );

  let content: ReactNode;
  if (isLoading) {
    content = <TableSkeleton columns={7} />;
  } else if (isError) {
    content = <ErrorState title="Couldn't load customers" message={error.message} onRetry={() => void refetch()} />;
  } else if (!data?.data.length) {
    content = (
      <EmptyState
        title="No customers found"
        message={debouncedSearch || isActive !== null ? "Try different filters." : "Customers appear here after they register."}
      />
    );
  } else {
    content = (
      <Table className={cn("min-w-215", isFetching && "opacity-60 transition-opacity")}>
        <TableHeader>
          <TableRow className="border-gray-200">
            <TableHead className={TH_CLASS}>Customer</TableHead>
            <TableHead className={TH_CLASS}>Phone</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Orders</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Total spent</TableHead>
            <TableHead className={TH_CLASS}>Last login</TableHead>
            <TableHead className={TH_CLASS}>Joined</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Status</TableHead>
            <TableHead className={TH_CENTER_CLASS}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data.map((customer) => (
            <TableRow key={customer.id} className={TR_STATIC_CLASS}>
              <TableCell className={cn(TD_CLASS, "max-w-56")}>
                <p className="truncate font-semibold text-body-text">{customer.name}</p>
                <p className="truncate text-xs text-gray-500">{customer.email}</p>
              </TableCell>
              <TableCell className={cn(TD_CLASS, "text-gray-500")}>{customer.phone ?? "—"}</TableCell>
              <TableCell className={cn(TD_CLASS, "text-center")}>{customer.totalOrders}</TableCell>
              <TableCell className={cn(TD_CLASS, "text-center font-semibold text-body-text")}>
                {formatMoney(customer.totalSpent)}
              </TableCell>
              <TableCell className={cn(TD_CLASS, "text-gray-500")}>{formatDateTime(customer.lastLoginAt)}</TableCell>
              <TableCell className={cn(TD_CLASS, "text-gray-500")}>{formatDate(customer.createdAt)}</TableCell>
              <TableCell className={cn(TD_CLASS, "text-center")}>
                <StatusBadge status={customer.isActive ? "ACTIVE" : "INACTIVE"} />
              </TableCell>
              <TableCell className={TD_CLASS}>
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
    <>
      <AdminListPage
        toolbar={toolbar}
        responsiveToolbar
        total={data?.meta.total ?? 0}
        page={data?.meta.currentPage ?? page}
        pageSize={data?.meta.limit ?? PAGE_SIZE}
        onPageChange={setPage}
        noun="customers"
      >
        {content}
      </AdminListPage>

      <ConfirmDialog
        open={changing !== null}
        onOpenChange={(open) => !open && setChanging(null)}
        title={`${deactivating ? "Deactivate" : "Activate"} ${changing?.name ?? ""}?`}
        description={
          deactivating
            ? "They will be signed out and can't sign in or place orders until reactivated."
            : "They will be able to sign in and place orders again."
        }
        confirmLabel={deactivating ? "Deactivate" : "Activate"}
        isPending={updateStatus.isPending}
        onConfirm={() =>
          changing &&
          updateStatus.mutate(
            { id: changing.id, payload: { isActive: !changing.isActive } },
            { onSuccess: () => setChanging(null) },
          )
        }
      />
    </>
  );
}

"use client";

import { Home, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDeleteAddress, useSetDefaultAddress } from "@/services/addresses/mutations";
import { useGetAddresses } from "@/services/addresses/queries";
import type { IAddress } from "@/services/addresses/types";
import { AddressFormDialog } from "./AddressFormDialog";

const PAGE_SIZE = 10;

function AddressCard({
  address,
  settingDefault,
  onEdit,
  onSetDefault,
  onDelete,
}: {
  address: IAddress;
  settingDefault: boolean;
  onEdit: () => void;
  onSetDefault: () => void;
  onDelete: () => void;
}) {
  return (
    <li
      className={cn(
        "flex flex-col gap-5 rounded-3xl bg-card p-5 shadow-soft ring-1 sm:p-6",
        address.isDefault ? "ring-2 ring-primary" : "ring-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-2xl",
            address.isDefault ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {address.isDefault ? <Home className="size-5" aria-hidden="true" /> : <MapPin className="size-5" aria-hidden="true" />}
        </span>
        {address.isDefault && (
          <span className="rounded-full bg-lime px-2.5 py-1 text-xs font-semibold text-lime-foreground">Default</span>
        )}
      </div>
      <address className="flex flex-1 flex-col text-sm not-italic">
        <span className="font-semibold text-foreground">{address.addressLine}</span>
        <span className="text-muted-foreground">
          {address.city}, {address.county}
        </span>
        <span className="font-medium tracking-wide text-muted-foreground uppercase">{address.postcode}</span>
      </address>
      <div className="flex flex-wrap gap-2 border-t pt-4">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil aria-hidden="true" />
          Edit
        </Button>
        {!address.isDefault && (
          <Button variant="outline" size="sm" disabled={settingDefault} onClick={onSetDefault}>
            <Star aria-hidden="true" />
            Set as default
          </Button>
        )}
        <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground hover:text-destructive" onClick={onDelete}>
          <Trash2 aria-hidden="true" />
          Delete
        </Button>
      </div>
    </li>
  );
}

export function AddressesView() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, error, refetch } = useGetAddresses({ page, limit: PAGE_SIZE });
  const setDefault = useSetDefaultAddress();
  const deleteAddress = useDeleteAddress();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<IAddress | null>(null);
  const [deleting, setDeleting] = useState<IAddress | null>(null);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  let content: ReactNode;
  if (isLoading) {
    content = (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading" aria-busy="true">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-56 w-full rounded-3xl" />
        ))}
      </div>
    );
  } else if (isError) {
    content = <ErrorState title="Couldn't load your addresses" message={error.message} onRetry={() => void refetch()} />;
  } else if (!data?.data.length) {
    content = (
      <div className="rounded-3xl bg-card shadow-soft ring-1 ring-border">
        <EmptyState
          icon={<MapPin aria-hidden="true" />}
          title="No saved addresses"
          message="Save an address to check out faster next time."
          action={
            <Button size="lg" onClick={openCreate}>
              <Plus aria-hidden="true" />
              Add address
            </Button>
          }
        />
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col gap-6">
        <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", isFetching && "opacity-60 transition-opacity")}>
          {data.data.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              settingDefault={setDefault.isPending}
              onEdit={() => {
                setEditing(address);
                setFormOpen(true);
              }}
              onSetDefault={() => setDefault.mutate(address.id)}
              onDelete={() => setDeleting(address)}
            />
          ))}
          <li>
            <button
              type="button"
              onClick={openCreate}
              className="flex size-full min-h-56 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-border text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:bg-brand-soft/40 hover:text-brand"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-muted">
                <Plus className="size-5" aria-hidden="true" />
              </span>
              Add a new address
            </button>
          </li>
        </ul>
        <Pagination
          currentPage={data.meta.currentPage}
          totalPages={data.meta.pages}
          total={data.meta.total}
          limit={data.meta.limit}
          onPageChange={setPage}
          itemLabel="addresses"
        />
      </div>
    );
  }

  return (
    <CustomerPage
      eyebrow="My account"
      title="Addresses"
      description="Manage where we deliver. Your default address is pre-selected at checkout."
      breadcrumbs={[{ label: "Addresses" }]}
      actions={
        <Button onClick={openCreate}>
          <Plus aria-hidden="true" />
          Add address
        </Button>
      }
    >
      {content}

      <AddressFormDialog open={formOpen} onOpenChange={setFormOpen} address={editing} />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this address?"
        description={
          deleting?.isDefault
            ? "This is your default address — your most recent other address will become the default."
            : "It will be removed from your address book."
        }
        confirmLabel="Delete address"
        destructive
        isPending={deleteAddress.isPending}
        onConfirm={() => deleting && deleteAddress.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
      >
        {deleting && (
          <p className="flex items-start gap-2 rounded-xl bg-muted px-3.5 py-3 text-sm">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            {deleting.addressLine}, {deleting.city}, {deleting.postcode}
          </p>
        )}
      </ConfirmDialog>
    </CustomerPage>
  );
}

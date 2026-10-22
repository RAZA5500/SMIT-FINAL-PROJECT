"use client";

import { MapPin, Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { ACCOUNT_PAGE_SIZE } from "@/constants/filters";
import { cn } from "@/lib/utils";
import { useDeleteAddress, useSetDefaultAddress } from "@/services/addresses/mutations";
import { useGetAddresses } from "@/services/addresses/queries";
import type { IAddress } from "@/services/addresses/types";
import { AddressCard } from "./AddressCard";
import { AddressFormDialog } from "./AddressFormDialog";

export function AddressesView() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, error, refetch } = useGetAddresses({ page, limit: ACCOUNT_PAGE_SIZE });
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
      <div aria-label="Loading" aria-busy="true" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-60 w-full rounded-15" />
        ))}
      </div>
    );
  } else if (isError) {
    content = <ErrorState title="Couldn't load your addresses" message={error.message} onRetry={() => void refetch()} />;
  } else if (!data?.data.length) {
    content = (
      <EmptyState
        icon={<MapPin aria-hidden="true" />}
        title="No saved addresses"
        message="Save an address to check out faster next time."
        action={
          <Button variant="cta" size="lg" onClick={openCreate}>
            <Plus aria-hidden="true" />
            Add address
          </Button>
        }
      />
    );
  } else {
    content = (
      <div className="flex flex-col gap-6">
        <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", isFetching && "opacity-60 transition-opacity")}>
          {data.data.map((address) => (
            <li key={address.id}>
              <AddressCard
                address={address}
                settingDefault={setDefault.isPending}
                onEdit={() => {
                  setEditing(address);
                  setFormOpen(true);
                }}
                onSetDefault={() => setDefault.mutate(address.id)}
                onDelete={() => setDeleting(address)}
              />
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={openCreate}
              className="flex size-full min-h-60 flex-col items-center justify-center gap-3 rounded-15 border-2 border-dashed border-input bg-card/60 text-muted-foreground transition-colors outline-none hover:border-primary hover:text-brand-green focus-visible:ring-3 focus-visible:ring-ring/35"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-muted [&_svg]:size-5">
                <Plus aria-hidden="true" />
              </span>
              <span className="font-medium">Add a new address</span>
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
        <Button variant="cta" onClick={openCreate}>
          <Plus aria-hidden="true" />
          Add address
        </Button>
      }
    >
      {content}

      <AddressFormDialog open={formOpen} onOpenChange={setFormOpen} address={editing} />
      <DeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this address?"
        description={
          deleting?.isDefault
            ? "This is your default address — your most recent other address will become the default."
            : "It will be removed from your address book."
        }
        confirmLabel="Delete address"
        isLoading={deleteAddress.isPending}
        onConfirm={() => deleting && deleteAddress.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
      />
    </CustomerPage>
  );
}

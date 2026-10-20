"use client";

import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Pagination } from "@/components/shared/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useDeleteAddress, useSetDefaultAddress } from "@/services/addresses/mutations";
import { useGetAddresses } from "@/services/addresses/queries";
import type { IAddress } from "@/services/addresses/types";
import { AddressFormDialog } from "./AddressFormDialog";

const PAGE_SIZE = 10;

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
      <div className="grid gap-4 sm:grid-cols-2" aria-label="Loading" aria-busy="true">
        {Array.from({ length: 2 }, (_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-xl" />
        ))}
      </div>
    );
  } else if (isError) {
    content = <ErrorState title="Couldn't load your addresses" message={error.message} onRetry={() => void refetch()} />;
  } else if (!data?.data.length) {
    content = (
      <EmptyState
        icon={<MapPin className="size-6" aria-hidden="true" />}
        title="No saved addresses"
        message="Save an address to check out faster."
        action={
          <Button variant="brand" size="xl" onClick={openCreate}>
            <Plus aria-hidden="true" />
            Add address
          </Button>
        }
      />
    );
  } else {
    content = (
      <div className="flex flex-col gap-6">
        <div className={cn("grid gap-4 sm:grid-cols-2", isFetching && "opacity-60 transition-opacity")}>
          {data.data.map((address) => (
            <Card key={address.id} className={cn(address.isDefault && "ring-2 ring-brand-green")}>
              <CardContent className="flex h-full flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="flex items-start gap-2 text-sm text-gray-700">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-brand-green" aria-hidden="true" />
                    <span>
                      {address.addressLine}
                      <span className="block">
                        {address.city}, {address.county}
                      </span>
                      <span className="block">{address.postcode}</span>
                    </span>
                  </p>
                  {address.isDefault && <Badge className="bg-brand-green text-white">Default</Badge>}
                </div>
                <div className="mt-auto flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditing(address);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil aria-hidden="true" />
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={setDefault.isPending}
                      onClick={() => setDefault.mutate(address.id)}
                    >
                      <Star aria-hidden="true" />
                      Set as default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => setDeleting(address)}
                  >
                    <Trash2 aria-hidden="true" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
      title="Addresses"
      description="Manage the addresses you use for delivery."
      actions={
        <Button variant="brand" size="xl" onClick={openCreate}>
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
          <p className="rounded-10 bg-gray-50 px-3 py-2 text-sm text-gray-700">
            {deleting.addressLine}, {deleting.city}, {deleting.postcode}
          </p>
        )}
      </ConfirmDialog>
    </CustomerPage>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CheckboxField } from "@/components/shared/CheckboxField";
import { InputField } from "@/components/shared/InputField";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { scrollToFirstError } from "@/lib/forms";
import { addressFormSchema, type AddressBookFormValues } from "@/modules/zod/address.model";
import { useCreateAddress, useUpdateAddress } from "@/services/addresses/mutations";
import type { IAddress } from "@/services/addresses/types";

const FORM_ID = "address-form";

interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Diya ho to edit, warna naya address */
  address?: IAddress | null;
}

export function AddressFormDialog({ open, onOpenChange, address }: AddressFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {/* Har dafa khulne par naya form (unmount on close) */}
        <AddressForm address={address ?? null} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function AddressForm({ address, onDone }: { address: IAddress | null; onDone: () => void }) {
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const isPending = createAddress.isPending || updateAddress.isPending;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressBookFormValues>({
    resolver: zodResolver(addressFormSchema),
    mode: "onChange",
    defaultValues: {
      addressLine: address?.addressLine ?? "",
      city: address?.city ?? "",
      county: address?.county ?? "",
      postcode: address?.postcode ?? "",
      isDefault: false,
    },
  });

  const onSubmit = ({ isDefault, ...fields }: AddressBookFormValues) => {
    if (address) {
      // Default sirf "Set as default" se badalta hai (PATCH mein isDefault nahi)
      updateAddress.mutate({ id: address.id, payload: fields }, { onSuccess: onDone });
    } else {
      createAddress.mutate({ ...fields, isDefault }, { onSuccess: onDone });
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-modal-title">{address ? "Edit address" : "Add a new address"}</DialogTitle>
        <DialogDescription>Saved addresses can be chosen at checkout.</DialogDescription>
      </DialogHeader>

      <form
        id={FORM_ID}
        noValidate
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={handleSubmit(onSubmit, () => scrollToFirstError(FORM_ID))}
      >
        <InputField
          id="addressLine"
          label="Address"
          required
          autoComplete="street-address"
          containerClassName="sm:col-span-2"
          error={errors.addressLine?.message}
          {...register("addressLine")}
        />
        <InputField
          id="city"
          label="City"
          required
          autoComplete="address-level2"
          error={errors.city?.message}
          {...register("city")}
        />
        <InputField
          id="county"
          label="County"
          required
          autoComplete="address-level1"
          error={errors.county?.message}
          {...register("county")}
        />
        <InputField
          id="postcode"
          label="Postcode"
          required
          autoComplete="postal-code"
          error={errors.postcode?.message}
          {...register("postcode")}
        />
        {!address && (
          <Controller
            control={control}
            name="isDefault"
            render={({ field }) => (
              <CheckboxField
                id="isDefault"
                label="Make this my default address"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="self-end sm:col-span-2"
              />
            )}
          />
        )}
      </form>

      <DialogFooter>
        <Button variant="outline" onClick={onDone} disabled={isPending}>
          Cancel
        </Button>
        <LoadingButton type="submit" form={FORM_ID} variant="brand" isLoading={isPending}>
          {address ? "Save changes" : "Save address"}
        </LoadingButton>
      </DialogFooter>
    </>
  );
}

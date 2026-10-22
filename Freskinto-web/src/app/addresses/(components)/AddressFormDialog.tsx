"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { AppModal } from "@/components/shared/AppModal";
import { CheckboxField } from "@/components/shared/CheckboxField";
import { InputField } from "@/components/shared/InputField";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { scrollToFirstError } from "@/lib/utils";
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
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const isPending = createAddress.isPending || updateAddress.isPending;

  const onSubmit = ({ isDefault, ...fields }: AddressBookFormValues) => {
    const done = { onSuccess: () => onOpenChange(false) };
    if (address) {
      // Default sirf "Set as default" se badalta hai (PATCH mein isDefault nahi)
      updateAddress.mutate({ id: address.id, payload: fields }, done);
    } else {
      createAddress.mutate({ ...fields, isDefault }, done);
    }
  };

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title={address ? "Edit address" : "Add a new address"}
      description="Saved addresses appear at checkout for one-tap delivery."
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <LoadingButton type="submit" form={FORM_ID} variant="cta" isLoading={isPending}>
            {address ? "Save changes" : "Save address"}
          </LoadingButton>
        </>
      }
    >
      {/* Har dafa khulne par naya form (unmount on close) */}
      <AddressForm address={address ?? null} onSubmit={onSubmit} />
    </AppModal>
  );
}

function AddressForm({ address, onSubmit }: { address: IAddress | null; onSubmit: (values: AddressBookFormValues) => void }) {
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

  return (
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
        placeholder="House number and street"
        containerClassName="sm:col-span-2"
        error={errors.addressLine?.message}
        {...register("addressLine")}
      />
      <InputField
        id="city"
        label="Town / city"
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
        placeholder="e.g. E1 6AN"
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
              description="Pre-selected at checkout"
              checked={field.value}
              onCheckedChange={field.onChange}
              className="sm:col-span-2"
            />
          )}
        />
      )}
    </form>
  );
}

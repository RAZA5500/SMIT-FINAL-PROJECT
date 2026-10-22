"use client";

import { Home, MapPin, Plus } from "lucide-react";
import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { ChoiceCards } from "@/components/shared/ChoiceCards";
import { FieldMessage } from "@/components/shared/FieldMessage";
import { InputField } from "@/components/shared/InputField";
import type { CheckoutFormInput } from "@/modules/zod/checkout.model";
import type { IAddress } from "@/services/addresses/types";

export type AddressMode = "saved" | "new";
const NEW_ADDRESS = "__new__";

interface AddressSelectorProps {
  addresses: IAddress[];
  mode: AddressMode;
  onModeChange: (mode: AddressMode) => void;
  control: Control<CheckoutFormInput>;
  register: UseFormRegister<CheckoutFormInput>;
  errors: FieldErrors<CheckoutFormInput>;
}

/**
 * Saved addresses radio cards + "new address". New mode mein `addressId` khali
 * (schema: exactly ek — saved ya inline), aur inline fields sirf tab register hote hain.
 */
export function AddressSelector({ addresses, mode, onModeChange, control, register, errors }: AddressSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      {addresses.length > 0 && (
        <Controller
          control={control}
          name="addressId"
          render={({ field }) => (
            <ChoiceCards
              id="address"
              aria-label="Delivery address"
              invalid={Boolean(errors.addressId)}
              aria-describedby={errors.addressId ? "addressId-error" : undefined}
              value={mode === "new" ? NEW_ADDRESS : ((field.value as string | undefined) ?? "")}
              onValueChange={(value) => {
                if (value === NEW_ADDRESS) {
                  onModeChange("new");
                  field.onChange("");
                } else {
                  onModeChange("saved");
                  field.onChange(value);
                }
              }}
              options={[
                ...addresses.map((address) => ({
                  value: address.id,
                  icon: address.isDefault ? <Home aria-hidden="true" /> : <MapPin aria-hidden="true" />,
                  title: address.addressLine,
                  description: `${address.city}, ${address.county} · ${address.postcode}`,
                  aside: address.isDefault && <Badge variant="tag">Default</Badge>,
                })),
                {
                  value: NEW_ADDRESS,
                  icon: <Plus aria-hidden="true" />,
                  title: "Use a new address",
                  description: "Deliver somewhere else this time",
                },
              ]}
            />
          )}
        />
      )}
      {mode === "saved" && <FieldMessage id="addressId" error={errors.addressId?.message} />}

      {mode === "new" && (
        <div className="grid gap-4 rounded-2xl bg-muted/70 p-4 sm:grid-cols-2 sm:p-5">
          <InputField
            id="shippingAddress.addressLine"
            label="Address"
            required
            autoComplete="street-address"
            placeholder="House number and street"
            containerClassName="sm:col-span-2"
            error={errors.shippingAddress?.addressLine?.message ?? errors.addressId?.message}
            {...register("shippingAddress.addressLine")}
          />
          <InputField
            id="shippingAddress.city"
            label="Town / city"
            required
            autoComplete="address-level2"
            error={errors.shippingAddress?.city?.message}
            {...register("shippingAddress.city")}
          />
          <InputField
            id="shippingAddress.county"
            label="County"
            required
            autoComplete="address-level1"
            error={errors.shippingAddress?.county?.message}
            {...register("shippingAddress.county")}
          />
          <InputField
            id="shippingAddress.postcode"
            label="Postcode"
            required
            autoComplete="postal-code"
            placeholder="e.g. E1 6AN"
            error={errors.shippingAddress?.postcode?.message}
            {...register("shippingAddress.postcode")}
          />
        </div>
      )}
    </div>
  );
}

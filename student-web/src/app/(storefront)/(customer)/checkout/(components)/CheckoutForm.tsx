"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Store, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { InputField } from "@/components/shared/InputField";
import { SelectField } from "@/components/shared/SelectField";
import { TextAreaField } from "@/components/shared/TextAreaField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DELIVERY_TYPES, type DeliveryType } from "@/constants/enums";
import { DELIVERY_TYPE_LABELS } from "@/constants/labels";
import { saveOrderIntent } from "@/lib/checkout-intent";
import { scrollToFirstError } from "@/lib/forms";
import { customerRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import {
  checkoutSchema,
  type CheckoutFormInput,
  type CheckoutFormValues,
} from "@/modules/zod/checkout.model";
import type { IAddress } from "@/services/addresses/types";
import type { ICreateOrderPayload } from "@/services/orders/types";

export const CHECKOUT_FORM_ID = "checkout-form";

type AddressMode = "saved" | "new";

const DELIVERY_ICONS: Record<DeliveryType, typeof Truck> = { DELIVERY: Truck, PICKUP: Store };
const DELIVERY_HINTS: Record<DeliveryType, string> = {
  DELIVERY: "We deliver to your address",
  PICKUP: "Collect from our store",
};

function formatAddress(address: IAddress): string {
  return `${address.addressLine}, ${address.city}, ${address.postcode}${address.isDefault ? " (Default)" : ""}`;
}

/** `<input type="datetime-local">` ki min value (local time, bina seconds) */
function toDateTimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Form values → API payload: sirf delivery type ke mutabiq fields (FLOW-MD 08 §10) */
function toOrderPayload(values: CheckoutFormValues): ICreateOrderPayload {
  const base = { deliveryType: values.deliveryType, customerNotes: values.customerNotes };
  if (values.deliveryType === "PICKUP") {
    return { ...base, pickupScheduledAt: new Date(values.pickupScheduledAt!).toISOString() };
  }
  return values.addressId
    ? { ...base, addressId: values.addressId }
    : { ...base, shippingAddress: values.shippingAddress };
}

export function CheckoutForm({ addresses }: { addresses: IAddress[] }) {
  const router = useRouter();
  const defaultAddressId = (addresses.find((a) => a.isDefault) ?? addresses[0])?.id;
  const [addressMode, setAddressMode] = useState<AddressMode>(defaultAddressId ? "saved" : "new");
  const [minPickup] = useState(() => toDateTimeLocal(new Date()));

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormInput, unknown, CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    // Chhupe hue fields (e.g. PICKUP par address) values se nikal jate hain
    shouldUnregister: true,
    defaultValues: { deliveryType: "DELIVERY", addressId: defaultAddressId, customerNotes: "" },
  });

  const deliveryType = useWatch({ control, name: "deliveryType" });

  const onSubmit = (values: CheckoutFormValues) => {
    saveOrderIntent(toOrderPayload(values));
    router.push(customerRoutes.checkoutPayment);
  };

  return (
    <form
      id={CHECKOUT_FORM_ID}
      noValidate
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit, () => scrollToFirstError(CHECKOUT_FORM_ID))}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">How would you like your order?</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            control={control}
            name="deliveryType"
            render={({ field }) => (
              <RadioGroup
                aria-label="Delivery type"
                value={field.value}
                onValueChange={(value) => field.onChange(value as DeliveryType)}
                className="grid gap-3 sm:grid-cols-2"
              >
                {DELIVERY_TYPES.map((type) => {
                  const Icon = DELIVERY_ICONS[type];
                  return (
                    <label
                      key={type}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-15 border p-4 transition-colors",
                        field.value === type ? "border-brand-green bg-accent" : "border-gray-200 hover:border-gray-300",
                      )}
                    >
                      <RadioGroupItem value={type} />
                      <Icon className="size-5 text-brand-green" aria-hidden="true" />
                      <span className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{DELIVERY_TYPE_LABELS[type]}</span>
                        <span className="text-xs text-gray-500">{DELIVERY_HINTS[type]}</span>
                      </span>
                    </label>
                  );
                })}
              </RadioGroup>
            )}
          />
        </CardContent>
      </Card>

      {deliveryType === "DELIVERY" ? (
        <Card>
          <CardHeader className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-base font-semibold text-gray-900">Delivery address</CardTitle>
            <Link href={customerRoutes.addresses} className="text-sm font-medium text-brand-green hover:underline">
              Manage addresses
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {addresses.length > 0 && (
              <RadioGroup
                aria-label="Address source"
                value={addressMode}
                onValueChange={(value) => setAddressMode(value as AddressMode)}
                className="flex flex-wrap gap-4"
              >
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <RadioGroupItem value="saved" />
                  Use a saved address
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <RadioGroupItem value="new" />
                  Enter a new address
                </label>
              </RadioGroup>
            )}

            {addressMode === "saved" ? (
              <Controller
                control={control}
                name="addressId"
                render={({ field }) => (
                  <SelectField
                    id="addressId"
                    label="Saved address"
                    required
                    placeholder="Choose an address"
                    options={addresses.map((address) => ({ value: address.id, label: formatAddress(address) }))}
                    value={field.value as string | undefined}
                    onValueChange={(value) => field.onChange(value ?? "")}
                    error={errors.addressId?.message}
                  />
                )}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  id="shippingAddress.addressLine"
                  label="Address"
                  required
                  autoComplete="street-address"
                  leftIcon={<MapPin className="size-4" />}
                  containerClassName="sm:col-span-2"
                  error={errors.shippingAddress?.addressLine?.message ?? errors.addressId?.message}
                  {...register("shippingAddress.addressLine")}
                />
                <InputField
                  id="shippingAddress.city"
                  label="City"
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
                  error={errors.shippingAddress?.postcode?.message}
                  {...register("shippingAddress.postcode")}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">Pickup time</CardTitle>
          </CardHeader>
          <CardContent>
            <InputField
              id="pickupScheduledAt"
              type="datetime-local"
              label="When will you collect your order?"
              required
              min={minPickup}
              containerClassName="sm:max-w-xs"
              error={errors.pickupScheduledAt?.message}
              {...register("pickupScheduledAt")}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">Order notes</CardTitle>
        </CardHeader>
        <CardContent>
          <TextAreaField
            id="customerNotes"
            label="Anything we should know? (optional)"
            placeholder="e.g. Leave the parcel with the neighbour"
            maxLength={500}
            error={errors.customerNotes?.message}
            {...register("customerNotes")}
          />
        </CardContent>
      </Card>
    </form>
  );
}

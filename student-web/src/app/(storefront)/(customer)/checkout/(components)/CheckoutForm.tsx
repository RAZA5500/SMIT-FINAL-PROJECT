"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Store, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { ChoiceCard } from "@/components/customer/checkout/ChoiceCard";
import { TextAreaField } from "@/components/shared/TextAreaField";
import { RadioGroup } from "@/components/ui/radio-group";
import type { DeliveryType } from "@/constants/enums";
import { saveOrderIntent } from "@/lib/checkout-intent";
import { scrollToFirstError } from "@/lib/forms";
import { customerRoutes } from "@/lib/routes/routes";
import { checkoutSchema, type CheckoutFormInput, type CheckoutFormValues } from "@/modules/zod/checkout.model";
import type { IAddress } from "@/services/addresses/types";
import type { ICreateOrderPayload } from "@/services/orders/types";
import { AddressPicker, type AddressMode } from "./AddressPicker";
import { PickupTimeField } from "./PickupTimeField";

export const CHECKOUT_FORM_ID = "checkout-form";

const DELIVERY_OPTIONS: { type: DeliveryType; title: string; description: string; icon: ReactNode }[] = [
  { type: "DELIVERY", title: "Home delivery", description: "Delivered to your door", icon: <Truck aria-hidden="true" /> },
  { type: "PICKUP", title: "Click & collect", description: "Pick a time that suits you", icon: <Store aria-hidden="true" /> },
];

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

function FormSection({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-card p-5 shadow-soft ring-1 ring-border sm:p-6">
      <h2 className="flex items-center gap-3 text-lg font-bold">
        <span className="flex size-7 items-center justify-center rounded-full bg-foreground font-sans text-xs text-background">
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function CheckoutForm({ addresses }: { addresses: IAddress[] }) {
  const router = useRouter();
  const defaultAddressId = (addresses.find((a) => a.isDefault) ?? addresses[0])?.id;
  const [addressMode, setAddressMode] = useState<AddressMode>(defaultAddressId ? "saved" : "new");

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormInput, unknown, CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    // Chhupe hue fields (e.g. PICKUP par address) values se nikal jate hain
    shouldUnregister: true,
    defaultValues: { deliveryType: "DELIVERY", addressId: defaultAddressId, customerNotes: "" },
  });

  const deliveryType = useWatch({ control, name: "deliveryType" });
  const pickupAt = useWatch({ control, name: "pickupScheduledAt" }) as string | undefined;

  const onSubmit = (values: CheckoutFormValues) => {
    saveOrderIntent(toOrderPayload(values));
    router.push(customerRoutes.checkoutPayment);
  };

  return (
    <form
      id={CHECKOUT_FORM_ID}
      noValidate
      className="flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit, () => scrollToFirstError(CHECKOUT_FORM_ID))}
    >
      <FormSection step={1} title="How would you like your order?">
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
              {DELIVERY_OPTIONS.map((option) => (
                <ChoiceCard
                  key={option.type}
                  value={option.type}
                  icon={option.icon}
                  title={option.title}
                  description={option.description}
                  aside={
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">Free</span>
                  }
                />
              ))}
            </RadioGroup>
          )}
        />
      </FormSection>

      {deliveryType === "DELIVERY" ? (
        <FormSection step={2} title="Delivery address">
          <AddressPicker
            addresses={addresses}
            mode={addressMode}
            onModeChange={setAddressMode}
            control={control}
            register={register}
            errors={errors}
          />
        </FormSection>
      ) : (
        <FormSection step={2} title="Collection time">
          <PickupTimeField
            registration={register("pickupScheduledAt")}
            value={pickupAt}
            onPick={(value) => setValue("pickupScheduledAt", value, { shouldValidate: true, shouldDirty: true })}
            error={errors.pickupScheduledAt?.message}
          />
        </FormSection>
      )}

      <FormSection step={3} title="Anything we should know?">
        <TextAreaField
          id="customerNotes"
          label="Order notes (optional)"
          placeholder="e.g. Please leave the parcel with the neighbour at no. 12"
          maxLength={500}
          error={errors.customerNotes?.message}
          {...register("customerNotes")}
        />
      </FormSection>
    </form>
  );
}

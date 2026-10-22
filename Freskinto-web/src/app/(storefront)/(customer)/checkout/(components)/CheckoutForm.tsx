"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Store, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flex } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/typography";
import { ChoiceCards } from "@/components/shared/ChoiceCards";
import { TextAreaField } from "@/components/shared/TextAreaField";
import type { DeliveryType } from "@/constants/enums";
import { saveOrderIntent } from "@/lib/checkout-intent";
import { scrollToFirstError } from "@/lib/forms";
import { customerRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
import { checkoutSchema, type CheckoutFormInput, type CheckoutFormValues } from "@/modules/zod/checkout.model";
import type { IAddress } from "@/services/addresses/types";
import type { ICreateOrderPayload } from "@/services/orders/types";
import { AddressPicker, type AddressMode } from "./AddressPicker";
import { PickupScheduler } from "./PickupScheduler";

export const CHECKOUT_FORM_ID = "checkout-form";

const DELIVERY_OPTIONS = [
  { value: "DELIVERY" as const, title: "Home delivery", description: "Delivered to your door", icon: <Truck aria-hidden="true" /> },
  { value: "PICKUP" as const, title: "Click & collect", description: "Pick a time that suits you", icon: <Store aria-hidden="true" /> },
].map((option) => ({ ...option, aside: <Badge variant="outline" className={cn("text-brand")}>Free</Badge> }));

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
    <Card>
      <CardHeader>
        <CardTitle>
          <Flex as="span" align="center" gap="3">
            <Text
              as="span"
              variant="code"
              className={cn("flex size-8 items-center justify-center rounded-full border border-dashed border-input text-sm")}
            >
              0{step}
            </Text>
            {title}
          </Flex>
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
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
    <Form id={CHECKOUT_FORM_ID} className={cn("gap-5")} onSubmit={handleSubmit(onSubmit, () => scrollToFirstError(CHECKOUT_FORM_ID))}>
      <FormSection step={1} title="How would you like your order?">
        <Controller
          control={control}
          name="deliveryType"
          render={({ field }) => (
            <ChoiceCards
              id="delivery-type"
              aria-label="Delivery type"
              options={DELIVERY_OPTIONS}
              value={field.value}
              onValueChange={(value) => field.onChange(value as DeliveryType)}
            />
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
          <Controller
            control={control}
            name="pickupScheduledAt"
            render={({ field }) => (
              <PickupScheduler
                value={field.value as string | undefined}
                onChange={field.onChange}
                error={errors.pickupScheduledAt?.message}
              />
            )}
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
    </Form>
  );
}

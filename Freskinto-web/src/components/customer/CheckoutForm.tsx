"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, ClipboardCheck, NotebookPen, Store, Truck, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Controller, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Grid } from "@/components/ui/grid";
import { Heading, Text } from "@/components/ui/typography";
import { ChoiceCards } from "@/components/shared/ChoiceCards";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { TextAreaField } from "@/components/shared/TextAreaField";
import type { DeliveryType } from "@/constants/enums";
import { useTabbedForm } from "@/hooks/useTabbedForm";
import { saveOrderIntent } from "@/lib/checkout-intent";
import { customerRoutes } from "@/lib/routes/routes";
import { cn, scrollToFirstError } from "@/lib/utils";
import {
  CHECKOUT_TABS,
  checkoutSchema,
  TAB_FIELDS,
  type CheckoutFormInput,
  type CheckoutFormValues,
  type CheckoutTab,
} from "@/modules/zod/checkout.model";
import type { IAddress } from "@/services/addresses/types";
import type { ICreateOrderPayload } from "@/services/orders/types";
import { AddressSelector, type AddressMode } from "./checkout/AddressSelector";
import { OrderReview } from "./checkout/OrderReview";
import { PickupScheduler } from "./checkout/PickupScheduler";

export const CHECKOUT_FORM_ID = "checkout-form";

const TAB_META: Record<CheckoutTab, { label: string; icon: LucideIcon }> = {
  delivery: { label: "Delivery", icon: Truck },
  notes: { label: "Notes", icon: NotebookPen },
  review: { label: "Review", icon: ClipboardCheck },
};

const DELIVERY_OPTIONS = [
  { value: "DELIVERY" as const, title: "Home delivery", description: "Delivered to your door", icon: <Truck aria-hidden="true" /> },
  { value: "PICKUP" as const, title: "Click & collect", description: "Pick a time that suits you", icon: <Store aria-hidden="true" /> },
].map((option) => ({ ...option, aside: <Badge variant="brand">Free</Badge> }));

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

function Panel({ hidden, title, children }: { hidden: boolean; title: string; children: ReactNode }) {
  return (
    <Card
      render={<Box as="section" aria-label={title} hidden={hidden} />}
      size="lg"
      className="animate-fade-up rounded-xl border"
    >
      <CardHeader>
        <CardTitle render={<Heading as="h2" size="3" />} className="text-2xl font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">{children}</CardContent>
    </Card>
  );
}

interface CheckoutFormProps {
  addresses: IAddress[];
  /** Basket mein masle hon to payment par jana band */
  blocked?: boolean;
}

/**
 * Multi-step checkout (Delivery → Notes → Review). Har tab ka `TAB_FIELDS` guard hai: aage
 * jane (button ya tab header) se pehle active tab validate hota hai. Saare panels mounted
 * rehte hain (sirf hidden) taa ke pichle tab ki values na jaayen.
 */
export function CheckoutForm({ addresses, blocked = false }: CheckoutFormProps) {
  const router = useRouter();
  const defaultAddressId = (addresses.find((a) => a.isDefault) ?? addresses[0])?.id;
  const [addressMode, setAddressMode] = useState<AddressMode>(defaultAddressId ? "saved" : "new");

  const {
    control,
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormInput, unknown, CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    // Chhupe hue fields (e.g. PICKUP par address) values se nikal jate hain
    shouldUnregister: true,
    defaultValues: { deliveryType: "DELIVERY", addressId: defaultAddressId, customerNotes: "" },
  });

  const wizard = useTabbedForm<CheckoutTab, CheckoutFormInput>({
    tabs: CHECKOUT_TABS,
    tabFields: TAB_FIELDS,
    trigger,
  });

  const watched = useWatch({ control });
  const deliveryType = watched.deliveryType as DeliveryType | undefined;

  const savedAddress = addresses.find((address) => address.id === watched.addressId);
  const inline = watched.shippingAddress;
  const addressText =
    deliveryType !== "DELIVERY"
      ? null
      : savedAddress
        ? `${savedAddress.addressLine}, ${savedAddress.city}, ${savedAddress.county}, ${savedAddress.postcode}`
        : inline?.addressLine
          ? [inline.addressLine, inline.city, inline.county, inline.postcode].filter(Boolean).join(", ")
          : null;
  const notes = typeof watched.customerNotes === "string" && watched.customerNotes.trim() ? watched.customerNotes.trim() : null;
  const pickupAt = typeof watched.pickupScheduledAt === "string" ? watched.pickupScheduledAt : null;

  const onValid = (values: CheckoutFormValues) => {
    saveOrderIntent(toOrderPayload(values));
    router.push(customerRoutes.checkoutPayment);
  };

  // Aakhri submit invalid ho to jis tab mein ghalti hai wahan wapas le jao
  const onInvalid = (formErrors: FieldErrors<CheckoutFormInput>) => {
    wizard.showFirstInvalidTab(formErrors);
    requestAnimationFrame(() => scrollToFirstError(CHECKOUT_FORM_ID));
  };

  const submit = handleSubmit(onValid, onInvalid);

  return (
    <Form
      id={CHECKOUT_FORM_ID}
      onSubmit={(event) => {
        // Beech ke tab par Enter/implicit submit payment par nahi, agle tab par le jaye
        if (!wizard.isLast) {
          event.preventDefault();
          void wizard.next();
          return;
        }
        void submit(event);
      }}
    >
      <Box as="nav" aria-label="Checkout steps">
        <Grid as="ol" cols="3" gap="2" className="sm:gap-3">
          {CHECKOUT_TABS.map((key, index) => {
            const { label, icon: Icon } = TAB_META[key];
            const active = wizard.tab === key;
            const done = index < wizard.index;
            return (
              <Box as="li" key={key}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void wizard.goTo(key)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "h-auto w-full justify-start gap-2.5 rounded-xl border p-3 text-left",
                    active && "border-primary bg-accent hover:bg-accent",
                  )}
                >
                  <Flex
                    as="span"
                    align="center"
                    justify="center"
                    className={cn(
                      "size-9 shrink-0 rounded-full [&_svg]:size-4",
                      active
                        ? "border border-primary bg-background text-primary"
                        : done
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon aria-hidden="true" />
                  </Flex>
                  <Stack as="span" className="hidden min-w-0 sm:flex">
                    <Text as="span" variant="eyebrow" tone="muted">
                      Step {index + 1}
                    </Text>
                    <Text as="span" weight="semibold">
                      {label}
                    </Text>
                  </Stack>
                  <Text as="span" weight="semibold" className="sm:hidden">
                    {label}
                  </Text>
                </Button>
              </Box>
            );
          })}
        </Grid>
      </Box>

      <Panel hidden={wizard.tab !== "delivery"} title="How would you like your order?">
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

        {deliveryType === "DELIVERY" ? (
          <AddressSelector
            addresses={addresses}
            mode={addressMode}
            onModeChange={setAddressMode}
            control={control}
            register={register}
            errors={errors}
          />
        ) : (
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
        )}
      </Panel>

      <Panel hidden={wizard.tab !== "notes"} title="Anything we should know?">
        <TextAreaField
          id="customerNotes"
          label="Order notes (optional)"
          placeholder="e.g. Please leave the parcel with the neighbour at no. 12"
          maxLength={500}
          error={errors.customerNotes?.message}
          {...register("customerNotes")}
        />
      </Panel>

      <Panel hidden={wizard.tab !== "review"} title="Review your order">
        <OrderReview
          deliveryType={deliveryType}
          addressText={addressText}
          pickupAt={pickupAt}
          notes={notes}
          onEdit={(tab) => void wizard.goTo(tab)}
        />
      </Panel>

      <Flex align="center" justify="between" gap="3">
        {wizard.isFirst ? (
          <Box />
        ) : (
          <Button type="button" variant="outline" size="lg" onClick={() => void wizard.previous()}>
            <ArrowLeft aria-hidden="true" />
            Back
          </Button>
        )}
        {wizard.isLast ? (
          <LoadingButton type="submit" size="xl" isLoading={isSubmitting} disabled={blocked}>
            Continue to payment
            <ArrowRight aria-hidden="true" />
          </LoadingButton>
        ) : (
          <Button type="button" size="xl" onClick={() => void wizard.next()}>
            Continue
            <ArrowRight aria-hidden="true" />
          </Button>
        )}
      </Flex>
    </Form>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, ClipboardCheck, NotebookPen, Store, Truck, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Controller, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <section
      hidden={hidden}
      aria-label={title}
      className="flex flex-col gap-5 rounded-15 border border-border bg-card p-5 shadow-soft sm:p-6"
    >
      <h2 className="font-heading text-fs-20 font-semibold">{title}</h2>
      {children}
    </section>
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
    <form
      id={CHECKOUT_FORM_ID}
      noValidate
      className="flex flex-col gap-6"
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
      <nav aria-label="Checkout steps">
        <ol className="grid grid-cols-3 gap-2 sm:gap-3">
          {CHECKOUT_TABS.map((key, index) => {
            const { label, icon: Icon } = TAB_META[key];
            const active = wizard.tab === key;
            const done = index < wizard.index;
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => void wizard.goTo(key)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl border bg-card p-3 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/35",
                    active ? "border-primary bg-brand-soft/60 ring-1 ring-primary" : "border-border hover:border-foreground/30",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-fs-12 font-semibold [&_svg]:size-4",
                      active || done ? "bg-brand-green text-white" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="hidden min-w-0 flex-col sm:flex">
                    <span className="text-fs-11 font-semibold tracking-wider text-muted-foreground uppercase">
                      Step {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-foreground">{label}</span>
                  </span>
                  <span className="text-sm font-semibold sm:hidden">{label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

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

      <div className="flex items-center justify-between gap-3">
        {wizard.isFirst ? (
          <span />
        ) : (
          <Button type="button" variant="outline" size="lg" onClick={() => void wizard.previous()}>
            <ArrowLeft aria-hidden="true" />
            Back
          </Button>
        )}
        {wizard.isLast ? (
          <LoadingButton type="submit" variant="cta" size="xl" isLoading={isSubmitting} disabled={blocked}>
            Continue to payment
            <ArrowRight aria-hidden="true" />
          </LoadingButton>
        ) : (
          <Button type="button" variant="cta" size="xl" onClick={() => void wizard.next()}>
            Continue
            <ArrowRight aria-hidden="true" />
          </Button>
        )}
      </div>
    </form>
  );
}

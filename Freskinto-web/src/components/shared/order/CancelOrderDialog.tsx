"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, type ReactNode } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import type * as z from "zod";
import { scrollToFirstError } from "@/lib/utils";
import { cancelOrderSchema } from "@/modules/zod/cancel-order.model";
import { SelectField } from "../SelectField";
import { StandardDestructiveModal } from "../StandardDestructiveModal";
import { TextAreaField } from "../TextAreaField";

const FORM_ID = "cancel-order-form";

type Reasons<R extends string> = readonly [R, ...R[]];

/** Reason enum widen — form types generic na hon; submit par wapas R (schema enum = `reasons`) */
type WideCancelSchema = ReturnType<typeof cancelOrderSchema<Reasons<string>>>;

interface CancelOrderDialogProps<R extends string> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  description: string;
  /** Pattern B ka Entity Summary Card (order number, total, items) */
  entitySummary: ReactNode;
  reasons: Reasons<R>;
  labels: Record<R, string>;
  isPending: boolean;
  onSubmit: (values: { reason: R; note?: string }) => void;
}

/** Customer aur admin dono ka cancel modal — Pattern B (summary + warning + checkbox) + reason/note form */
export function CancelOrderDialog<R extends string>({
  open,
  onOpenChange,
  orderNumber,
  description,
  entitySummary,
  reasons,
  labels,
  isPending,
  onSubmit,
}: CancelOrderDialogProps<R>) {
  return (
    <StandardDestructiveModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Cancel order ${orderNumber}?`}
      description={description}
      confirmLabel="Cancel order"
      isLoading={isPending}
      formId={FORM_ID}
      entitySummary={entitySummary}
    >
      <CancelOrderForm
        reasons={reasons}
        labels={labels}
        disabled={isPending}
        onSubmit={(values) => onSubmit(values as { reason: R; note?: string })}
      />
    </StandardDestructiveModal>
  );
}

function CancelOrderForm({
  reasons,
  labels,
  disabled,
  onSubmit,
}: {
  reasons: Reasons<string>;
  labels: Record<string, string>;
  disabled: boolean;
  onSubmit: (values: z.output<WideCancelSchema>) => void;
}) {
  const schema = useMemo(() => cancelOrderSchema(reasons), [reasons]);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<WideCancelSchema>, unknown, z.output<WideCancelSchema>>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { note: "" },
  });

  const isOther = useWatch({ control, name: "reason" }) === "OTHER";

  return (
    <form
      id={FORM_ID}
      noValidate
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit, () => scrollToFirstError(FORM_ID))}
    >
      <Controller
        control={control}
        name="reason"
        render={({ field }) => (
          <SelectField
            id="cancel-reason"
            label="Reason"
            required
            placeholder="Choose a reason"
            options={reasons.map((reason) => ({ value: reason, label: labels[reason] ?? reason }))}
            value={field.value}
            onValueChange={(value) => field.onChange(value ?? undefined)}
            error={errors.reason?.message}
            disabled={disabled}
          />
        )}
      />
      <TextAreaField
        id="cancel-note"
        label={isOther ? "Please tell us more" : "Note (optional)"}
        required={isOther}
        maxLength={500}
        disabled={disabled}
        error={errors.note?.message}
        {...register("note")}
      />
    </form>
  );
}

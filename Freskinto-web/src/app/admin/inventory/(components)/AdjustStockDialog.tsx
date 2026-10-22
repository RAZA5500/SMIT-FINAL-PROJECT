"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { AppModal } from "@/components/shared/AppModal";
import { InputField } from "@/components/shared/InputField";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { ProductImage } from "@/components/shared/ProductImage";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TextAreaField } from "@/components/shared/TextAreaField";
import { ADJUSTMENT_REASON_OPTIONS } from "@/constants/filters";
import { scrollToFirstError } from "@/lib/utils";
import {
  inventoryAdjustmentSchema,
  type InventoryAdjustmentFormInput,
  type InventoryAdjustmentFormValues,
} from "@/modules/zod/inventory-adjustment.model";
import { useAdjustInventory } from "@/services/inventory/mutations";
import type { IInventory } from "@/services/inventory/types";

const FORM_ID = "adjust-stock-form";

interface AdjustStockDialogProps {
  inventory: IInventory | null;
  onOpenChange: (open: boolean) => void;
}

export function AdjustStockDialog({ inventory, onOpenChange }: AdjustStockDialogProps) {
  const adjustInventory = useAdjustInventory();

  // Har call ek nayi ledger row — button pending mein disabled (FLOW-MD 11 §7)
  const onSubmit = (values: InventoryAdjustmentFormValues) => {
    if (!inventory) return;
    adjustInventory.mutate({ inventoryId: inventory.id, ...values }, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <AppModal
      open={inventory !== null}
      onOpenChange={onOpenChange}
      size="lg"
      title="Adjust stock"
      description="Use a negative quantity to remove stock and a positive one to add it."
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={adjustInventory.isPending}>
            Cancel
          </Button>
          <LoadingButton type="submit" form={FORM_ID} isLoading={adjustInventory.isPending}>
            Save adjustment
          </LoadingButton>
        </>
      }
    >
      {inventory && <AdjustStockForm inventory={inventory} onSubmit={onSubmit} />}
    </AppModal>
  );
}

function AdjustStockForm({
  inventory,
  onSubmit,
}: {
  inventory: IInventory;
  onSubmit: (values: InventoryAdjustmentFormValues) => void;
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InventoryAdjustmentFormInput, unknown, InventoryAdjustmentFormValues>({
    resolver: zodResolver(inventoryAdjustmentSchema),
    mode: "onChange",
    defaultValues: { quantity: "", note: "" },
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-3">
        <ProductImage
          name={inventory.product.name}
          sizes="44px"
          className="size-11 shrink-0 overflow-hidden rounded-lg"
          imageClassName="p-1"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="truncate font-semibold">{inventory.product.name}</p>
          <p className="font-mono text-fs-12 text-muted-foreground">{inventory.product.sku}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="numeric text-sm font-semibold">{inventory.qtyOnHand} in stock</p>
          <StatusBadge status={inventory.stockStatus} />
        </div>
      </div>

      <form
        id={FORM_ID}
        noValidate
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={handleSubmit(onSubmit, () => scrollToFirstError(FORM_ID))}
      >
        <InputField
          id="quantity"
          type="number"
          inputMode="numeric"
          label="Quantity (+/−)"
          required
          placeholder="e.g. -3 or 20"
          error={errors.quantity?.message}
          {...register("quantity")}
        />
        <Controller
          control={control}
          name="reason"
          render={({ field }) => (
            <SelectField
              id="reason"
              label="Reason"
              required
              placeholder="Choose a reason"
              options={ADJUSTMENT_REASON_OPTIONS}
              value={field.value}
              onValueChange={(value) => field.onChange(value ?? undefined)}
              error={errors.reason?.message}
            />
          )}
        />
        <TextAreaField
          id="note"
          label="Note (optional)"
          maxLength={500}
          containerClassName="sm:col-span-2"
          error={errors.note?.message}
          {...register("note")}
        />
      </form>
    </div>
  );
}

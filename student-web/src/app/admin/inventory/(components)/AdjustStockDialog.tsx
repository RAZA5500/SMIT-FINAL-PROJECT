"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { InputField } from "@/components/shared/InputField";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { ProductImage } from "@/components/shared/ProductImage";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TextAreaField } from "@/components/shared/TextAreaField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ADJUSTMENT_REASONS } from "@/constants/enums";
import { ADJUSTMENT_REASON_LABELS } from "@/constants/labels";
import { scrollToFirstError } from "@/lib/forms";
import {
  inventoryAdjustmentSchema,
  type InventoryAdjustmentFormInput,
  type InventoryAdjustmentFormValues,
} from "@/modules/zod/inventory-adjustment.model";
import { useAdjustInventory } from "@/services/inventory/mutations";
import type { IInventory } from "@/services/inventory/types";

const FORM_ID = "adjust-stock-form";

const REASON_OPTIONS = ADJUSTMENT_REASONS.map((reason) => ({ value: reason, label: ADJUSTMENT_REASON_LABELS[reason] }));

interface AdjustStockDialogProps {
  inventory: IInventory | null;
  onOpenChange: (open: boolean) => void;
}

export function AdjustStockDialog({ inventory, onOpenChange }: AdjustStockDialogProps) {
  return (
    <Dialog open={inventory !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {inventory && <AdjustStockForm inventory={inventory} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function AdjustStockForm({ inventory, onDone }: { inventory: IInventory; onDone: () => void }) {
  const adjustInventory = useAdjustInventory();
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

  // Har call ek nayi ledger row — button pending mein disabled (FLOW-MD 11 §7)
  const onSubmit = (values: InventoryAdjustmentFormValues) =>
    adjustInventory.mutate({ inventoryId: inventory.id, ...values }, { onSuccess: onDone });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Adjust stock</DialogTitle>
        <DialogDescription>Use a negative quantity to remove stock and a positive one to add it.</DialogDescription>
      </DialogHeader>

      <div className="flex items-center gap-3 rounded-xl bg-muted px-3.5 py-3 text-sm">
        <ProductImage name={inventory.product.name} sizes="44px" className="size-11 shrink-0 rounded-lg" imageClassName="p-1" />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold">{inventory.product.name}</span>
          <span className="text-xs text-muted-foreground">{inventory.product.sku}</span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1">
          <span className="numeric font-semibold">{inventory.qtyOnHand} in stock</span>
          <StatusBadge status={inventory.stockStatus} />
        </span>
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
              options={REASON_OPTIONS}
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

      <DialogFooter>
        <Button variant="outline" onClick={onDone} disabled={adjustInventory.isPending}>
          Cancel
        </Button>
        <LoadingButton type="submit" form={FORM_ID} isLoading={adjustInventory.isPending}>
          Save adjustment
        </LoadingButton>
      </DialogFooter>
    </>
  );
}

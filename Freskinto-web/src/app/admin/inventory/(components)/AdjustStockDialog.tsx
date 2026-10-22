"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Flex, Stack } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Text } from "@/components/ui/typography";
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
    <Stack gap="5">
      <Item variant="outline" className="flex-nowrap rounded-xl bg-muted/50 p-3">
        <ItemMedia className="overflow-hidden rounded-lg">
          <ProductImage name={inventory.product.name} sizes="44px" className="size-11" imageClassName="p-1" />
        </ItemMedia>
        <ItemContent className="min-w-0 gap-0.5">
          <ItemTitle className="font-semibold">{inventory.product.name}</ItemTitle>
          <ItemDescription className="font-mono text-fs-12">{inventory.product.sku}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Flex direction="col" align="end" gap="1">
            <Text weight="semibold" numeric>
              {inventory.qtyOnHand} in stock
            </Text>
            <StatusBadge status={inventory.stockStatus} />
          </Flex>
        </ItemActions>
      </Item>

      <Form
        id={FORM_ID}
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
      </Form>
    </Stack>
  );
}

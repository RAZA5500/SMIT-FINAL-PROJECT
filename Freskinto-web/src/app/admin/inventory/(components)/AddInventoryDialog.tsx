"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AppModal } from "@/components/shared/AppModal";
import { InputField } from "@/components/shared/InputField";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { SelectField } from "@/components/shared/SelectField";
import { LOOKUP_LIMIT } from "@/constants/filters";
import { scrollToFirstError } from "@/lib/utils";
import { inventorySchema, type InventoryFormInput, type InventoryFormValues } from "@/modules/zod/inventory.model";
import { useCreateInventory } from "@/services/inventory/mutations";
import { useGetAdminProducts } from "@/services/products/queries";

const FORM_ID = "add-inventory-form";

export function AddInventoryDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const createInventory = useCreateInventory();

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title="Add inventory"
      description="Set the opening stock for a product that has no inventory yet."
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={createInventory.isPending}>
            Cancel
          </Button>
          <LoadingButton type="submit" form={FORM_ID} isLoading={createInventory.isPending}>
            Add inventory
          </LoadingButton>
        </>
      }
    >
      <AddInventoryForm
        onSubmit={(values) => createInventory.mutate(values, { onSuccess: () => onOpenChange(false) })}
      />
    </AppModal>
  );
}

function AddInventoryForm({ onSubmit }: { onSubmit: (values: InventoryFormValues) => void }) {
  const { data: products, isLoading } = useGetAdminProducts({ limit: LOOKUP_LIMIT });

  // Har product ki ek hi inventory row — jin ki pehle se hai woh list mein nahi (backend 409 bhi deta hai)
  const productOptions = useMemo(
    () =>
      (products?.data ?? [])
        .filter((product) => product.inventoryId === null)
        .map((product) => ({ value: product.id, label: `${product.name} (${product.sku})` })),
    [products],
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InventoryFormInput, unknown, InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    mode: "onChange",
    defaultValues: { productId: "", qtyOnHand: "", lowStockThreshold: "" },
  });

  return (
    <Form
      id={FORM_ID}
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={handleSubmit(onSubmit, () => scrollToFirstError(FORM_ID))}
    >
      <Controller
        control={control}
        name="productId"
        render={({ field }) => (
          <SelectField
            id="productId"
            label="Product"
            required
            placeholder={
              isLoading ? "Loading products…" : productOptions.length ? "Select product" : "Every product already has inventory"
            }
            options={productOptions}
            value={field.value}
            onValueChange={(value) => field.onChange(value ?? "")}
            disabled={isLoading || productOptions.length === 0}
            error={errors.productId?.message}
            containerClassName="sm:col-span-2"
          />
        )}
      />
      <InputField
        id="qtyOnHand"
        type="number"
        inputMode="numeric"
        min="0"
        label="Opening stock"
        required
        error={errors.qtyOnHand?.message}
        {...register("qtyOnHand")}
      />
      <InputField
        id="lowStockThreshold"
        type="number"
        inputMode="numeric"
        min="0"
        label="Low-stock threshold"
        hint="Defaults to 10 if left empty"
        error={errors.lowStockThreshold?.message}
        {...register("lowStockThreshold")}
      />
    </Form>
  );
}

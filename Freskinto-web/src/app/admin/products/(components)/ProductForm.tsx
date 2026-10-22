"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Grid } from "@/components/ui/grid";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { AdminFormPage } from "@/components/admin/AdminFormPage";
import { describedBy, FieldMessage } from "@/components/shared/FieldMessage";
import { InputField } from "@/components/shared/InputField";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { RequiredMark } from "@/components/shared/RequiredMark";
import { SelectField } from "@/components/shared/SelectField";
import { SwitchField } from "@/components/shared/SwitchField";
import { ApiError } from "@/lib/api";
import { adminRoutes } from "@/lib/routes/routes";
import { cn, scrollToFirstError } from "@/lib/utils";
import {
  PRODUCT_FORM_TABS,
  productSchema,
  TAB_FIELDS,
  type ProductFormInput,
  type ProductFormTab,
  type ProductFormValues,
} from "@/modules/zod/product.model";
import { useGetAdminCategories } from "@/services/categories/queries";
import { useCreateProduct, useUpdateProduct } from "@/services/products/mutations";
import type { IAdminProduct } from "@/services/products/types";
import { ProductFormSteps } from "./ProductFormSteps";
import { ProductPreview } from "./ProductPreview";
import { ProductReviewTab } from "./ProductReviewTab";

const FORM_ID = "product-form";
const ALL_CATEGORIES_LIMIT = 100;

function firstTabWithErrors(errors: FieldErrors<ProductFormInput>): ProductFormTab | undefined {
  return PRODUCT_FORM_TABS.find((tab) => TAB_FIELDS[tab].some((field) => errors[field]));
}

/** Create aur edit dono — multi-step: `TAB_FIELDS` + `trigger()` (FLOW-MD 07 §6) */
export function ProductForm({ product }: { product?: IAdminProduct }) {
  const router = useRouter();
  const [tab, setTab] = useState<ProductFormTab>("basic");
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const isPending = createProduct.isPending || updateProduct.isPending;
  const { data: categories, isLoading: categoriesLoading } = useGetAdminCategories({ limit: ALL_CATEGORIES_LIMIT });

  // Product sirf leaf + active category mein (backend phir bhi check karta hai)
  const categoryOptions = useMemo(() => {
    const all = categories?.data ?? [];
    const nameById = new Map(all.map((category) => [category.id, category.name]));
    return all
      .filter((category) => category.isLeaf && (category.isActive || category.id === product?.category.id))
      .map((category) => ({
        value: category.id,
        name: category.name,
        label: category.parentId ? `${nameById.get(category.parentId) ?? "…"} › ${category.name}` : category.name,
      }));
  }, [categories, product]);

  const {
    control,
    register,
    handleSubmit,
    trigger,
    setError,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: product
      ? {
          name: product.name,
          categoryId: product.category.id,
          price: product.price,
          minimumOrderQuantity: String(product.minimumOrderQuantity),
          maximumOrderQuantity: String(product.maximumOrderQuantity),
          isActive: product.isActive,
        }
      : { name: "", categoryId: "", price: "", minimumOrderQuantity: "1", maximumOrderQuantity: "", isActive: true },
  });

  const values = useWatch({ control });
  const tabIndex = PRODUCT_FORM_TABS.indexOf(tab);
  const isLastTab = tabIndex === PRODUCT_FORM_TABS.length - 1;

  /** Aage jaane se pehle pichle saare tabs valid hon — tab click validation bypass na kare */
  const goTo = async (next: ProductFormTab) => {
    const nextIndex = PRODUCT_FORM_TABS.indexOf(next);
    for (const step of PRODUCT_FORM_TABS.slice(0, nextIndex)) {
      if (!(await trigger(TAB_FIELDS[step]))) {
        setTab(step);
        return;
      }
    }
    setTab(next);
  };

  const onSubmit = (data: ProductFormValues) => {
    // Enter key se pehle step par submit — review tak le jao
    if (!isLastTab) {
      void goTo(PRODUCT_FORM_TABS[tabIndex + 1]);
      return;
    }
    const onError = (error: Error) => {
      if (error instanceof ApiError && error.status === 409) {
        setError("name", { message: error.message });
        setTab("basic");
      }
    };
    const onSuccess = () => router.push(adminRoutes.products);
    if (product) updateProduct.mutate({ id: product.id, payload: data }, { onSuccess, onError });
    else createProduct.mutate(data, { onSuccess, onError });
  };

  const category = categoryOptions.find((option) => option.value === values.categoryId);

  return (
    <AdminFormPage
      title={product ? `Edit ${product.name}` : "New product"}
      description={
        product
          ? `SKU ${product.sku} · stock is managed on the Stock levels page.`
          : "Add a product to a leaf category. The SKU and URL are generated for you."
      }
      backHref={adminRoutes.products}
      backLabel="All products"
      formId={FORM_ID}
      onSubmit={handleSubmit(onSubmit, (formErrors) => {
        const errorTab = firstTabWithErrors(formErrors);
        if (errorTab) setTab(errorTab);
        scrollToFirstError(FORM_ID);
      })}
      aside={
        <ProductPreview
          name={String(values.name ?? "")}
          categoryName={category?.name}
          price={String(values.price ?? "")}
          minimumOrderQuantity={String(values.minimumOrderQuantity ?? "")}
        />
      }
      footer={
        <>
          <Button variant="ghost" onClick={() => router.push(adminRoutes.products)} disabled={isPending}>
            Cancel
          </Button>
          {tabIndex > 0 && (
            <Button variant="outline" onClick={() => setTab(PRODUCT_FORM_TABS[tabIndex - 1])} disabled={isPending}>
              <ArrowLeft data-icon="inline-start" aria-hidden="true" />
              Back
            </Button>
          )}
          {isLastTab ? (
            <LoadingButton type="submit" form={FORM_ID} isLoading={isPending}>
              <Check data-icon="inline-start" aria-hidden="true" />
              {product ? "Save changes" : "Create product"}
            </LoadingButton>
          ) : (
            <Button onClick={() => void goTo(PRODUCT_FORM_TABS[tabIndex + 1])}>
              Next
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Button>
          )}
        </>
      }
    >
      <ProductFormSteps current={tab} onSelect={(step) => void goTo(step)} />

      {tab === "basic" && (
        <FieldGroup>
          <InputField
            id="name"
            label="Product name"
            required
            placeholder="e.g. Royal Gala Apples"
            error={errors.name?.message}
            {...register("name")}
          />
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <SelectField
                id="categoryId"
                label="Category"
                required
                placeholder={categoriesLoading ? "Loading categories…" : "Select a category"}
                options={categoryOptions}
                value={field.value}
                onValueChange={(value) => field.onChange(value ?? "")}
                disabled={categoriesLoading}
                error={errors.categoryId?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <SwitchField
                id="isActive"
                label="Visible in the shop"
                description="Inactive products are hidden from customers but kept for order history."
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </FieldGroup>
      )}

      {tab === "pricing" && (
        <FieldGroup>
          <Grid gap="5" className="sm:grid-cols-3">
            <Field data-invalid={errors.price ? true : undefined}>
              <FieldLabel htmlFor="price">
                Price
                <RequiredMark />
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>£</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="price"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  aria-invalid={errors.price ? true : undefined}
                  aria-describedby={describedBy("price", errors.price?.message)}
                  className={cn("tabular-nums")}
                  {...register("price")}
                />
              </InputGroup>
              <FieldMessage id="price" error={errors.price?.message} />
            </Field>
            <InputField
              id="minimumOrderQuantity"
              type="number"
              inputMode="numeric"
              min="1"
              label="Minimum per order"
              required
              error={errors.minimumOrderQuantity?.message}
              {...register("minimumOrderQuantity")}
            />
            <InputField
              id="maximumOrderQuantity"
              type="number"
              inputMode="numeric"
              min="1"
              label="Maximum per order"
              required
              error={errors.maximumOrderQuantity?.message}
              {...register("maximumOrderQuantity")}
            />
          </Grid>
          <FieldDescription>
            Customers add the minimum on their first click and can&apos;t exceed the maximum (or the stock on hand).
          </FieldDescription>
        </FieldGroup>
      )}

      {tab === "review" && (
        <ProductReviewTab values={values} categoryLabel={category?.label} product={product} />
      )}
    </AdminFormPage>
  );
}

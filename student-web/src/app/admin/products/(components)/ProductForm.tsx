"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm, useWatch, type FieldErrors } from "react-hook-form";
import AdminFormPage from "@/components/admin/AdminFormPage";
import { CheckboxField } from "@/components/shared/CheckboxField";
import { InputField } from "@/components/shared/InputField";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMoney } from "@/lib/format";
import { ApiError } from "@/lib/networking/request";
import { adminRoutes } from "@/lib/routes/routes";
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

const FORM_ID = "product-form";
const ALL_CATEGORIES_LIMIT = 100;

const TAB_LABELS: Record<ProductFormTab, string> = {
  basic: "Basic",
  pricing: "Price & Limits",
  review: "Review",
};

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

  const categoryLabel = categoryOptions.find((option) => option.value === values.categoryId)?.label;

  return (
    <AdminFormPage
      cancelHref={adminRoutes.products}
      formId={FORM_ID}
      onSubmit={handleSubmit(onSubmit, (formErrors) => {
        const errorTab = firstTabWithErrors(formErrors);
        if (errorTab) setTab(errorTab);
      })}
      footer={
        <>
          <Button variant="outline" size="xl" onClick={() => router.push(adminRoutes.products)} disabled={isPending}>
            Cancel
          </Button>
          {tabIndex > 0 && (
            <Button variant="outline" size="xl" onClick={() => setTab(PRODUCT_FORM_TABS[tabIndex - 1])} disabled={isPending}>
              <ArrowLeft aria-hidden="true" />
              Back
            </Button>
          )}
          {isLastTab ? (
            <LoadingButton type="submit" form={FORM_ID} variant="brand" size="xl" isLoading={isPending}>
              {product ? "Save changes" : "Create product"}
            </LoadingButton>
          ) : (
            <Button variant="brand" size="xl" onClick={() => void goTo(PRODUCT_FORM_TABS[tabIndex + 1])}>
              Next
              <ArrowRight aria-hidden="true" />
            </Button>
          )}
        </>
      }
    >
      <Tabs value={tab} onValueChange={(value) => void goTo(value as ProductFormTab)}>
        <TabsList variant="line" className="w-full border-b border-gray-100">
          {PRODUCT_FORM_TABS.map((step) => (
            <TabsTrigger key={step} value={step} className="data-active:text-brand-green">
              {TAB_LABELS[step]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {tab === "basic" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            id="name"
            label="Product name"
            required
            placeholder="Enter product name"
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
                placeholder={categoriesLoading ? "Loading categories…" : "Select category"}
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
              <CheckboxField
                id="isActive"
                label="Active (visible in the shop)"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="sm:col-span-2"
              />
            )}
          />
        </div>
      )}

      {tab === "pricing" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <InputField
            id="price"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            label="Price (£)"
            required
            placeholder="0.00"
            error={errors.price?.message}
            {...register("price")}
          />
          <InputField
            id="minimumOrderQuantity"
            type="number"
            inputMode="numeric"
            min="1"
            label="Minimum order quantity"
            required
            error={errors.minimumOrderQuantity?.message}
            {...register("minimumOrderQuantity")}
          />
          <InputField
            id="maximumOrderQuantity"
            type="number"
            inputMode="numeric"
            min="1"
            label="Maximum order quantity"
            required
            error={errors.maximumOrderQuantity?.message}
            {...register("maximumOrderQuantity")}
          />
        </div>
      )}

      {tab === "review" && (
        <dl className="grid gap-4 rounded-15 border border-border-card p-5 text-sm sm:grid-cols-2">
          <ReviewItem label="Product name" value={values.name} />
          <ReviewItem label="Category" value={categoryLabel} />
          <ReviewItem label="Price" value={values.price ? formatMoney(String(values.price)) : undefined} />
          <ReviewItem
            label="Order quantity"
            value={`${String(values.minimumOrderQuantity ?? "")} – ${String(values.maximumOrderQuantity ?? "")}`}
          />
          {product && <ReviewItem label="SKU" value={product.sku} />}
          <div className="flex flex-col gap-1">
            <dt className="text-gray-500">Status</dt>
            <dd>
              <StatusBadge status={values.isActive ? "ACTIVE" : "INACTIVE"} />
            </dd>
          </div>
          {!product && (
            <p className="text-xs text-muted-foreground sm:col-span-2">
              The SKU and URL slug are generated automatically. Add stock from Inventory after creating the product.
            </p>
          )}
        </dl>
      )}
    </AdminFormPage>
  );
}

function ReviewItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value || "—"}</dd>
    </div>
  );
}

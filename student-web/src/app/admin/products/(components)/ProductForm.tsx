"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { AdminFormPage } from "@/components/admin/AdminFormPage";
import { FieldMessage } from "@/components/shared/FieldMessage";
import { InputField } from "@/components/shared/InputField";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SwitchField } from "@/components/shared/SwitchField";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { formatMoney } from "@/lib/format";
import { ApiError } from "@/lib/networking/request";
import { adminRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";
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
import { ProductPreview } from "./ProductPreview";

const FORM_ID = "product-form";
const ALL_CATEGORIES_LIMIT = 100;

const TAB_LABELS: Record<ProductFormTab, string> = {
  basic: "Basics",
  pricing: "Price & limits",
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
          ? `SKU ${product.sku} · stock is managed on the Inventory page.`
          : "Add a product to a leaf category. The SKU and URL are generated for you."
      }
      backHref={adminRoutes.products}
      backLabel="All products"
      formId={FORM_ID}
      onSubmit={handleSubmit(onSubmit, (formErrors) => {
        const errorTab = firstTabWithErrors(formErrors);
        if (errorTab) setTab(errorTab);
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
              <ArrowLeft aria-hidden="true" />
              Back
            </Button>
          )}
          {isLastTab ? (
            <LoadingButton type="submit" form={FORM_ID} isLoading={isPending}>
              <Check aria-hidden="true" />
              {product ? "Save changes" : "Create product"}
            </LoadingButton>
          ) : (
            <Button onClick={() => void goTo(PRODUCT_FORM_TABS[tabIndex + 1])}>
              Next
              <ArrowRight aria-hidden="true" />
            </Button>
          )}
        </>
      }
    >
      <ol className="grid grid-cols-3 gap-2" aria-label="Form steps">
        {PRODUCT_FORM_TABS.map((step, index) => {
          const done = index < tabIndex;
          const active = step === tab;
          return (
            <li key={step}>
              <button
                type="button"
                aria-current={active ? "step" : undefined}
                onClick={() => void goTo(step)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium ring-1 transition-colors",
                  active ? "bg-brand-soft text-brand ring-primary" : "ring-border hover:bg-muted",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    done || active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
                </span>
                <span className="truncate">{TAB_LABELS[step]}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {tab === "basic" && (
        <div className="grid gap-5 sm:grid-cols-2">
          <InputField
            id="name"
            label="Product name"
            required
            placeholder="e.g. Royal Gala Apples"
            containerClassName="sm:col-span-2"
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
                containerClassName="sm:col-span-2"
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
                className="sm:col-span-2"
              />
            )}
          />
        </div>
      )}

      {tab === "pricing" && (
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price">
              Price<span className="text-destructive" aria-hidden="true">*</span>
            </Label>
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
                aria-describedby={errors.price ? "price-error" : undefined}
                className="numeric"
                {...register("price")}
              />
            </InputGroup>
            <FieldMessage id="price" error={errors.price?.message} />
          </div>
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
          <p className="text-xs text-muted-foreground sm:col-span-3">
            Customers add the minimum on their first click and can&apos;t exceed the maximum (or the stock on hand).
          </p>
        </div>
      )}

      {tab === "review" && (
        <dl className="grid gap-4 rounded-xl bg-muted/50 p-5 text-sm sm:grid-cols-2">
          <ReviewItem label="Product name" value={values.name} />
          <ReviewItem label="Category" value={category?.label} />
          <ReviewItem label="Price" value={values.price ? formatMoney(String(values.price)) : undefined} />
          <ReviewItem
            label="Order quantity"
            value={`${String(values.minimumOrderQuantity ?? "")} – ${String(values.maximumOrderQuantity ?? "")}`}
          />
          {product && <ReviewItem label="SKU" value={product.sku} />}
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground">Status</dt>
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
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold">{value || "—"}</dd>
    </div>
  );
}

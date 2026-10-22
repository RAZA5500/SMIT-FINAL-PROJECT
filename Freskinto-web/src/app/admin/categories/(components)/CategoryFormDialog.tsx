"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/shared/InputField";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { SelectField } from "@/components/shared/SelectField";
import { SwitchField } from "@/components/shared/SwitchField";
import { TextAreaField } from "@/components/shared/TextAreaField";
import { scrollToFirstError } from "@/lib/forms";
import { ApiError } from "@/lib/networking/request";
import { cn } from "@/lib/utils";
import { categorySchema, type CategoryFormInput, type CategoryFormValues } from "@/modules/zod/category.model";
import { useCreateCategory, useUpdateCategory } from "@/services/categories/mutations";
import type { ICategory } from "@/services/categories/types";

const FORM_ID = "category-form";
const NO_PARENT = "__none__";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Diya ho to edit */
  category: ICategory | null;
  /** Parent sirf top-level category ho sakti hai (max 2 levels) */
  topLevelCategories: ICategory[];
}

export function CategoryFormDialog({ open, onOpenChange, category, topLevelCategories }: CategoryFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-lg")}>
        <CategoryForm category={category} topLevelCategories={topLevelCategories} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function CategoryForm({
  category,
  topLevelCategories,
  onDone,
}: Omit<CategoryFormDialogProps, "open" | "onOpenChange"> & { onDone: () => void }) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const isPending = createCategory.isPending || updateCategory.isPending;
  // Jis ke children hain woh khud child nahi ban sakti (depth limit)
  const mustStayTopLevel = (category?.childCount ?? 0) > 0;

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CategoryFormInput, unknown, CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
      parentId: category?.parentId ?? null,
      isActive: category?.isActive ?? true,
    },
  });

  const onError = (error: Error) => {
    if (error instanceof ApiError && error.status === 409 && /name/i.test(error.message)) {
      setError("name", { message: error.message });
    }
  };

  const onSubmit = (values: CategoryFormValues) => {
    if (category) {
      updateCategory.mutate(
        // Khali description → null (saaf), parentId null → top-level
        { id: category.id, payload: { ...values, description: values.description ?? null } },
        { onSuccess: onDone, onError },
      );
    } else {
      createCategory.mutate(values, { onSuccess: onDone, onError });
    }
  };

  const parentOptions = [
    { value: NO_PARENT, label: "None — top-level aisle" },
    ...topLevelCategories
      .filter((parent) => parent.id !== category?.id)
      .map((parent) => ({ value: parent.id, label: parent.name })),
  ];

  return (
    <>
      <DialogHeader>
        <DialogTitle>{category ? "Edit category" : "Create category"}</DialogTitle>
        <DialogDescription>Products can only be added to active categories without sub-categories.</DialogDescription>
      </DialogHeader>

      <Form id={FORM_ID} onSubmit={handleSubmit(onSubmit, () => scrollToFirstError(FORM_ID))}>
        <FieldGroup className={cn("gap-4")}>
          <InputField id="name" label="Name" required error={errors.name?.message} {...register("name")} />
          <TextAreaField
            id="description"
            label="Description"
            maxLength={500}
            error={errors.description?.message}
            {...register("description")}
          />
          <Controller
            control={control}
            name="parentId"
            render={({ field }) => (
              <SelectField
                id="parentId"
                label="Parent category"
                options={parentOptions}
                value={field.value ?? NO_PARENT}
                onValueChange={(value) => field.onChange(!value || value === NO_PARENT ? null : value)}
                disabled={mustStayTopLevel}
                hint={mustStayTopLevel ? "This category has sub-categories, so it must stay top-level." : undefined}
                error={errors.parentId?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <SwitchField
                id="isActive"
                label="Active"
                description="Visible in the shop"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </FieldGroup>
      </Form>

      <DialogFooter>
        <Button variant="outline" onClick={onDone} disabled={isPending}>
          Cancel
        </Button>
        <LoadingButton type="submit" form={FORM_ID} isLoading={isPending}>
          {category ? "Save changes" : "Create category"}
        </LoadingButton>
      </DialogFooter>
    </>
  );
}

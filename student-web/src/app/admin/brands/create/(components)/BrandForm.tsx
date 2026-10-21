"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminFormPage } from "@/components/admin/AdminFormPage";
import { BrandMonogram } from "@/components/admin/BrandMonogram";
import { demoAction } from "@/components/admin/demo";
import { UploadDropzone } from "@/components/admin/UploadDropzone";
import { InputField } from "@/components/shared/InputField";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SwitchField } from "@/components/shared/SwitchField";
import { TextAreaField } from "@/components/shared/TextAreaField";
import { Button, buttonVariants } from "@/components/ui/button";
import { adminMockRoutes } from "@/lib/routes/routes";

const FORM_ID = "brand-form";

const AISLE_OPTIONS = [
  "Fresh fruit",
  "Fresh vegetables",
  "Meat",
  "Poultry",
  "Dairy & eggs",
  "Bakery",
  "Frozen",
  "Snacks",
].map((aisle) => ({ value: aisle, label: aisle }));

export function BrandForm() {
  const [name, setName] = useState("");
  const [aisle, setAisle] = useState<string | null>(null);
  const [ownLabel, setOwnLabel] = useState(false);

  return (
    <AdminFormPage
      demo
      title="New brand"
      description="Add a producer or our own label. This screen is a preview — brands aren't saved yet."
      backHref={adminMockRoutes.brands}
      backLabel="Brands"
      formId={FORM_ID}
      onSubmit={(event) => {
        event.preventDefault();
        demoAction("Saving brands");
      }}
      footer={
        <>
          <Link href={adminMockRoutes.brands} className={buttonVariants({ variant: "outline" })}>
            Cancel
          </Link>
          <Button type="submit" form={FORM_ID}>
            Create brand
          </Button>
        </>
      }
      aside={
        <section className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border">
          <h2 className="text-sm font-semibold text-muted-foreground">Preview</h2>
          <div className="flex items-center gap-3">
            <BrandMonogram name={name || "New brand"} aisle={aisle ?? undefined} className="size-12 text-base" />
            <div className="flex min-w-0 flex-col gap-1">
              <p className="truncate font-semibold">{name || "Brand name"}</p>
              <p className="text-xs text-muted-foreground">{aisle ?? "No aisle yet"}</p>
            </div>
          </div>
          {ownLabel ? (
            <StatusBadge status="OWN_LABEL" label="Own label" tone="success" className="self-start" />
          ) : (
            <StatusBadge status="PARTNER" label="Partner" tone="neutral" className="self-start" />
          )}
        </section>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <InputField
          id="brand-name"
          label="Brand name"
          required
          placeholder="e.g. Meadow Lane Dairy"
          value={name}
          onChange={(event) => setName(event.target.value)}
          containerClassName="sm:col-span-2"
        />
        <SelectField
          id="brand-aisle"
          label="Main aisle"
          placeholder="Choose an aisle"
          options={AISLE_OPTIONS}
          value={aisle}
          onValueChange={setAisle}
        />
      </div>
      <TextAreaField
        id="brand-description"
        label="Description"
        rows={4}
        placeholder="Where they're based and what they're known for"
        hint="Shown on the brand's page in the shop."
      />
      <SwitchField
        id="brand-own-label"
        label="Own label"
        description="Products made for Freskinto and sold under our name."
        checked={ownLabel}
        onCheckedChange={setOwnLabel}
      />
      <UploadDropzone id="brand-logo" label="Logo" />
    </AdminFormPage>
  );
}

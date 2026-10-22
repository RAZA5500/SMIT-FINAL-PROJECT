"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/typography";
import { AdminFormPage } from "@/components/admin/AdminFormPage";
import { BrandMonogram } from "@/components/admin/BrandMonogram";
import { demoAction } from "@/components/admin/demo";
import { UploadDropzone } from "@/components/admin/UploadDropzone";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { InputField } from "@/components/shared/InputField";
import { SelectField } from "@/components/shared/SelectField";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SwitchField } from "@/components/shared/SwitchField";
import { TextAreaField } from "@/components/shared/TextAreaField";
import { adminMockRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

const FORM_ID = "brand-form";

const AISLE_OPTIONS = ["Fresh fruit", "Fresh vegetables", "Meat", "Poultry", "Dairy & eggs", "Bakery", "Frozen", "Snacks"].map(
  (aisle) => ({ value: aisle, label: aisle }),
);

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
          <ButtonLink href={adminMockRoutes.brands} variant="outline">
            Cancel
          </ButtonLink>
          <Button type="submit" form={FORM_ID}>
            Create brand
          </Button>
        </>
      }
      aside={
        <Card>
          <CardHeader>
            <CardTitle className={cn("font-sans text-base")}>Preview</CardTitle>
            <CardDescription>How the brand appears in lists.</CardDescription>
          </CardHeader>
          <CardContent className={cn("flex flex-col gap-4")}>
            <Flex align="center" gap="3">
              <BrandMonogram name={name || "New brand"} className={cn("size-12 text-base")} />
              <Stack gap="1" className={cn("min-w-0")}>
                <Text weight="semibold" className={cn("truncate")}>
                  {name || "Brand name"}
                </Text>
                <Text variant="small" tone="muted">
                  {aisle ?? "No aisle yet"}
                </Text>
              </Stack>
            </Flex>
            {ownLabel ? (
              <StatusBadge status="OWN_LABEL" label="Own label" tone="brand" className={cn("self-start")} />
            ) : (
              <StatusBadge status="PARTNER" label="Partner" tone="neutral" className={cn("self-start")} />
            )}
          </CardContent>
        </Card>
      }
    >
      <FieldGroup>
        <Grid gap="5" className={cn("sm:grid-cols-2")}>
          <InputField
            id="brand-name"
            label="Brand name"
            required
            placeholder="e.g. Meadow Lane Dairy"
            value={name}
            onChange={(event) => setName(event.target.value)}
            containerClassName={cn("sm:col-span-2")}
          />
          <SelectField
            id="brand-aisle"
            label="Main aisle"
            placeholder="Choose an aisle"
            options={AISLE_OPTIONS}
            value={aisle}
            onValueChange={setAisle}
          />
        </Grid>
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
      </FieldGroup>
    </AdminFormPage>
  );
}

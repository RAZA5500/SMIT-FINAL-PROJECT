"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Stack } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Grid } from "@/components/ui/grid";
import { Separator } from "@/components/ui/separator";
import { Heading, Text } from "@/components/ui/typography";
import { AdminPage } from "@/components/admin/AdminPage";
import { demoAction } from "@/components/admin/demo";
import { InputField } from "@/components/shared/InputField";
import { SwitchField } from "@/components/shared/SwitchField";
import { STORE } from "@/constants/store";
import { cn } from "@/lib/utils";

const FORM_ID = "settings-form";

const ALERTS = [
  { key: "orders", label: "New paid orders", description: "An email as soon as a customer pays." },
  { key: "lowStock", label: "Low stock", description: "When a product drops to its low-stock threshold." },
  { key: "dailySummary", label: "Daily summary", description: "Yesterday's orders and revenue, every morning at 7am." },
  { key: "push", label: "Browser notifications", description: "Pop-up alerts while the admin is open." },
] as const;

type AlertKey = (typeof ALERTS)[number]["key"];

/** Settings ka ek hissa — left par heading, right par card (lg se upar) */
function SettingsSection({ id, title, description, children }: { id: string; title: string; description: string; children: ReactNode }) {
  return (
    <Grid as="section" aria-labelledby={id} gap="4" className={cn("lg:grid-cols-3 lg:gap-8")}>
      <Stack gap="1">
        <Heading id={id} size="5" family="sans">
          {title}
        </Heading>
        <Text tone="muted">{description}</Text>
      </Stack>
      <Card className={cn("lg:col-span-2")}>
        <CardContent>{children}</CardContent>
      </Card>
    </Grid>
  );
}

export function SettingsView() {
  const [alerts, setAlerts] = useState<Record<AlertKey, boolean>>({
    orders: true,
    lowStock: true,
    dailySummary: false,
    push: false,
  });

  return (
    <AdminPage
      demo
      eyebrow="Account"
      title="Settings"
      description="Store details and how you hear about activity. Settings aren't stored yet, so changes here aren't saved."
      actions={
        <Button type="submit" form={FORM_ID}>
          Save changes
        </Button>
      }
    >
      <Form
        id={FORM_ID}
        onSubmit={(event) => {
          event.preventDefault();
          demoAction("Saving settings");
        }}
        className={cn("gap-8")}
      >
        <SettingsSection
          id="settings-store"
          title="Store details"
          description="Shown to customers on receipts, emails and in the shop footer."
        >
          <FieldGroup className={cn("sm:grid sm:grid-cols-2")}>
            <InputField id="store-name" label="Store name" defaultValue={STORE.name} />
            <InputField id="store-email" label="Support email" type="email" defaultValue={STORE.supportEmail} />
            <InputField id="store-tagline" label="Tagline" defaultValue={STORE.tagline} containerClassName={cn("sm:col-span-2")} />
          </FieldGroup>
        </SettingsSection>

        <Separator />

        <SettingsSection
          id="settings-checkout"
          title="Checkout & delivery"
          description="Fixed for this version of the store — shown here for reference."
        >
          <FieldGroup className={cn("sm:grid sm:grid-cols-2")}>
            <InputField
              id="store-currency"
              label="Currency"
              defaultValue="Pound sterling (£)"
              readOnly
              hint="Prices are set in pounds across the store."
            />
            <InputField
              id="store-delivery"
              label="Delivery charge"
              defaultValue="Free"
              readOnly
              hint="Delivery is free on every order."
            />
            <InputField
              id="store-payment-window"
              label="Payment window"
              defaultValue={`${STORE.paymentWindowMinutes} minutes`}
              readOnly
              hint="Unpaid orders are cancelled after this and their stock goes back on the shelf."
              containerClassName={cn("sm:col-span-2")}
            />
          </FieldGroup>
        </SettingsSection>

        <Separator />

        <SettingsSection id="settings-alerts" title="Notifications" description="Choose which alerts reach you and how.">
          <Stack gap="3">
            {ALERTS.map((alert) => (
              <SwitchField
                key={alert.key}
                id={`alert-${alert.key}`}
                label={alert.label}
                description={alert.description}
                checked={alerts[alert.key]}
                onCheckedChange={(checked) => setAlerts((current) => ({ ...current, [alert.key]: checked }))}
              />
            ))}
          </Stack>
        </SettingsSection>
      </Form>
    </AdminPage>
  );
}

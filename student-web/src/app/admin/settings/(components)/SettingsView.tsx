"use client";

import { BellRing, Store, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { demoAction } from "@/components/admin/demo";
import { InputField } from "@/components/shared/InputField";
import { SwitchField } from "@/components/shared/SwitchField";
import { Button } from "@/components/ui/button";

const ALERTS = [
  { key: "orders", label: "New paid orders", description: "An email as soon as a customer pays." },
  { key: "lowStock", label: "Low stock", description: "When a product drops to its low-stock threshold." },
  { key: "dailySummary", label: "Daily summary", description: "Yesterday's orders and revenue, every morning at 7am." },
  { key: "push", label: "Browser notifications", description: "Pop-up alerts while the admin is open." },
] as const;

type AlertKey = (typeof ALERTS)[number]["key"];

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-5 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border sm:p-6 lg:grid-cols-3">
      <div className="flex gap-3 lg:flex-col">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-1">
          <h2 className="font-sans text-base font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 lg:col-span-2">{children}</div>
    </section>
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
      title="Settings"
      description="Store details and how you hear about activity. Settings aren't stored yet, so changes here aren't saved."
      actions={<Button onClick={() => demoAction("Saving settings")}>Save changes</Button>}
    >
      <SettingsSection
        icon={BellRing}
        title="Notifications"
        description="Choose which alerts reach you and how."
      >
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
      </SettingsSection>

      <SettingsSection
        icon={Store}
        title="Store details"
        description="Shown to customers on receipts and in the shop footer."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField id="store-name" label="Store name" defaultValue="Freskinto" />
          <InputField id="store-email" label="Support email" type="email" defaultValue="hello@freskinto.co.uk" />
          <InputField
            id="store-currency"
            label="Currency"
            defaultValue="Pound sterling (£)"
            disabled
            hint="Prices are set in pounds across the store."
          />
          <InputField
            id="store-delivery"
            label="Delivery charge"
            defaultValue="Free"
            disabled
            hint="Delivery is free on every order."
          />
        </div>
      </SettingsSection>
    </AdminPage>
  );
}

"use client";

import React, { useState } from "react";
import { Bell, Mail } from "lucide-react";

interface Preference {
  key: string;
  title: string;
  blurb: string;
  icon: React.ReactNode;
}

const PREFERENCES: Preference[] = [
  {
    key: "email",
    title: "Email Notifications",
    blurb: "Receive daily digests and activity summaries via email.",
    icon: <Mail className="lucide lucide-mail w-4 h-4 text-brand-green" />,
  },
  {
    key: "push",
    title: "Push Notifications",
    blurb: "Real-time alerts pushed directly to your device.",
    icon: <Bell className="lucide lucide-bell w-4 h-4 text-brand-green" />,
  },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className={`inline-flex relative border-2 border-transparent rounded-full w-11 h-6 transition-colors duration-200 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 ${
        on ? "bg-brand-green" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block bg-white shadow rounded-full w-5 h-5 transition-transform duration-200 pointer-events-none transform ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function AdminSettingsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ email: true, push: true });

  return (
    <main className="flex flex-col flex-1 bg-navbar-bg sm:p-4 sm:px-4 sm:py-5 overflow-y-auto lg:overflow-hidden min-h-0">
      <div className="bg-white rounded-xl shadow-card flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="flex flex-col gap-6 p-4 sm:p-6 overflow-y-auto">
          <div>
            <h2 className="font-semibold text-item-text text-lg">Notification Settings</h2>
            <p className="text-muted-green text-xs mt-1">
              Pick how you want to be notified about activity on the platform.
            </p>
          </div>

          <div className="bg-white px-4 sm:px-6 py-2 border border-border-card rounded-15">
            <div>
              {PREFERENCES.map((p) => (
                <div key={p.key} className="flex justify-between items-start sm:items-center gap-4 py-4">
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                    <div className="flex justify-center items-center mt-0.5 rounded-xl w-12 h-12 shrink-0 bg-icon-bg-green">
                      {p.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{p.title}</p>
                      <p className="mt-0.5 text-label-dark-green text-xs">{p.blurb}</p>
                    </div>
                  </div>
                  <Toggle
                    on={enabled[p.key]}
                    onToggle={() => setEnabled((prev) => ({ ...prev, [p.key]: !prev[p.key] }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

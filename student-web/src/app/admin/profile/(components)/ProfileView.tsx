"use client";

import { KeyRound, LogOut, Mail, ShieldCheck } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { demoAction } from "@/components/admin/demo";
import { InputField } from "@/components/shared/InputField";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useLogout";
import { formatDate, formatDateTime, initials } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";

export function ProfileView() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  return (
    <AdminPage
      demo
      title="Profile"
      description="Your admin account. Editing your details isn't available yet."
    >
      <section className="overflow-hidden rounded-2xl bg-card shadow-soft ring-1 ring-border">
        <div className="bg-dots h-28 bg-brand-strong text-white/10 sm:h-36" aria-hidden="true" />
        <div className="flex flex-col gap-4 px-5 pb-6 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
            <span
              className="-mt-12 flex size-24 shrink-0 items-center justify-center rounded-full bg-lime font-display text-3xl font-bold text-lime-foreground ring-4 ring-card"
              aria-hidden="true"
            >
              {initials(user?.name)}
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl font-bold">{user?.name ?? "Admin"}</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  Administrator
                </span>
              </div>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="size-4" aria-hidden="true" />
                {user?.email ?? "—"}
              </p>
            </div>
          </div>
          <dl className="flex gap-6 text-sm">
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">Member since</dt>
              <dd className="font-medium">{formatDate(user?.createdAt)}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">Last sign-in</dt>
              <dd className="font-medium">{formatDateTime(user?.lastLoginAt)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="grid items-start gap-4 lg:grid-cols-3">
        <section className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border sm:p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-sans text-base font-semibold">Personal details</h2>
            <Button variant="outline" size="sm" onClick={() => demoAction("Editing your profile")}>
              Edit details
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField id="profile-name" label="Full name" value={user?.name ?? ""} readOnly />
            <InputField id="profile-email" label="Email address" value={user?.email ?? ""} readOnly />
            <InputField id="profile-phone" label="Phone number" value={user?.phone ?? ""} placeholder="Not added" readOnly />
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border sm:p-6">
          <h2 className="font-sans text-base font-semibold">Security</h2>
          <p className="text-sm text-muted-foreground">
            Use a long, unique password for the admin account and don&apos;t share it.
          </p>
          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={() => demoAction("Changing your password")}>
              <KeyRound aria-hidden="true" />
              Change password
            </Button>
            <Button variant="destructive" onClick={logout}>
              <LogOut aria-hidden="true" />
              Sign out
            </Button>
          </div>
        </section>
      </div>
    </AdminPage>
  );
}

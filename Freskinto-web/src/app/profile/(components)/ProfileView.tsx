"use client";

import { Clock, Info, LogOut, Mail, MapPin, Package, Phone, ShoppingBasket, UserRound } from "lucide-react";
import { Alert, AlertBody, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { InfoRow } from "@/components/shared/InfoRow";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { STORE } from "@/constants/store";
import { useLogout } from "@/hooks/useLogout";
import { customerRoutes } from "@/lib/routes/routes";
import { formatDate, formatDateTime, formatMoney, initials } from "@/lib/utils";
import { useGetAddresses } from "@/services/addresses/queries";
import { useAuthStore } from "@/stores/auth-store";

const SHORTCUTS = [
  { href: customerRoutes.orders, icon: Package, title: "My orders", text: "Track previous and active deliveries." },
  { href: customerRoutes.addresses, icon: MapPin, title: "Addresses", text: "Manage your saved delivery addresses." },
  { href: customerRoutes.cart, icon: ShoppingBasket, title: "Basket", text: "Review products waiting in your basket." },
];

/** Customer profile: backend sirf `GET /auth/me` deta hai — details read-only, stats asli */
export function ProfileView() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  // Default address sab se pehle aata hai
  const { data: addresses } = useGetAddresses({ limit: 1 });
  const defaultAddress = addresses?.data.find((address) => address.isDefault);

  return (
    <CustomerPage
      eyebrow="My account"
      title="Profile"
      description="Your Freskinto account details and shortcuts."
      breadcrumbs={[{ label: "Profile" }]}
    >
      <div className="grid items-start gap-6 lg:grid-cols-12">
        <section
          aria-label="Account summary"
          className="flex flex-col items-center gap-5 rounded-15 border border-border bg-card p-6 text-center shadow-soft lg:col-span-5"
        >
          <Avatar size="xl" className="size-24">
            <AvatarFallback className="bg-brand-green-forest text-fs-32 text-white">{initials(user?.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-1">
            <h2 className="font-heading text-fs-28 font-semibold">{user?.name ?? "Customer"}</h2>
            <p className="text-sm text-muted-foreground">{user?.email ?? "—"}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="brand">Customer</Badge>
            {user && <StatusBadge status={user.isActive ? "ACTIVE" : "INACTIVE"} />}
          </div>

          <dl className="grid w-full grid-cols-2 divide-x divide-border rounded-xl border border-border bg-muted/40">
            <div className="flex flex-col gap-0.5 px-4 py-3">
              <dt className="text-fs-12 text-muted-foreground">Orders</dt>
              <dd className="numeric font-heading text-fs-24 font-semibold">{user?.totalOrders ?? 0}</dd>
            </div>
            <div className="flex flex-col gap-0.5 px-4 py-3">
              <dt className="text-fs-12 text-muted-foreground">Total spent</dt>
              <dd className="numeric font-heading text-fs-24 font-semibold">{formatMoney(user?.totalSpent ?? 0)}</dd>
            </div>
          </dl>

          <Button variant="destructive-outline" className="w-full" onClick={logout}>
            <LogOut aria-hidden="true" />
            Sign out
          </Button>
        </section>

        <div className="flex flex-col gap-6 lg:col-span-7">
          <SectionCard title="Account details" icon={<UserRound />}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <InfoRow icon={<UserRound aria-hidden="true" />} label="Full name">
                  {user?.name ?? "—"}
                </InfoRow>
                <InfoRow icon={<Mail aria-hidden="true" />} label="Email">
                  {user?.email ?? "—"}
                </InfoRow>
                <InfoRow icon={<Phone aria-hidden="true" />} label="Phone">
                  {user?.phone ?? "Not added"}
                </InfoRow>
                <InfoRow icon={<Clock aria-hidden="true" />} label="Member since">
                  {formatDate(user?.createdAt)}
                </InfoRow>
                <InfoRow icon={<MapPin aria-hidden="true" />} label="Default address" className="sm:col-span-2">
                  {defaultAddress
                    ? `${defaultAddress.addressLine}, ${defaultAddress.city}, ${defaultAddress.county}, ${defaultAddress.postcode}`
                    : "No default address yet"}
                </InfoRow>
                <InfoRow icon={<Clock aria-hidden="true" />} label="Last sign-in" className="sm:col-span-2">
                  {formatDateTime(user?.lastLoginAt)}
                </InfoRow>
              </div>
              <Alert variant="info">
                <Info aria-hidden="true" />
                <AlertBody>
                  <AlertTitle>Need to change your details?</AlertTitle>
                  <AlertDescription>
                    Profile editing isn&apos;t available yet — email{" "}
                    <a className="font-medium text-brand-green" href={`mailto:${STORE.supportEmail}`}>
                      {STORE.supportEmail}
                    </a>{" "}
                    and we&apos;ll update it for you.
                  </AlertDescription>
                </AlertBody>
              </Alert>
            </div>
          </SectionCard>

          <SectionCard title="Shortcuts">
            <ul className="grid gap-3 sm:grid-cols-3">
              {SHORTCUTS.map(({ href, icon: Icon, title, text }) => (
                <li key={href}>
                  <ButtonLink
                    href={href}
                    variant="outline"
                    className="h-auto w-full flex-col items-start gap-2 rounded-2xl p-4 text-left whitespace-normal"
                  >
                    <span className="flex size-9 items-center justify-center rounded-xl bg-brand-soft text-brand-green">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <span className="text-sm font-semibold">{title}</span>
                    <span className="text-fs-12 font-normal text-muted-foreground">{text}</span>
                  </ButtonLink>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </CustomerPage>
  );
}

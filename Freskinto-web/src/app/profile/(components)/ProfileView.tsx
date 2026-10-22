"use client";

import { Clock, Info, LogOut, Mail, MapPin, Package, Phone, ShoppingBasket, UserRound } from "lucide-react";
import { Alert, AlertBody, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Heading, Text } from "@/components/ui/typography";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { TextLink } from "@/components/shared/TextLink";
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
      <Grid align="start" gap="6" className="lg:grid-cols-12">
        <Card
          render={<Box as="section" aria-label="Account summary" />}
          className="items-center gap-5 pt-8 text-center lg:col-span-5"
        >
          <Avatar size="xl" className="size-20">
            <AvatarFallback className="text-2xl">{initials(user?.name)}</AvatarFallback>
          </Avatar>
          <CardContent className="flex w-full flex-col items-center gap-5">
            <Stack align="center" gap="1">
              <Heading as="h2" size="3">
                {user?.name ?? "Customer"}
              </Heading>
              <Text tone="muted">{user?.email ?? "—"}</Text>
            </Stack>
            <Flex wrap align="center" justify="center" gap="2">
              <Badge variant="secondary">Customer</Badge>
              {user && <StatusBadge status={user.isActive ? "ACTIVE" : "INACTIVE"} />}
            </Flex>

            <Grid as="dl" cols="2" className="w-full divide-x divide-border rounded-lg border border-border">
              <Stack gap="0.5" className="px-4 py-3">
                <Text as="dt" tone="muted" className="text-fs-12">
                  Orders
                </Text>
                <Text as="dd" weight="semibold" numeric className="text-xl">
                  {user?.totalOrders ?? 0}
                </Text>
              </Stack>
              <Stack gap="0.5" className="px-4 py-3">
                <Text as="dt" tone="muted" className="text-fs-12">
                  Total spent
                </Text>
                <Text as="dd" weight="semibold" numeric className="text-xl">
                  {formatMoney(user?.totalSpent ?? 0)}
                </Text>
              </Stack>
            </Grid>

            <Button variant="destructive-outline" className="w-full" onClick={logout}>
              <LogOut aria-hidden="true" />
              Sign out
            </Button>
          </CardContent>
        </Card>

        <Stack gap="6" className="lg:col-span-7">
          <SectionCard title="Account details" icon={<UserRound />}>
            <Stack gap="5">
              <Grid gap="5" className="sm:grid-cols-2">
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
              </Grid>
              <Alert variant="info">
                <Info aria-hidden="true" />
                <AlertBody>
                  <AlertTitle>Need to change your details?</AlertTitle>
                  <AlertDescription>
                    Profile editing isn&apos;t available yet — email{" "}
                    <TextLink href={`mailto:${STORE.supportEmail}`} underline>
                      {STORE.supportEmail}
                    </TextLink>{" "}
                    and we&apos;ll update it for you.
                  </AlertDescription>
                </AlertBody>
              </Alert>
            </Stack>
          </SectionCard>

          <SectionCard title="Shortcuts">
            <Grid as="ul" gap="3" className="sm:grid-cols-3">
              {SHORTCUTS.map(({ href, icon: Icon, title, text }) => (
                <Box as="li" key={href}>
                  <ButtonLink
                    href={href}
                    variant="outline"
                    className="h-auto w-full flex-col items-start gap-2 p-4 text-left whitespace-normal hover:bg-muted/50"
                  >
                    <Flex
                      as="span"
                      align="center"
                      justify="center"
                      className="size-8 rounded-md bg-muted text-muted-foreground"
                    >
                      <Icon aria-hidden="true" className="size-4" />
                    </Flex>
                    <Text as="span" weight="medium">
                      {title}
                    </Text>
                    <Text as="span" tone="muted" weight="normal" className="text-fs-12">
                      {text}
                    </Text>
                  </ButtonLink>
                </Box>
              ))}
            </Grid>
          </SectionCard>
        </Stack>
      </Grid>
    </CustomerPage>
  );
}

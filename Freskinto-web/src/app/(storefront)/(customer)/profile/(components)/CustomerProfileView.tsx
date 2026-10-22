"use client";

import { LogOut, MapPin, Package, ShieldCheck, ShoppingBasket } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Heading, Text } from "@/components/ui/typography";
import { CustomerPage } from "@/components/customer/CustomerPage";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { useLogout } from "@/hooks/useLogout";
import { formatDate, initials } from "@/lib/format";
import { customerRoutes } from "@/lib/routes/routes";
import { useAuthStore } from "@/stores/auth-store";

export function CustomerProfileView() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  return (
    <CustomerPage
      eyebrow="My Account"
      title="Profile"
      description="View and manage your Freskinto customer account details and quick actions."
      breadcrumbs={[{ label: "Profile" }]}
    >
      <Grid gap="6" className="lg:grid-cols-12">
        <Card className="lg:col-span-5 bg-card">
          <CardContent className="flex flex-col items-center gap-4 pt-6 pb-6 text-center">
            <Avatar className="size-24 rounded-full border-2 border-brand-green/20">
              <AvatarFallback className="bg-primary text-3xl font-bold text-primary-foreground">
                {initials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <Stack gap="1" align="center">
              <Heading size="3" className="font-bold text-foreground">
                {user?.name ?? "Customer"}
              </Heading>
              <Text tone="muted" className="text-sm">
                {user?.email ?? "—"}
              </Text>
            </Stack>
            <Badge variant="brand" className="font-semibold">
              <ShieldCheck aria-hidden="true" className="size-3.5" />
              Verified Customer
            </Badge>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-2.5 border-t border-border bg-modal-footer p-5">
            <Flex justify="between" gap="3">
              <Text as="span" variant="small" tone="muted">
                Member since
              </Text>
              <Text as="span" variant="small" weight="medium" numeric>
                {formatDate(user?.createdAt)}
              </Text>
            </Flex>
            <Button
              variant="outline"
              size="default"
              onClick={logout}
              className="mt-3 w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut aria-hidden="true" />
              Sign out
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Account Shortcuts</CardTitle>
            <CardDescription>
              Quickly jump to your orders, delivery addresses, or active basket.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Card size="sm" className="p-4 bg-muted/30 border border-border hover:border-brand-green/40 transition-colors">
              <Flex gap="3" align="start">
                <Flex align="center" justify="center" className="size-10 rounded-xl bg-icon-green text-brand-green shrink-0">
                  <Package className="size-5" />
                </Flex>
                <Stack gap="1" className="min-w-0">
                  <Text weight="semibold" className="text-foreground">My Orders</Text>
                  <Text variant="small" tone="muted">Track previous and active deliveries.</Text>
                  <ButtonLink href={customerRoutes.orders} variant="link" size="sm" className="w-fit p-0 text-brand-green">
                    View orders →
                  </ButtonLink>
                </Stack>
              </Flex>
            </Card>

            <Card size="sm" className="p-4 bg-muted/30 border border-border hover:border-brand-green/40 transition-colors">
              <Flex gap="3" align="start">
                <Flex align="center" justify="center" className="size-10 rounded-xl bg-icon-green text-brand-green shrink-0">
                  <MapPin className="size-5" />
                </Flex>
                <Stack gap="1" className="min-w-0">
                  <Text weight="semibold" className="text-foreground">Addresses</Text>
                  <Text variant="small" tone="muted">Manage your saved home & work addresses.</Text>
                  <ButtonLink href={customerRoutes.addresses} variant="link" size="sm" className="w-fit p-0 text-brand-green">
                    Manage addresses →
                  </ButtonLink>
                </Stack>
              </Flex>
            </Card>

            <Card size="sm" className="p-4 bg-muted/30 border border-border hover:border-brand-green/40 transition-colors sm:col-span-2">
              <Flex gap="3" align="start">
                <Flex align="center" justify="center" className="size-10 rounded-xl bg-icon-green text-brand-green shrink-0">
                  <ShoppingBasket className="size-5" />
                </Flex>
                <Stack gap="1" className="min-w-0">
                  <Text weight="semibold" className="text-foreground">Active Basket</Text>
                  <Text variant="small" tone="muted">Review products currently saved in your market basket.</Text>
                  <ButtonLink href={customerRoutes.cart} variant="link" size="sm" className="w-fit p-0 text-brand-green">
                    Go to basket →
                  </ButtonLink>
                </Stack>
              </Flex>
            </Card>
          </CardContent>
        </Card>
      </Grid>
    </CustomerPage>
  );
}

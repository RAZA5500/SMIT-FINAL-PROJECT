"use client";

import { KeyRound, LogOut, Pencil, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Flex, Stack } from "@/components/ui/flex";
import { Grid } from "@/components/ui/grid";
import { Heading, Text } from "@/components/ui/typography";
import { AdminPage } from "@/components/admin/AdminPage";
import { demoAction } from "@/components/admin/demo";
import { InputField } from "@/components/shared/InputField";
import { useLogout } from "@/hooks/useLogout";
import { formatDate, formatDateTime, initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const ACCOUNT_CHANGES_NOTE = "Account changes aren't available in this version.";

/** Signed-in admin ki details (AuthGuard ke andar — user hamesha hydrated hai) */
export function ProfileView() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  return (
    <AdminPage title="Profile" eyebrow="Account" description="Your admin account. Editing your details isn't available yet.">
      <Grid align="start" gap="6" className={cn("lg:grid-cols-3")}>
        <Card className={cn("texture-dots")}>
          <CardContent className={cn("flex flex-col items-center gap-4 py-4 text-center")}>
            <Avatar className={cn("size-20 after:border-0")}>
              <AvatarFallback className={cn("bg-primary font-heading text-2xl font-semibold text-primary-foreground")}>
                {initials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <Stack gap="1" align="center">
              <Heading size="3">{user?.name ?? "Admin"}</Heading>
              <Text tone="muted" className={cn("break-all")}>
                {user?.email ?? "—"}
              </Text>
            </Stack>
            <Badge variant="success">
              <ShieldCheck aria-hidden="true" />
              Administrator
            </Badge>
          </CardContent>
          <CardFooter className={cn("flex-col items-stretch gap-1 py-3 text-left")}>
            <Flex justify="between" gap="3">
              <Text as="span" variant="small" tone="muted">
                Member since
              </Text>
              <Text as="span" variant="small" weight="medium" numeric>
                {formatDate(user?.createdAt)}
              </Text>
            </Flex>
            <Flex justify="between" gap="3">
              <Text as="span" variant="small" tone="muted">
                Last sign-in
              </Text>
              <Text as="span" variant="small" weight="medium" numeric>
                {formatDateTime(user?.lastLoginAt)}
              </Text>
            </Flex>
          </CardFooter>
        </Card>

        <Stack gap="6" className={cn("lg:col-span-2")}>
          <Card>
            <CardHeader className={cn("flex flex-row items-start justify-between")}>
              <CardTitle className={cn("font-sans text-base")}>Account details</CardTitle>
              <CardDescription>The name and contact details on your account.</CardDescription>
              <Button
                variant="outline"
                size="sm"
                className={cn("col-start-2 row-span-2 row-start-1 self-start")}
                onClick={() => demoAction("Editing your profile", ACCOUNT_CHANGES_NOTE)}
              >
                <Pencil data-icon="inline-start" aria-hidden="true" />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <FieldGroup className={cn("sm:grid sm:grid-cols-2")}>
                <InputField id="profile-name" label="Full name" value={user?.name ?? ""} readOnly />
                <InputField id="profile-email" label="Email address" value={user?.email ?? ""} readOnly />
                <InputField id="profile-phone" label="Phone number" value={user?.phone ?? ""} placeholder="Not added" readOnly />
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className={cn("font-sans text-base")}>Sign-in & security</CardTitle>
              <CardDescription>Keep your password private — admins can change prices and refund orders.</CardDescription>
            </CardHeader>
            <CardContent>
              <Flex wrap gap="3">
                <Button variant="outline" onClick={() => demoAction("Changing your password", ACCOUNT_CHANGES_NOTE)}>
                  <KeyRound data-icon="inline-start" aria-hidden="true" />
                  Change password
                </Button>
                <Button variant="destructive" onClick={logout}>
                  <LogOut data-icon="inline-start" aria-hidden="true" />
                  Sign out
                </Button>
              </Flex>
            </CardContent>
          </Card>
        </Stack>
      </Grid>
    </AdminPage>
  );
}

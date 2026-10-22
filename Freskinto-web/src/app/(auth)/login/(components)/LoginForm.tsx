"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Flex, Stack } from "@/components/ui/flex";
import { FieldGroup } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/typography";
import { CheckboxField } from "@/components/shared/CheckboxField";
import { InputField } from "@/components/shared/InputField";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { PasswordField } from "@/components/shared/PasswordField";
import { TextLink } from "@/components/shared/TextLink";
import { scrollToFirstError } from "@/lib/forms";
import { homeForRole, publicRoutes, safeRedirect } from "@/lib/routes/routes";
import { toastError, toastSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { loginSchema, type LoginFormData } from "@/modules/zod/login.model";
import { useLogin } from "@/services/auth/mutations";
import type { UserRole } from "@/services/auth/types";
import { useAuthStore } from "@/stores/auth-store";

const FORM_ID = "login-form";

/** Redirect sirf apne area ke andar; warna role ka home (admin → dashboard, customer → shop) */
function destinationFor(role: UserRole, redirectParam: string | null): string {
  const redirectTo = safeRedirect(redirectParam);
  const isAdminPath = redirectTo?.startsWith("/admin") ?? false;
  if (redirectTo && (role === "ADMIN") === isAdminPath) return redirectTo;
  return homeForRole(role);
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setSession = useAuthStore((state) => state.setSession);
  const login = useLogin();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const redirectParam = searchParams.get("redirect");

  // Pehle se signed in → apna area
  useEffect(() => {
    if (hasHydrated && token && user) router.replace(destinationFor(user.role, redirectParam));
  }, [hasHydrated, token, user, router, redirectParam]);

  const onSubmit = (data: LoginFormData) => {
    login.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: ({ accessToken, user: signedIn }) => {
          setSession(accessToken, signedIn, data.rememberMe);
          toastSuccess(`Welcome back, ${signedIn.name.split(" ")[0]}!`, "You're signed in.");
          router.replace(destinationFor(signedIn.role, redirectParam));
        },
        onError: (error) => toastError("Sign in failed", error.message),
      },
    );
  };

  return (
    <Form id={FORM_ID} onSubmit={handleSubmit(onSubmit, () => scrollToFirstError(FORM_ID))}>
      <FieldGroup>
        <InputField
          id="email"
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          autoComplete="username"
          leftIcon={<Mail aria-hidden="true" />}
          error={errors.email?.message}
          {...register("email")}
        />
        <Stack gap="2">
          <PasswordField
            id="password"
            label="Password"
            placeholder="Your password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Flex justify="end">
            <TextLink href={publicRoutes.forgotPassword} className={cn("text-sm")}>
              Forgot password?
            </TextLink>
          </Flex>
        </Stack>
        <Controller
          control={control}
          name="rememberMe"
          render={({ field }) => (
            <CheckboxField
              id="rememberMe"
              label="Keep me signed in"
              description="Stay signed in on this device"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </FieldGroup>

      <LoadingButton
        type="submit"
        size="xl"
        variant="signin"
        isLoading={login.isPending}
        loadingText="Signing in…"
        className={cn("w-full shadow-md shadow-brand-green/20")}
      >
        Sign in
        <ArrowRight data-icon="inline-end" aria-hidden="true" />
      </LoadingButton>

      <Text tone="muted" className={cn("text-center")}>
        New to the market? <TextLink href={publicRoutes.register}>Create a free account</TextLink>
      </Text>
    </Form>
  );
}

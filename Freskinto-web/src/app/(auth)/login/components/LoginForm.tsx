"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/typography";
import { CheckboxField } from "@/components/shared/CheckboxField";
import { InputField } from "@/components/shared/InputField";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { PasswordField } from "@/components/shared/PasswordField";
import { TextLink } from "@/components/shared/TextLink";
import { homeForRole, publicRoutes, safeRedirect } from "@/lib/routes/routes";
import { toastError, toastSuccess } from "@/lib/toast";
import { scrollToFirstError } from "@/lib/utils";
import { loginSchema, type LoginFormData } from "@/modules/zod/login.model";
import { useLogin } from "@/services/auth/mutations";
import type { UserRole } from "@/services/auth/types";
import { useAuthStore } from "@/stores/auth-store";

const FORM_ID = "login-form";

/** Redirect sirf apne area ke andar; warna role ka home (admin → orders, customer → shop) */
function destinationFor(role: UserRole, redirectParam: string | null): string {
  const redirectTo = safeRedirect(redirectParam);
  const isAdminPath = redirectTo?.startsWith("/admin") ?? false;
  if (redirectTo && (role === "ADMIN") === isAdminPath) return redirectTo;
  return homeForRole(role);
}

interface LoginFormProps {
  /** `?redirect=` — page.tsx server par padhta hai */
  redirectTo: string | null;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setSession = useAuthStore((state) => state.setSession);
  const login = useLogin();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  // Pehle se signed in → apna area
  useEffect(() => {
    if (hasHydrated && token && user) router.replace(destinationFor(user.role, redirectTo));
  }, [hasHydrated, token, user, router, redirectTo]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const { accessToken, user: signedIn } = await login.mutateAsync({
        email: data.email,
        password: data.password,
      });
      setSession(accessToken, signedIn, data.rememberMe);
      toastSuccess(`Welcome back, ${signedIn.name.split(" ")[0]}!`, "You're signed in.");
      router.replace(destinationFor(signedIn.role, redirectTo));
    } catch (error) {
      toastError("Sign in failed", (error as Error).message);
    }
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
        <PasswordField
          id="password"
          label="Password"
          placeholder="Your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
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

      <LoadingButton type="submit" variant="cta" size="xl" isLoading={isSubmitting} className="w-full">
        Sign in
        {!isSubmitting && <ArrowRight aria-hidden="true" />}
      </LoadingButton>

      <Text tone="muted" className="text-center">
        New to the market? <TextLink href={publicRoutes.register}>Create a free account</TextLink>
      </Text>
    </Form>
  );
}

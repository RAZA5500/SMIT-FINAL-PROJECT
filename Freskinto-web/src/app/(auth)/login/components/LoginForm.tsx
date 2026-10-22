"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { CheckboxField } from "@/components/shared/CheckboxField";
import { InputField } from "@/components/shared/InputField";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { PasswordField } from "@/components/shared/PasswordField";
import { scrollToFirstError } from "@/lib/forms";
import { homeForRole, publicRoutes, safeRedirect } from "@/lib/routes/routes";
import { toastError, toastSuccess } from "@/lib/toast";
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
    <form
      id={FORM_ID}
      noValidate
      className="flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit, () => scrollToFirstError(FORM_ID))}
    >
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
      <div className="flex flex-col gap-2">
        <PasswordField
          id="password"
          label="Password"
          placeholder="Your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Link
          className="self-end text-sm font-semibold text-brand hover:underline"
          href={publicRoutes.forgotPassword}
        >
          Forgot password?
        </Link>
      </div>

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

      <LoadingButton type="submit" size="xl" isLoading={login.isPending} loadingText="Signing in..." className="w-full">
        Sign in
        <ArrowRight aria-hidden="true" />
      </LoadingButton>

      <p className="text-center text-sm text-muted-foreground">
        New to Freskinto?{" "}
        <Link className="font-semibold text-brand hover:underline" href={publicRoutes.register}>
          Create a free account
        </Link>
      </p>
    </form>
  );
}

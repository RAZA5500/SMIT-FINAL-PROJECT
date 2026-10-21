"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { CheckboxField } from "@/components/shared/CheckboxField";
import { InputField } from "@/components/shared/InputField";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { PasswordField } from "@/components/shared/PasswordField";
import { scrollToFirstError } from "@/lib/forms";
import { ApiError } from "@/lib/networking/request";
import { publicRoutes } from "@/lib/routes/routes";
import { toastError, toastSuccess } from "@/lib/toast";
import { registerSchema, type RegisterFormData } from "@/modules/zod/register.model";
import { useRegister } from "@/services/auth/mutations";

const FORM_ID = "register-form";

export function RegisterForm() {
  const router = useRouter();
  const registerUser = useRegister();

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "", terms: false },
  });

  const onSubmit = (data: RegisterFormData) => {
    // Form `fullName`, API `name` — mapping submit handler mein (FLOW-MD 08 §10)
    registerUser.mutate(
      { name: data.fullName, email: data.email, password: data.password },
      {
        onSuccess: () => {
          toastSuccess("Account created", "Sign in to start your first basket.");
          router.push(publicRoutes.login);
        },
        onError: (error) => {
          // 409 email exists → field par hi dikhao (FLOW-MD 09 §3.4)
          if (error instanceof ApiError && error.status === 409) {
            setError("email", { message: error.message });
          }
          toastError("Registration failed", error.message);
        },
      },
    );
  };

  return (
    <form
      id={FORM_ID}
      noValidate
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit, () => scrollToFirstError(FORM_ID))}
    >
      <InputField
        id="fullName"
        label="Full name"
        required
        placeholder="Ayesha Khan"
        autoComplete="name"
        leftIcon={<UserRound aria-hidden="true" />}
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <InputField
        id="email"
        type="email"
        label="Email"
        required
        placeholder="you@example.com"
        autoComplete="username"
        leftIcon={<Mail aria-hidden="true" />}
        error={errors.email?.message}
        {...register("email")}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <PasswordField
          id="password"
          label="Password"
          required
          placeholder="8+ characters"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          required
          placeholder="Repeat password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>

      <Controller
        control={control}
        name="terms"
        render={({ field }) => (
          <CheckboxField
            id="terms"
            className="pt-1"
            checked={field.value}
            onCheckedChange={field.onChange}
            error={errors.terms?.message}
            label="I agree to the Terms of Service and Privacy Policy"
          />
        )}
      />

      <LoadingButton
        type="submit"
        size="xl"
        isLoading={registerUser.isPending}
        loadingText="Creating account..."
        className="mt-1 w-full"
      >
        Create account
        <ArrowRight aria-hidden="true" />
      </LoadingButton>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="font-semibold text-brand hover:underline" href={publicRoutes.login}>
          Sign in
        </Link>
      </p>
    </form>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CheckboxField } from "@/components/shared/CheckboxField";
import { InputField } from "@/components/shared/InputField";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { scrollToFirstError } from "@/lib/forms";
import { ApiError } from "@/lib/networking/request";
import { publicRoutes } from "@/lib/routes/routes";
import { toastError, toastSuccess } from "@/lib/toast";
import { registerSchema, type RegisterFormData } from "@/modules/zod/register.model";
import { useRegister } from "@/services/auth/mutations";

const FORM_ID = "register-form";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
          toastSuccess("Account created", "You can now sign in.");
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
      className="flex flex-col gap-3 md:gap-4"
      onSubmit={handleSubmit(onSubmit, () => scrollToFirstError(FORM_ID))}
    >
      <InputField
        id="fullName"
        label="Full Name"
        required
        placeholder="John Doe"
        autoComplete="name"
        leftIcon={<User className="size-4" aria-hidden="true" />}
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <InputField
        id="email"
        type="email"
        label="Email"
        required
        placeholder="john.doe@example.com"
        autoComplete="username"
        leftIcon={<Mail className="size-4" aria-hidden="true" />}
        error={errors.email?.message}
        {...register("email")}
      />
      <InputField
        id="password"
        type={showPassword ? "text" : "password"}
        label="Password"
        required
        placeholder="Create a strong password"
        autoComplete="new-password"
        leftIcon={<Lock className="size-4" aria-hidden="true" />}
        rightIcon={
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        }
        error={errors.password?.message}
        {...register("password")}
      />
      <InputField
        id="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        label="Confirm Password"
        required
        placeholder="Confirm your password"
        autoComplete="new-password"
        leftIcon={<Lock className="size-4" aria-hidden="true" />}
        rightIcon={
          <button
            type="button"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            onClick={() => setShowConfirmPassword((value) => !value)}
          >
            {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        }
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

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
            label={
              <span className="text-fs-12">
                I agree to the <span className="text-brand-green">Terms of Service</span> and{" "}
                <span className="text-brand-green">Privacy Policy</span>
              </span>
            }
          />
        )}
      />

      <LoadingButton
        type="submit"
        size="xl"
        isLoading={registerUser.isPending}
        loadingText="Creating account..."
        className="mt-2 w-full bg-brand-gradient font-semibold text-white shadow-md hover:opacity-95"
      >
        Create Account
        <ArrowRight aria-hidden="true" />
      </LoadingButton>

      <p className="pt-3 text-center text-sm text-gray-500 md:pt-5">
        Already have an account?{" "}
        <Link className="font-semibold text-brand-green hover:underline" href={publicRoutes.login}>
          Sign in now
        </Link>
      </p>
    </form>
  );
}

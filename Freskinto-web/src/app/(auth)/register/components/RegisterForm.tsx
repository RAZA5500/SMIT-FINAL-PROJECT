"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle, Mail, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { CheckboxField } from "@/components/shared/CheckboxField";
import { InputField } from "@/components/shared/InputField";
import { PasswordField } from "@/components/shared/PasswordField";
import { PasswordStrength } from "@/components/shared/PasswordStrength";
import { TextLink } from "@/components/shared/TextLink";
import { ApiError } from "@/lib/api";
import { publicRoutes } from "@/lib/routes/routes";
import { toastError, toastSuccess } from "@/lib/toast";
import { scrollToFirstError } from "@/lib/utils";
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
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "", terms: false },
  });

  const passwordValue = useWatch({ control, name: "password" }) ?? "";

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Form `fullName`, API `name` — mapping submit handler mein (FLOW-MD 08 §10)
      await registerUser.mutateAsync({ name: data.fullName, email: data.email, password: data.password });
      toastSuccess("Account created", "Sign in to start your first basket.");
      router.push(publicRoutes.login);
    } catch (error) {
      // 409 email exists → field par hi dikhao (FLOW-MD 09 §3.4)
      if (error instanceof ApiError && error.status === 409) {
        setError("email", { message: error.message });
      }
      toastError("Registration failed", (error as Error).message);
    }
  };

  return (
    <form
      id={FORM_ID}
      noValidate
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(onSubmit, () => scrollToFirstError(FORM_ID))}
    >
      <FieldGroup>
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
        <div className="flex flex-col gap-3">
          <PasswordField
            id="password"
            label="Password"
            required
            placeholder="8+ characters"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordStrength password={passwordValue} />
        </div>
        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          required
          placeholder="Repeat password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Controller
          control={control}
          name="terms"
          render={({ field }) => (
            <CheckboxField
              id="terms"
              checked={field.value}
              onCheckedChange={field.onChange}
              error={errors.terms?.message}
              label="I agree to the Terms of Service and Privacy Policy"
            />
          )}
        />
      </FieldGroup>

      <Button type="submit" variant="signin" size="xl" disabled={isSubmitting} className="w-full">
        {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        Create account
        {!isSubmitting && <ArrowRight aria-hidden="true" />}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account? <TextLink href={publicRoutes.login}>Sign in</TextLink>
      </p>
    </form>
  );
}

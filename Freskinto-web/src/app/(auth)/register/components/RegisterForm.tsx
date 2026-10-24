"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { Stack } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/typography";
import { CheckboxField } from "@/components/shared/CheckboxField";
import { InputField } from "@/components/shared/InputField";
import { LoadingButton } from "@/components/shared/LoadingButton";
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
      // Form `fullName`, API `name` — mapping submit handler mein
      await registerUser.mutateAsync({ name: data.fullName, email: data.email, password: data.password });
      toastSuccess("Account created", "Sign in to start your first basket.");
      router.push(publicRoutes.login);
    } catch (error) {
      // 409 email exists → field par hi dikhao
      if (error instanceof ApiError && error.status === 409) {
        setError("email", { message: error.message });
      }
      toastError("Registration failed", (error as Error).message);
    }
  };

  return (
    <Form id={FORM_ID} onSubmit={handleSubmit(onSubmit, () => scrollToFirstError(FORM_ID))} className="space-y-4">
      <FieldGroup className="gap-4">
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
        <Stack gap="2.5">
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
        </Stack>
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

      <LoadingButton type="submit" variant="fresh" size="xl" isLoading={isSubmitting} className="w-full shadow-soft">
        Create account
        {!isSubmitting && <ArrowRight aria-hidden="true" />}
      </LoadingButton>

      <Text tone="muted" className="text-center text-fs-14">
        Already have an account?{" "}
        <TextLink href={publicRoutes.login} className="font-semibold text-foreground hover:text-brand">
          Sign in
        </TextLink>
      </Text>
    </Form>
  );
}

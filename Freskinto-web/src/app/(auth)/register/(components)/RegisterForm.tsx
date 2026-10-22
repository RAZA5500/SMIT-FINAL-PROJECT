"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { Flex, Stack } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/typography";
import { CheckboxField } from "@/components/shared/CheckboxField";
import { InputField } from "@/components/shared/InputField";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { PasswordField } from "@/components/shared/PasswordField";
import { TextLink } from "@/components/shared/TextLink";
import { scrollToFirstError } from "@/lib/forms";
import { ApiError } from "@/lib/networking/request";
import { publicRoutes } from "@/lib/routes/routes";
import { toastError, toastSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { registerSchema, type RegisterFormData } from "@/modules/zod/register.model";
import { useRegister } from "@/services/auth/mutations";

const FORM_ID = "register-form";

function getPasswordStrength(pass: string): { score: number; label: string; tone: string } {
  if (!pass) return { score: 0, label: "", tone: "" };
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
  if (/\d/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  if (score <= 1) return { score: 1, label: "Weak", tone: "bg-tomato" };
  if (score === 2) return { score: 2, label: "Fair", tone: "bg-saffron" };
  if (score === 3) return { score: 3, label: "Good", tone: "bg-brand-green" };
  return { score: 4, label: "Strong", tone: "bg-brand-green" };
}

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

  const passwordValue = useWatch({ control, name: "password" }) ?? "";
  const strength = getPasswordStrength(passwordValue);

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
    <Form id={FORM_ID} onSubmit={handleSubmit(onSubmit, () => scrollToFirstError(FORM_ID))}>
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
        <Grid gap="5" className={cn("sm:grid-cols-2")}>
          <Stack gap="2">
            <PasswordField
              id="password"
              label="Password"
              required
              placeholder="8+ characters"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register("password")}
            />
            {passwordValue && (
              <Stack gap="1.5" className={cn("pt-1")}>
                <Flex gap="1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors duration-200",
                        strength.score >= step ? strength.tone : "bg-muted",
                      )}
                    />
                  ))}
                </Flex>
                <Flex justify="between" align="center">
                  <Text variant="small" tone="muted" className={cn("text-xs")}>
                    Strength: <span className="font-medium text-foreground">{strength.label}</span>
                  </Text>
                  <Text variant="small" tone="muted" className={cn("text-xs")}>
                    8+ characters
                  </Text>
                </Flex>
              </Stack>
            )}
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
        </Grid>
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

      <LoadingButton
        type="submit"
        size="xl"
        variant="signin"
        isLoading={registerUser.isPending}
        loadingText="Creating account…"
        className={cn("w-full shadow-md shadow-brand-green/20")}
      >
        Create account
        <ArrowRight data-icon="inline-end" aria-hidden="true" />
      </LoadingButton>

      <Text tone="muted" className={cn("text-center")}>
        Already have an account? <TextLink href={publicRoutes.login}>Sign in</TextLink>
      </Text>
    </Form>
  );
}

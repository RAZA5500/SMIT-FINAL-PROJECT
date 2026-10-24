"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, LayoutDashboard, Mail, ShoppingBasket, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
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
import { homeForRole, publicRoutes, safeRedirect } from "@/lib/routes/routes";
import { toastError, toastSuccess } from "@/lib/toast";
import { cn, scrollToFirstError } from "@/lib/utils";
import { loginSchema, type LoginFormData } from "@/modules/zod/login.model";
import { useLogin } from "@/services/auth/mutations";
import type { UserRole } from "@/services/auth/types";
import { useAuthStore } from "@/stores/auth-store";

const FORM_ID = "login-form";

/** Seed data ke test accounts — click par form bhar dete hain */
const DEMO_ACCOUNTS = [
  { label: "Customer Demo", hint: "Shop & check out", icon: ShoppingBasket, email: "ali@test.local", password: "secret123" },
  { label: "Admin Demo", hint: "Run the store", icon: LayoutDashboard, email: "admin@freskinto.com", password: "Admin@123" },
];

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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const emailValue = useWatch({ control, name: "email" });

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
    <Form id={FORM_ID} onSubmit={handleSubmit(onSubmit, () => scrollToFirstError(FORM_ID))} className="space-y-4">
      <FieldGroup className="gap-4">
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
        <Flex align="center" justify="between" className="pt-0.5">
          <Controller
            control={control}
            name="rememberMe"
            render={({ field }) => (
              <CheckboxField
                id="rememberMe"
                label="Keep me signed in"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <TextLink
            href={publicRoutes.forgotPassword}
            className="text-fs-12 text-muted-foreground hover:text-foreground shrink-0"
          >
            Forgot password?
          </TextLink>
        </Flex>
      </FieldGroup>

      {/* Quick 1-click test accounts for evaluators & developers */}
      <Box className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-3">
        <Flex align="center" justify="between" className="mb-2.5">
          <Flex align="center" gap="1.5">
            <Sparkles aria-hidden="true" className="size-3.5 text-brand" />
            <Text as="span" weight="semibold" className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Demo accounts
            </Text>
          </Flex>
          <Text as="span" tone="muted" className="text-[11px]">
            1-click auto fill
          </Text>
        </Flex>
        <Grid gap="2" className="grid-cols-2">
          {DEMO_ACCOUNTS.map(({ label, hint, icon: Icon, email, password }) => {
            const selected = emailValue === email;
            return (
              <Button
                key={email}
                type="button"
                variant="outline"
                aria-pressed={selected}
                onClick={() => {
                  setValue("email", email, { shouldValidate: true });
                  setValue("password", password, { shouldValidate: true });
                }}
                className={cn(
                  "group/demo h-auto justify-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition-[border-color,background-color,translate] duration-300 ease-out-expo hover:-translate-y-0.5",
                  selected && "border-brand/60 bg-brand-soft hover:bg-brand-soft",
                )}
              >
                <Flex
                  as="span"
                  align="center"
                  justify="center"
                  className={cn(
                    "size-8 shrink-0 rounded-lg bg-muted text-muted-foreground transition-[color,background-color,rotate] duration-500 ease-spring group-hover/demo:-rotate-6",
                    selected && "bg-fresh text-[#06100b]",
                  )}
                >
                  {selected ? <Check aria-hidden="true" className="size-4" /> : <Icon aria-hidden="true" className="size-4" />}
                </Flex>
                <Stack as="span" gap="0" className="min-w-0">
                  <Text as="span" weight="semibold" className="text-fs-12">
                    {label}
                  </Text>
                  <Text as="span" tone="muted" className="truncate text-[11px]">
                    {hint}
                  </Text>
                </Stack>
              </Button>
            );
          })}
        </Grid>
      </Box>

      <LoadingButton type="submit" variant="fresh" size="xl" isLoading={isSubmitting} className="w-full shadow-soft">
        Sign in
        {!isSubmitting && <ArrowRight aria-hidden="true" />}
      </LoadingButton>

      <Text tone="muted" className="text-center text-fs-14">
        New to the market?{" "}
        <TextLink href={publicRoutes.register} className="font-semibold text-foreground hover:text-brand">
          Create a free account
        </TextLink>
      </Text>
    </Form>
  );
}

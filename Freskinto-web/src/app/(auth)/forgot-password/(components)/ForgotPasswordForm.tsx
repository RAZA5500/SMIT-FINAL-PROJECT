"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, LifeBuoy, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { InputField } from "@/components/shared/InputField";
import { TextLink } from "@/components/shared/TextLink";
import { STORE } from "@/constants/store";
import { scrollToFirstError } from "@/lib/forms";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

const FORM_ID = "forgot-password-form";

const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

/**
 * Static mock (user decision). Reset emails backend mein nahi — is liye UI jhoot
 * nahi bolti ke email bhej di; support ka rasta batati hai.
 */
export function ForgotPasswordForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  if (submittedEmail) {
    return (
      <Stack gap="5">
        <Alert variant="warning">
          <LifeBuoy aria-hidden="true" />
          <AlertTitle>Email reset isn&apos;t available yet</AlertTitle>
          <AlertDescription>
            <Text as="span">
              We can&apos;t send reset links from this store yet. Email{" "}
              <TextLink href={`mailto:${STORE.supportEmail}`} underline>
                {STORE.supportEmail}
              </TextLink>{" "}
              from <Text as="strong" weight="semibold" tone="default">{submittedEmail}</Text> and we&apos;ll help you
              get back in.
            </Text>
          </AlertDescription>
        </Alert>
        <ButtonLink href={publicRoutes.login} variant="outline" size="xl" className={cn("w-full")}>
          <ArrowLeft data-icon="inline-start" aria-hidden="true" />
          Back to sign in
        </ButtonLink>
      </Stack>
    );
  }

  return (
    <Form id={FORM_ID} onSubmit={handleSubmit(({ email }) => setSubmittedEmail(email), () => scrollToFirstError(FORM_ID))}>
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
      <Button type="submit" size="xl" variant="brand" className={cn("w-full shadow-md shadow-brand-green/20")}>
        Continue
        <ArrowRight data-icon="inline-end" aria-hidden="true" />
      </Button>
      <ButtonLink href={publicRoutes.login} variant="ghost" className={cn("w-full")}>
        <ArrowLeft data-icon="inline-start" aria-hidden="true" />
        Back to sign in
      </ButtonLink>
    </Form>
  );
}

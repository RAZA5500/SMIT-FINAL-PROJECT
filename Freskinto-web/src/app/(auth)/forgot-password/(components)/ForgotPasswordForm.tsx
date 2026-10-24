"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, LifeBuoy, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Alert, AlertBody, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FieldGroup } from "@/components/ui/field";
import { Stack } from "@/components/ui/flex";
import { Form } from "@/components/ui/form";
import { Text } from "@/components/ui/typography";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { InputField } from "@/components/shared/InputField";
import { LoadingButton } from "@/components/shared/LoadingButton";
import { TextLink } from "@/components/shared/TextLink";
import { STORE } from "@/constants/store";
import { publicRoutes } from "@/lib/routes/routes";
import { cn, scrollToFirstError } from "@/lib/utils";

const FORM_ID = "forgot-password-form";

const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

/**
 * Static mock (FLOW-MD 01 / README §Scope). Email delivery is out of scope for the student
 * implementation; this screen guides the customer to support without pretending an email was sent.
 */
export function ForgotPasswordForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
          <AlertBody>
            <AlertTitle>Email reset isn&apos;t available yet</AlertTitle>
            <AlertDescription>
              <Text as="span">
                We can&apos;t send reset links from this store yet. Email{" "}
                <TextLink href={`mailto:${STORE.supportEmail}`} underline>
                  {STORE.supportEmail}
                </TextLink>{" "}
                from <Text as="strong" weight="semibold">{submittedEmail}</Text> and we&apos;ll help you get back in.
              </Text>
            </AlertDescription>
          </AlertBody>
        </Alert>
        <ButtonLink href={publicRoutes.login} variant="outline" size="xl" className={cn("w-full")}>
          <ArrowLeft aria-hidden="true" />
          Back to sign in
        </ButtonLink>
      </Stack>
    );
  }

  return (
    <Form
      id={FORM_ID}
      onSubmit={handleSubmit(({ email }) => setSubmittedEmail(email), () => scrollToFirstError(FORM_ID))}
      className={cn("gap-5")}
    >
      <FieldGroup className={cn("gap-4")}>
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
      </FieldGroup>
      <LoadingButton
        type="submit"
        size="xl"
        variant="fresh"
        isLoading={isSubmitting}
        className={cn("w-full shadow-soft")}
      >
        Continue
        {!isSubmitting && <ArrowRight aria-hidden="true" />}
      </LoadingButton>
      <ButtonLink href={publicRoutes.login} variant="ghost" className={cn("w-full")}>
        <ArrowLeft aria-hidden="true" />
        Back to sign in
      </ButtonLink>
    </Form>
  );
}

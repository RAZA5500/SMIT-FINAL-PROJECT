"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, LifeBuoy, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { InputField } from "@/components/shared/InputField";
import { Button, buttonVariants } from "@/components/ui/button";
import { publicRoutes } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

const SUPPORT_EMAIL = "hello@freskinto.co.uk";

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
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3 rounded-2xl bg-saffron-soft p-5 text-sm ring-1 ring-saffron/40">
          <p className="flex items-center gap-2 font-semibold text-warning">
            <LifeBuoy className="size-5" aria-hidden="true" />
            Email reset isn&apos;t available yet
          </p>
          <p className="text-foreground/80">
            We can&apos;t send reset links from this store yet. Email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-brand underline">
              {SUPPORT_EMAIL}
            </a>{" "}
            from <span className="font-semibold">{submittedEmail}</span> and we&apos;ll help you get back in.
          </p>
        </div>
        <Link href={publicRoutes.login} className={cn(buttonVariants({ variant: "outline", size: "xl" }), "w-full")}>
          <ArrowLeft aria-hidden="true" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={handleSubmit(({ email }) => setSubmittedEmail(email))}
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
      <Button type="submit" size="xl" className="w-full">
        Continue
        <ArrowRight aria-hidden="true" />
      </Button>
      <Link href={publicRoutes.login} className={cn(buttonVariants({ variant: "ghost" }), "w-full")}>
        <ArrowLeft aria-hidden="true" />
        Back to sign in
      </Link>
    </form>
  );
}

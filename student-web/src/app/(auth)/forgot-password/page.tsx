"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AuthBackground,
  MailIcon,
  authButtonClass,
  authInputClass,
  authLabelClass,
} from "@/components/customer/auth-chrome";

const SECONDARY_BUTTON_CLASS =
  "group/button inline-flex shrink-0 items-center justify-center rounded-5 bg-clip-padding whitespace-nowrap transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 cursor-pointer hover:-translate-y-0.5 hover:opacity-95 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 gap-1 px-2 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5 w-full h-11 rounded-15! border border-gray-200 bg-white text-sm font-semibold text-gray-dark hover:bg-gray-50";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Check your inbox", {
      description: "If that email is registered, a reset link is on its way.",
    });
  }

  return (
    <div className="min-h-screen auth-page">
      <div className="min-h-screen flex items-center justify-center px-4 py-6 relative">
        <AuthBackground />

        <div className="w-full max-w-auth-container flex flex-col lg:flex-row lg:items-stretch lg:gap-auth-split relative z-10">
          <div className="flex flex-col gap-4 items-center px-4 lg:shrink-0 lg:px-0 lg:mx-auto w-full lg:w-[472px]">
            <div className="bg-white shadow-form shadow-lg p-6 sm:p-8 lg:p-10 border border-border-light rounded-2xl w-full max-w-md">
              <div className="mb-4 md:mb-8 text-left">
                <h1 className="font-inter font-semibold text-fs-20 text-gray-dark md:text-3xl leading-9">
                  Forgot your Password?
                </h1>
                <p className="pt-2 font-inter font-normal text-gray-medium text-sm leading-6">
                  Enter the email associated with your account and we&#39;ll send you a link to reset your
                  password.
                </p>
              </div>

              <form className="space-y-1 md:space-y-1.5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1.5">
                  <label data-slot="label" className={authLabelClass} htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <span className="left-3 absolute flex items-center text-placeholder pointer-events-none">
                      <MailIcon />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      data-slot="input"
                      placeholder="Enter your email address"
                      aria-invalid="false"
                      autoComplete="username"
                      className={`${authInputClass} pl-10`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2 md:pt-3">
                  <button
                    type="submit"
                    tabIndex={0}
                    data-slot="button"
                    className={`${authButtonClass} w-full h-11`}
                    style={{ background: "var(--brand-gradient)" }}
                  >
                    Send
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-right"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    tabIndex={0}
                    data-slot="button"
                    className={SECONDARY_BUTTON_CLASS}
                    onClick={() => router.push("/login")}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </div>

            <p className="text-center font-inter font-normal text-sm leading-5 text-ink mt-3">
              © 2026 FreshStock. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

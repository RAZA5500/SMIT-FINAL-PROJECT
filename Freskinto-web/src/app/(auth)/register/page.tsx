import type { Metadata } from "next";
import { AuthHeading } from "@/components/customer/auth/AuthHeading";
import { RegisterForm } from "./components/RegisterForm";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <>
      <AuthHeading
        eyebrow="Join the market"
        title="Create your account"
        subtitle="Free delivery, saved addresses and order tracking — set up in under a minute."
      />
      <RegisterForm />
    </>
  );
}

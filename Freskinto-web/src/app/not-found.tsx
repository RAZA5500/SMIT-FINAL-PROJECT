import type { Metadata } from "next";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { customerRoutes, publicRoutes } from "@/lib/routes/routes";

export const metadata: Metadata = { title: "Page not found" };

/** 404 — editorial: bada serif "404", ek line, aur wapas jaane ke do raaste */
export default function NotFound() {
  return (
    <main id="content" className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <Logo size="md" />
      <div className="flex flex-col items-center gap-4">
        <p aria-hidden="true" className="bg-brand-gradient bg-clip-text text-fs-80 leading-none font-bold text-transparent">
          404
        </p>
        <h1 className="font-heading text-fs-32 sm:text-fs-40">Page not found</h1>
        <p className="max-w-md text-muted-foreground">
          The page you&apos;re looking for has moved or doesn&apos;t exist.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <ButtonLink href={publicRoutes.shop} variant="cta" size="xl">
          Back to the shop
        </ButtonLink>
        <ButtonLink href={customerRoutes.orders} variant="outline" size="xl" className="rounded-full">
          My orders
        </ButtonLink>
      </div>
    </main>
  );
}

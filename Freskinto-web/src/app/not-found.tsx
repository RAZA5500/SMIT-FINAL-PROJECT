import { ArrowRight, House } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { buttonVariants } from "@/components/ui/button";
import { publicRoutes, shopUrl } from "@/lib/routes/routes";

export default function NotFound() {
  return (
    <main id="content" className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <Link href={publicRoutes.home} aria-label="Freskinto home" className="rounded-lg">
        <Logo />
      </Link>
      <div className="flex flex-col items-center gap-3">
        <p className="font-display text-8xl leading-none font-bold text-outline text-brand-soft">404</p>
        <h1 className="text-3xl font-bold sm:text-4xl">This aisle doesn&apos;t exist</h1>
        <p className="max-w-md text-muted-foreground">
          The page you&apos;re looking for has moved or never existed. Let&apos;s get you back to the fresh stuff.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href={shopUrl()} className={buttonVariants({ size: "lg" })}>
          Browse the shop
          <ArrowRight aria-hidden="true" />
        </Link>
        <Link href={publicRoutes.home} className={buttonVariants({ variant: "outline", size: "lg" })}>
          <House aria-hidden="true" />
          Home
        </Link>
      </div>
    </main>
  );
}

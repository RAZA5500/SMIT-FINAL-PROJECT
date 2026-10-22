import { ArrowLeft, PackageCheck, Store, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/shared/Logo";
import { packshotUrl } from "@/lib/merchandising";
import { publicRoutes } from "@/lib/routes/routes";

/** Store ke asli features — panel par marketing claims nahi */
const PERKS = [
  { icon: Truck, text: "Free delivery on every order" },
  { icon: Store, text: "Click & collect at a time you choose" },
  { icon: PackageCheck, text: "Track every order from basket to door" },
];

const YEAR = new Date().getFullYear();

const COLLAGE = [
  { image: "premium-bananas", className: "-rotate-6" },
  { image: "fresh-bell-peppers", className: "translate-y-6 rotate-3" },
  { image: "fresh-whole-milk-1l", className: "-translate-y-2 rotate-6" },
  { image: "whole-wheat-bread-loaf", className: "-rotate-3" },
  { image: "royal-gala-apples", className: "translate-y-4 rotate-2" },
  { image: "fresh-chicken-breast", className: "-translate-y-3 -rotate-6" },
];

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** /login, /register, /forgot-password ka frame — brand panel + form */
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="grid min-h-dvh flex-1 lg:grid-cols-2">
      <aside className="relative isolate hidden flex-col justify-between overflow-hidden bg-muted p-12 text-foreground lg:flex xl:p-16">
        <div className="bg-dots absolute inset-0 -z-10 text-foreground/5" aria-hidden="true" />
        <div className="absolute -right-32 -bottom-32 -z-10 size-96 rounded-full bg-white blur-3xl" aria-hidden="true" />

        <Link href={publicRoutes.home} aria-label="Freskinto home" className="w-fit rounded-lg">
          <Logo size="lg" />
        </Link>

        <div className="flex flex-col gap-10">
          <ul className="grid max-w-md grid-cols-3 gap-4" aria-hidden="true">
            {COLLAGE.map((shot) => (
              <li key={shot.image} className={shot.className}>
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-lift">
                  <Image src={packshotUrl(shot.image)} alt="" fill sizes="140px" className="object-contain p-2" />
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-4xl leading-tight font-bold xl:text-5xl">
              Your <span className="text-brand">fresh market</span>, delivered.
            </h2>
            <ul className="flex flex-col gap-3">
              {PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-foreground/80">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-white text-brand ring-1 ring-border">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">© {YEAR} Freskinto · Fresh groceries, delivered free</p>
      </aside>

      <main id="content" className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href={publicRoutes.home} aria-label="Freskinto home" className="rounded-lg lg:invisible">
            <Logo size="sm" />
          </Link>
          <Link
            href={publicRoutes.shop}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to shop
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 py-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

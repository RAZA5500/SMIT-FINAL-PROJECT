import { ArrowLeft, PackageCheck, Store, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { Logo } from "@/components/shared/Logo";
import { STORE } from "@/constants/store";
import { publicRoutes } from "@/lib/routes/routes";

/** Store ke asli features — panel par marketing claims nahi */
const PERKS = [
  { icon: Truck, text: "Free delivery on every order" },
  { icon: Store, text: "Click & collect at a time you choose" },
  { icon: PackageCheck, text: "Track every order from basket to door" },
];

/** Module load par ek dafa — render ke dauran current date nahi padhte */
const YEAR = new Date().getFullYear();

/** /login aur /register ka split-screen frame: form left, modern gradient panel right (lg+) */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh flex-1 lg:grid-cols-2">
      <main id="content" className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={publicRoutes.home}
            aria-label={`${STORE.name} home`}
            className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <Logo size="md" />
          </Link>
          <ButtonLink href={publicRoutes.shop} variant="ghost" size="sm" className="rounded-full">
            <ArrowLeft aria-hidden="true" />
            Back to shop
          </ButtonLink>
        </div>

        <div className="mx-auto flex w-full max-w-form flex-1 flex-col justify-center gap-8 py-12">{children}</div>

        <p className="text-fs-12 text-muted-foreground">
          © {YEAR} {STORE.name} · Demo store — no real payments are taken.
        </p>
      </main>

      <aside
        aria-label={`Why shop with ${STORE.name}`}
        className="relative isolate hidden flex-col justify-end gap-8 overflow-hidden bg-brand-green-forest p-12 text-white lg:flex xl:p-16"
      >
        <Image
          src="/images/editorial/produce-market.webp"
          alt=""
          fill
          priority
          sizes="50vw"
          className="-z-20 object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-brand-green-forest via-brand-green-forest/75 to-brand-green-forest/25" />

        <div className="flex max-w-lg flex-col gap-4">
          <p className="text-fs-11 font-bold tracking-widest text-brand-green-vivid uppercase">The neighbourhood market</p>
          <h2 className="text-fs-48 leading-tight font-bold text-white">
            Fresh from the stalls, <span className="text-brand-green-vivid">straight to your table.</span>
          </h2>
        </div>

        <ul className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
          {PERKS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm font-medium text-white/95">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-green-vivid/20 text-brand-green-vivid ring-1 ring-brand-green-vivid/30">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

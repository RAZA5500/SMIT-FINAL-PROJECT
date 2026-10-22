import { Clock, Store, Truck } from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/shared/ButtonLink";
import { STORE } from "@/constants/store";

/** Store ke asli wade — FLOW-MD 01 (shipping 0, pickup slot, payment window) */
const PERKS = [
  { icon: Truck, title: "Free delivery", text: "On every order, no minimum" },
  { icon: Store, title: "Click & collect", text: "Choose a time that suits you" },
  { icon: Clock, title: "Pay in minutes", text: `Confirmed when you pay (${STORE.paymentWindowMinutes} min window)` },
];

/** Modern hero: bold sans headline, gradient accent, two CTAs, photo collage (lg+) */
export function ShopHero() {
  return (
    <section aria-labelledby="shop-hero-title" className="relative isolate overflow-hidden rounded-2xl bg-brand-soft">
      <div aria-hidden="true" className="texture-dots absolute inset-0 -z-10 text-brand-green/5" />
      <div className="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:gap-6 lg:p-14">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <p className="kicker flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-brand-green" />
            The neighbourhood market
          </p>
          <h1 id="shop-hero-title" className="animate-fade-up text-fs-48 text-foreground sm:text-fs-64">
            Fresh from the market,{" "}
            <span className="bg-brand-gradient bg-clip-text font-bold text-transparent">delivered to your door.</span>
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Produce, poultry, dairy and everyday essentials from your neighbourhood stalls — free delivery on every
            order, or collect it in an hour.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="#products" variant="cta" size="xl">
              Start shopping
            </ButtonLink>
            <ButtonLink href="#aisles" variant="outline" size="xl" className="rounded-full">
              Browse aisles
            </ButtonLink>
          </div>
          <ul className="grid gap-4 border-t border-brand-green/10 pt-6 sm:grid-cols-3">
            {PERKS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-brand-green shadow-soft"
                >
                  <Icon className="size-4" />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">{title}</span>
                  <span className="text-fs-12 text-muted-foreground">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div aria-hidden="true" className="relative hidden aspect-square grid-cols-6 grid-rows-6 gap-3 lg:col-span-5 lg:grid">
          <div className="relative col-span-4 col-start-1 row-span-4 row-start-1 overflow-hidden rounded-2xl shadow-lift">
            <Image src="/images/editorial/produce-aisle.webp" alt="" fill priority sizes="30vw" className="object-cover" />
          </div>
          <div className="relative col-span-3 col-start-4 row-span-3 row-start-3 overflow-hidden rounded-2xl border-4 border-brand-soft shadow-lift">
            <Image src="/images/editorial/fruit-crates.webp" alt="" fill sizes="25vw" className="object-cover" />
          </div>
          <div className="relative col-span-2 col-start-1 row-span-2 row-start-5 overflow-hidden rounded-xl shadow-soft">
            <Image src="/images/editorial/cheese-board.webp" alt="" fill sizes="15vw" className="object-cover" />
          </div>
          <span className="absolute -top-1 right-4 animate-float rounded-lg bg-brand-green px-4 py-2 text-fs-13 font-bold text-white shadow-lift">
            Free delivery
          </span>
        </div>
      </div>
    </section>
  );
}

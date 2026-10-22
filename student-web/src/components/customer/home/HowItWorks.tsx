import { CreditCard, PackageCheck, ShoppingBasket } from "lucide-react";

/** Asli flow: basket → delivery/pickup + pay (5 min window) → status timeline */
const STEPS = [
  {
    icon: ShoppingBasket,
    title: "Fill your basket",
    text: "Browse aisles or search for what you need. Your basket is saved to your account.",
  },
  {
    icon: CreditCard,
    title: "Choose delivery or collection",
    text: "Delivery is free, or pick a collection time. Pay within 5 minutes to confirm your order.",
  },
  {
    icon: PackageCheck,
    title: "Track it to your door",
    text: "Follow every step from confirmed to delivered — and cancel any time before we start packing.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="container-page scroll-mt-24" aria-labelledby="how-heading">
      <div className="rounded-3xl bg-card p-6 shadow-soft ring-1 ring-border sm:p-10">
        <div className="flex max-w-xl flex-col gap-1">
          <p className="text-xs font-semibold tracking-widest text-brand uppercase">How it works</p>
          <h2 id="how-heading" className="text-2xl font-bold sm:text-3xl">
            Fresh food in three easy steps
          </h2>
        </div>
        <ol className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="relative flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <span className="font-display text-5xl leading-none font-bold text-foreground/10" aria-hidden="true">
                  0{index + 1}
                </span>
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

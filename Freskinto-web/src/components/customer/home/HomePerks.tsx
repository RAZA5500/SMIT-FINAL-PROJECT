import { Clock, ShieldCheck, Sun, Truck } from "lucide-react";

const VALUE_POINTS = [
  {
    icon: Sun,
    title: "Sourced At Dawn",
    description: "Picked fresh each morning from local market stalls and trusted British family growers.",
    tag: "Stall Fresh",
  },
  {
    icon: ShieldCheck,
    title: "Strict Cold-Chain",
    description: "Thermal insulated bags keep milk, cheeses, and cuts chilled at 4°C until your fridge.",
    tag: "Chilled & Safe",
  },
  {
    icon: Truck,
    title: "Zero Minimum Spend",
    description: "Need one lemon or the weekly grocery run? Delivery is always completely free of charge.",
    tag: "Free Always",
  },
  {
    icon: Clock,
    title: "60-Min Click & Collect",
    description: "Choose your convenient time slot. Pre-bagged, quality checked, and ready in minutes.",
    tag: "Quick Pickup",
  },
];

export function HomePerks() {
  return (
    <section aria-labelledby="perks-heading" className="rounded-3xl border border-border/80 bg-brand-soft/70 p-8 sm:p-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="text-fs-12 font-bold tracking-wider text-brand-green uppercase">
          The Freskinto Standard
        </span>
        <h2 id="perks-heading" className="font-heading text-fs-28 font-bold tracking-tight text-foreground sm:text-fs-36">
          Better Groceries. Better Planet. Better Price.
        </h2>
        <p className="mt-2 text-fs-14 text-muted-foreground">
          Why thousands of local families choose our neighbourhood market over generic industrial supermarkets.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {VALUE_POINTS.map(({ icon: Icon, title, description, tag }) => (
          <div
            key={title}
            className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-brand-green/30 hover:shadow-lift"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand-soft text-brand-green transition-colors group-hover:bg-brand-green group-hover:text-white">
                <Icon className="size-6" />
              </span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-fs-10 font-bold text-muted-foreground uppercase">
                {tag}
              </span>
            </div>

            <h3 className="mt-4 font-heading text-fs-18 font-bold text-foreground">
              {title}
            </h3>

            <p className="mt-2 text-fs-13 leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

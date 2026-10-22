import { ArrowRight, CalendarClock, Store, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { packshotUrl } from "@/lib/merchandising";
import { shopUrl } from "@/lib/routes/routes";
import { cn } from "@/lib/utils";

/** Do asli wade: shipping hamesha 0, aur PICKUP ke liye apna waqt (FLOW-MD 01 §14) */
export function PromoBand() {
  return (
    <section className="container-page grid gap-4 lg:grid-cols-5">
      <div className="relative isolate overflow-hidden rounded-3xl bg-brand-soft p-7 text-foreground sm:p-10 lg:col-span-3">
        <div className="relative z-10 flex max-w-md flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
            <Truck className="size-3.5" aria-hidden="true" />
            Delivery is on us
          </span>
          <h2 className="font-display text-3xl leading-tight font-bold sm:text-4xl">
            Free delivery on every single order.
          </h2>
          <p className="text-base text-foreground/70">
            No minimum spend and no surprise fees — the total in your basket is the total you pay.
          </p>
          <Link href={shopUrl()} className={cn(buttonVariants({ size: "xl" }), "w-fit")}>
            Fill your basket
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="pointer-events-none absolute -right-10 -bottom-10 hidden size-72 sm:block" aria-hidden="true">
          <Image
            src={packshotUrl("royal-gala-apples")}
            alt=""
            fill
            sizes="288px"
            className="blend-packshot object-contain"
          />
        </div>
      </div>

      <div className="relative isolate flex flex-col justify-between gap-6 overflow-hidden rounded-3xl bg-card p-7 text-foreground ring-1 ring-border sm:p-10 lg:col-span-2">
        <div className="bg-dots absolute inset-0 -z-10 text-foreground/5" aria-hidden="true" />
        <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <Store className="size-6" aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold sm:text-3xl">Rather pick it up?</h2>
          <p className="text-muted-foreground">
            Choose click &amp; collect at checkout and pick a time that suits you — we&apos;ll have it ready.
          </p>
        </div>
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
          <CalendarClock className="size-4" aria-hidden="true" />
          You choose the collection time
        </p>
      </div>
    </section>
  );
}

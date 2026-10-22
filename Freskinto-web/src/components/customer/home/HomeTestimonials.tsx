"use client";

import { CheckCircle2, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { TESTIMONIALS } from "@/data/testimonials";

export function HomeTestimonials() {
  const [filter, setFilter] = useState<"all" | "five">("all");

  const filteredTestimonials = TESTIMONIALS.filter((t) => {
    if (filter === "five") return t.rating === 5;
    return true;
  });

  return (
    <section aria-labelledby="testimonials-heading" className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-fs-12 font-bold text-amber-700">
              <Star aria-hidden="true" className="size-3.5 fill-amber-400 text-amber-400" />
              4.9 / 5 Overall Rating
            </span>
            <span className="text-fs-12 font-semibold text-muted-foreground">
              Based on 1,400+ orders
            </span>
          </div>

          <h2 id="testimonials-heading" className="font-heading text-fs-28 font-bold tracking-tight text-foreground sm:text-fs-36">
            Loved By Local Shoppers
          </h2>
          <p className="text-fs-14 text-muted-foreground">
            Read authentic reviews from neighbours who get their fresh produce and bakes delivered.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-full px-4 py-1.5 text-fs-12 font-semibold transition-all ${
              filter === "all"
                ? "bg-foreground text-background"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            All Feedback ({TESTIMONIALS.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("five")}
            className={`rounded-full px-4 py-1.5 text-fs-12 font-semibold transition-all ${
              filter === "five"
                ? "bg-foreground text-background"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            5-Star Only
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTestimonials.slice(0, 6).map((item) => (
          <article
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-brand-green/30 hover:shadow-lift"
          >
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    aria-hidden="true"
                    className={`size-4 ${
                      i < item.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="mt-4 text-fs-14 leading-relaxed text-foreground">
                &ldquo;{item.text}&rdquo;
              </p>
            </div>

            {/* Author details */}
            <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
              <div className="flex items-center gap-3">
                <div className="relative size-10 overflow-hidden rounded-full border border-border bg-muted">
                  <Image
                    src={item.photo}
                    alt={item.customer}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-fs-13 font-bold text-foreground">
                    {item.customer}
                  </span>
                  <span className="flex items-center gap-1 text-fs-11 text-emerald-600 font-medium">
                    <CheckCircle2 className="size-3" />
                    Verified Shopper
                  </span>
                </div>
              </div>

              <span className="text-fs-11 text-muted-foreground">
                {item.date}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

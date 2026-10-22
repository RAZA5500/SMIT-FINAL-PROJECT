"use client";

import { CheckCircle2, Flame, Sparkles, Store, Thermometer, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { shopUrl } from "@/lib/routes/routes";

const TICKER_ITEMS = [
  {
    icon: Flame,
    color: "text-amber-500",
    text: "Live Order: Sophie in Camden just ordered Royal Gala Apples (2m ago)",
  },
  {
    icon: Truck,
    color: "text-emerald-500",
    text: "14 zero-emission delivery vans on the road across London",
  },
  {
    icon: Thermometer,
    color: "text-sky-500",
    text: "Cold-chain guaranteed: All refrigerated vans held at 3.6°C",
  },
  {
    icon: Store,
    color: "text-brand-green",
    text: "Camden Market Stall open · Free same-day delivery on all orders",
  },
  {
    icon: Sparkles,
    color: "text-purple-500",
    text: "New Harvest: Organic heritage tomatoes just stocked",
  },
  {
    icon: CheckCircle2,
    color: "text-emerald-600",
    text: "Rated 4.9/5 from 1,420+ neighbourhood households",
  },
];

export function HomeLiveTicker() {
  const [paused, setPaused] = useState(false);

  return (
    <div
      aria-label="Live market activity updates"
      className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/80 py-2.5 shadow-soft backdrop-blur-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center">
        <div className="flex shrink-0 items-center gap-2 border-r border-border/80 px-4">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-fs-11 font-extrabold tracking-wider text-brand-green uppercase">
            Live Feed
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div
            className={`flex w-max items-center gap-10 whitespace-nowrap pl-6 ${
              paused ? "" : "animate-marquee"
            }`}
          >
            {/* Duplicated list to create infinite marquee */}
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="inline-flex items-center gap-2 text-fs-12 font-medium text-foreground">
                  <Icon className={`size-3.5 shrink-0 ${item.color}`} aria-hidden="true" />
                  <span>{item.text}</span>
                  <span className="text-muted-foreground/40 font-bold">·</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="hidden shrink-0 border-l border-border/80 px-4 sm:block">
          <Link
            href={shopUrl({ sort: "newest" })}
            className="text-fs-11 font-bold text-brand-green hover:text-brand-green-dark transition-colors"
          >
            Explore live stock →
          </Link>
        </div>
      </div>
    </div>
  );
}

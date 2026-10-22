"use client";

import { HomeAisles } from "@/components/customer/home/HomeAisles";
import { HomeFeaturedProducts } from "@/components/customer/home/HomeFeaturedProducts";
import { HomeFlashDeals } from "@/components/customer/home/HomeFlashDeals";
import { HomeHarvestBundle } from "@/components/customer/home/HomeHarvestBundle";
import { HomeHero } from "@/components/customer/home/HomeHero";
import { HomeLiveTicker } from "@/components/customer/home/HomeLiveTicker";
import { HomePerks } from "@/components/customer/home/HomePerks";
import { HomePromoBanner } from "@/components/customer/home/HomePromoBanner";
import { HomeTestimonials } from "@/components/customer/home/HomeTestimonials";

export function HomeView() {
  return (
    <div className="page-container flex flex-col gap-12 py-6 sm:gap-16 sm:py-10">
      <HomeHero />
      <HomeLiveTicker />
      <HomeFlashDeals />
      <HomeHarvestBundle />
      <HomeAisles />
      <HomeFeaturedProducts />
      <HomePerks />
      <HomeTestimonials />
      <HomePromoBanner />
    </div>
  );
}

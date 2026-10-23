"use client";

import { Container } from "@/components/ui/container";
import { HomeAisles } from "@/components/customer/home/HomeAisles";
import { HomeBento } from "@/components/customer/home/HomeBento";
import { HomeCta } from "@/components/customer/home/HomeCta";
import { HomeHero } from "@/components/customer/home/HomeHero";
import { HomeReviews } from "@/components/customer/home/HomeReviews";
import { HomeRibbons } from "@/components/customer/home/HomeRibbons";
import { HomeShelves } from "@/components/customer/home/HomeShelves";

/** Home: orbit hero → aisle ribbons → aisles → today's shelves → how it works → reviews → CTA */
export function HomeView() {
  return (
    <>
      <Container>
        <HomeHero />
      </Container>
      <HomeRibbons />
      <Container className="flex flex-col gap-28 py-16 sm:gap-36 sm:py-20">
        <HomeAisles />
        <HomeShelves />
        <HomeBento />
      </Container>
      <HomeReviews />
      <Container className="pt-28 sm:pt-36">
        <HomeCta />
      </Container>
    </>
  );
}
